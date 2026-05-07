import { adminAxios, AdminApiError } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type { AdminLoginPayload, AdminSession } from '@/types/admin.types';
import { MOCK_ADMIN_USER } from '@/api/admin/_mock/mockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

export async function loginAdmin(
  payload: AdminLoginPayload,
): Promise<AdminSession> {
  if (ENV.useMockApi) {
    if (payload.password.length < 4) {
      throw new AdminApiError(401, '이메일 또는 비밀번호가 올바르지 않습니다.');
    }
    const session: AdminSession = {
      user: { ...MOCK_ADMIN_USER, email: payload.email },
      accessToken: 'mock-access-token',
      accessExpiresInSec: 15 * 60,
      refreshToken: 'mock-refresh-token',
      refreshExpiresAt: new Date(
        Date.now() + 14 * 24 * 60 * 60 * 1000,
      ).toISOString(),
    };
    return delay(session);
  }

  const { data } = await adminAxios.post<AdminSession>('/admin/login', payload);
  return data;
}

export async function logoutAdmin(): Promise<void> {
  if (ENV.useMockApi) {
    await delay(undefined);
    return;
  }
  await adminAxios.post('/admin/logout');
}
