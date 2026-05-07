import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { ENV } from '@/lib/env';
import { getActiveAccessToken } from '@/lib/auth/sessionToken';

export interface ApiErrorPayload {
  message: string;
  code?: string;
}

interface ApiEnvelope<T> {
  data: T;
  message?: string;
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
    (error: AxiosError<ApiErrorPayload>) => {
      const status = error.response?.status ?? 0;
      const message =
        error.response?.data?.message ?? error.message ?? 'Unknown error';
      const code = error.response?.data?.code;
      throw new AdminApiError(status, message, code);
    },
  );

  return instance;
}

export const adminAxios = createAdminAxios();
