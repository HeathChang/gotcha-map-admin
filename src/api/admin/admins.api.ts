import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminManagedUser,
  AdminManagedUserListResponse,
  CreateAdminManagedUserPayload,
  ListAdminManagedUserParams,
  ResetAdminManagedUserPasswordPayload,
  UpdateAdminManagedUserStatusPayload,
} from '@/types/adminManagement.types';
import { delay } from '@/api/admin/_mock/mockHelpers';
import { MOCK_STORES } from '@/api/admin/_mock/storeMockData';

// mock 상태는 모듈 단위로 들고 다닌다 (실서버 미연결 시 CRUD UX 검증용).
const MOCK_STATE: AdminManagedUser[] = [
  {
    adminId: 'admin-001',
    email: 'owner@gotchamap.kr',
    name: '최고 관리자',
    role: 'admin',
    storeId: null,
    storeName: null,
    status: 1,
    createdAt: '2026-01-02T00:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
  {
    adminId: 'admin-002',
    email: 'staff@gotchamap.kr',
    name: '운영팀 김OO',
    role: 'staff',
    storeId: null,
    storeName: null,
    status: 1,
    createdAt: '2026-02-10T00:00:00.000Z',
    updatedAt: '2026-02-10T00:00:00.000Z',
  },
  {
    adminId: 'admin-003',
    email: 'gangnam@gotchamap.kr',
    name: '강남점 점주',
    role: 'member',
    storeId: 'store-001',
    storeName: '강남역 캡슐카페',
    status: 1,
    createdAt: '2026-03-01T00:00:00.000Z',
    updatedAt: '2026-03-01T00:00:00.000Z',
  },
];

function paginate(
  list: AdminManagedUser[],
  page: number,
  limit: number,
): AdminManagedUserListResponse {
  const start = (page - 1) * limit;
  const total = list.length;
  return {
    items: list.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function listAdmins(
  params: ListAdminManagedUserParams = {},
): Promise<AdminManagedUserListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter(
        (it) =>
          it.email.toLowerCase().includes(needle) ||
          it.name.toLowerCase().includes(needle),
      );
    }
    if (params.role) {
      filtered = filtered.filter((it) => it.role === params.role);
    }
    return delay(paginate(filtered, page, limit));
  }

  const { data } = await adminAxios.get<AdminManagedUserListResponse>(
    '/admin/admins',
    { params: { ...params, page, limit } },
  );
  return data;
}

export async function createAdmin(
  payload: CreateAdminManagedUserPayload,
): Promise<AdminManagedUser> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    // member 면 실 BE 처럼 배정 매장명을 함께 채운다 (mock/real 응답 일치).
    const storeId = payload.role === 'member' ? (payload.storeId ?? null) : null;
    const storeName = storeId
      ? (MOCK_STORES.find((s) => s.storeId === storeId)?.name ?? null)
      : null;
    const created: AdminManagedUser = {
      adminId: `admin-${Math.random().toString(36).slice(2, 8)}`,
      email: payload.email,
      name: payload.name,
      role: payload.role,
      storeId,
      storeName,
      status: 1,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_STATE.unshift(created);
    return delay(created);
  }

  const { data } = await adminAxios.post<AdminManagedUser>(
    '/admin/admins',
    payload,
  );
  return data;
}

export async function updateAdminStatus(
  adminId: string,
  payload: UpdateAdminManagedUserStatusPayload,
): Promise<AdminManagedUser> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.adminId === adminId);
    const existing = MOCK_STATE[idx];
    if (idx < 0 || !existing) throw new Error(`Admin not found: ${adminId}`);
    const updated: AdminManagedUser = {
      ...existing,
      status: payload.status,
      updatedAt: new Date().toISOString(),
    };
    MOCK_STATE[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminManagedUser>(
    `/admin/admins/${adminId}/status`,
    payload,
  );
  return data;
}

export async function resetAdminPassword(
  adminId: string,
  payload: ResetAdminManagedUserPasswordPayload,
): Promise<void> {
  if (ENV.useMockApi) {
    const found = MOCK_STATE.find((it) => it.adminId === adminId);
    if (!found) throw new Error(`Admin not found: ${adminId}`);
    await delay(undefined);
    return;
  }

  await adminAxios.post(`/admin/admins/${adminId}/password`, payload);
}
