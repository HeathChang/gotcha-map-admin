import axios, {
  AxiosHeaders,
  type AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { ENV } from '@/lib/env';
import type { AdminSession } from '@/types/admin.types';
import {
  getActiveAccessToken,
  getActiveSession,
  notifySessionUpdate,
} from '@/lib/auth/sessionToken';

export interface ApiErrorPayload {
  message: string;
  code?: string;
}

interface ApiEnvelope<T> {
  data: T;
  message?: string;
}

interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

// /admin/refresh 응답은 인터셉터의 envelope unwrap 을 통과한 뒤 raw 형태.
interface RefreshResponseBody {
  accessToken: string;
  accessExpiresInSec: number;
  refreshToken: string;
  refreshExpiresAt: string;
}

export class AdminApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = 'AdminApiError';
    this.status = status;
    this.code = code;
  }
}

// 동시에 다수 요청이 401 을 만났을 때 in-flight refresh 를 단일 Promise 로 공유.
let refreshPromise: Promise<AdminSession | null> | null = null;

function buildRefreshedSession(
  current: AdminSession,
  body: RefreshResponseBody,
): AdminSession {
  return {
    ...current,
    accessToken: body.accessToken,
    accessExpiresInSec: body.accessExpiresInSec,
    refreshToken: body.refreshToken,
    refreshExpiresAt: body.refreshExpiresAt,
  };
}

async function refreshAccess(): Promise<AdminSession | null> {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    try {
      const current = getActiveSession();
      if (!current?.refreshToken) return null;

      // 인터셉터 우회: 별도 axios 호출. envelope 은 수동 unwrap.
      const response = await axios.post<ApiEnvelope<RefreshResponseBody>>(
        `${ENV.apiBaseUrl}/admin/refresh`,
        { refreshToken: current.refreshToken },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${current.accessToken}` },
        },
      );
      const body = response.data?.data;
      if (!body?.accessToken) return null;

      const next = buildRefreshedSession(current, body);
      notifySessionUpdate(next);
      return next;
    } catch {
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

function createAdminAxios(): AxiosInstance {
  const instance = axios.create({
    baseURL: ENV.apiBaseUrl,
    timeout: 10_000,
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    const token = getActiveAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  // 백엔드는 모든 응답을 { data, message? } envelope 으로 감싼다 (utils/response.ts).
  // 호출 측에서는 항상 raw payload 를 다루도록 자동 unwrap 한다.
  instance.interceptors.response.use(
    (response) => {
      const body = response.data as ApiEnvelope<unknown> | unknown;
      if (body && typeof body === 'object' && 'data' in body) {
        response.data = (body as ApiEnvelope<unknown>).data;
      }
      return response;
    },
    async (error: AxiosError<ApiErrorPayload>) => {
      const original = error.config as RetryableConfig | undefined;
      const status = error.response?.status ?? 0;
      const isRefreshCall = original?.url?.endsWith('/admin/refresh');

      // 401 + 원본이 refresh 가 아니고 + 아직 재시도 안한 경우 → refresh 후 재시도
      if (status === 401 && original && !original._retried && !isRefreshCall) {
        original._retried = true;
        const next = await refreshAccess();
        if (next) {
          const headers = AxiosHeaders.from(original.headers);
          headers.set('Authorization', `Bearer ${next.accessToken}`);
          original.headers = headers;
          return instance.request(original) as Promise<AxiosResponse>;
        }
        // refresh 실패 → 강제 로그아웃 시그널
        notifySessionUpdate(null);
      }

      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      const code = error.response?.data?.code;
      throw new AdminApiError(status, message, code);
    },
  );

  return instance;
}

export const adminAxios = createAdminAxios();
