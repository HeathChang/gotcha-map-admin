import type { AdminUser, AdminUserStatus } from '@/types/user.types';

export interface UserStatusFormProps {
  user: AdminUser;
  onSubmit: (status: AdminUserStatus) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
