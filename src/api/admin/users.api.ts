import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminUser,
  AdminUserListResponse,
  ListAdminUserParams,
  UpdateAdminUserStatusPayload,
} from '@/types/user.types';
import { MOCK_USERS } from '@/api/admin/_mock/userMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

const MOCK_STATE: AdminUser[] = MOCK_USERS.map((it) => ({ ...it }));

function paginate(
  list: AdminUser[],
  page: number,
  limit: number,
): AdminUserListResponse {
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

export async function listAdminUsers(
  params: ListAdminUserParams = {},
): Promise<AdminUserListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter(
        (it) =>
          it.email.toLowerCase().includes(needle) ||
          it.nickname.toLowerCase().includes(needle),
      );
    }
    if (params.status !== undefined) {
      filtered = filtered.filter((it) => it.userStatus === params.status);
    }
    return delay(paginate(filtered, page, limit));
  }

  const { data } = await adminAxios.get<AdminUserListResponse>('/admin/users', {
    params: { ...params, page, limit },
  });
  return data;
}

export async function updateAdminUserStatus(
  userId: string,
  payload: UpdateAdminUserStatusPayload,
): Promise<AdminUser> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.userId === userId);
    const existing = MOCK_STATE[idx];
    if (idx < 0 || !existing) throw new Error(`User not found: ${userId}`);
    const updated: AdminUser = {
      ...existing,
      userStatus: payload.status,
      updatedAt: new Date().toISOString(),
    };
    MOCK_STATE[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminUser>(
    `/admin/users/${userId}/status`,
    payload,
  );
  return data;
}
