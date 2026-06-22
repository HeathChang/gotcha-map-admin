import type { AdminManagedUser } from '@/types/adminManagement.types';

export interface AdminUserTableProps {
  admins: ReadonlyArray<AdminManagedUser>;
  onToggleStatus: (admin: AdminManagedUser) => void;
  onResetPassword: (admin: AdminManagedUser) => void;
  // 상태 변경 진행 중인 행 (중복 클릭 방지).
  pendingStatusId: string | null;
}
