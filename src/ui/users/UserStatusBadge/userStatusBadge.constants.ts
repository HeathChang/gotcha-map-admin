import type { AdminUserStatus } from '@/types/user.types';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export const USER_STATUS_LABEL_MAP: Record<AdminUserStatus, string> = {
  1: '활성',
  0: '비활성',
  [-1]: '탈퇴',
};

export const USER_STATUS_VARIANT_MAP: Record<AdminUserStatus, BadgeVariant> = {
  1: 'success',
  0: 'warning',
  [-1]: 'danger',
};

export const USER_STATUS_OPTIONS: ReadonlyArray<{
  value: AdminUserStatus;
  label: string;
}> = [
  { value: 1, label: '활성' },
  { value: 0, label: '비활성' },
  { value: -1, label: '탈퇴' },
];
