import type { AdminRole } from '@/types/admin.types';

export const ROLE_LABEL_MAP: Record<AdminRole, string> = {
  admin: '관리자',
  staff: '운영 스태프',
  member: '매장 매니저',
};
