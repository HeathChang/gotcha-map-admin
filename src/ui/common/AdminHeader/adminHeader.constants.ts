import type { AdminRole } from '@/types/admin.types';

export const ROLE_LABEL_MAP: Record<AdminRole, string> = {
  super_admin: '슈퍼 관리자',
  content_manager: '콘텐츠 매니저',
  support_staff: 'CS',
};
