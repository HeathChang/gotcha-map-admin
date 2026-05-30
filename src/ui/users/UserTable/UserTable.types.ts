import type { AdminUser } from '@/types/user.types';

export interface UserTableProps {
  users: ReadonlyArray<AdminUser>;
  onChangeStatus: (user: AdminUser) => void;
  selectedUserId: string | null;
}
