import type { AdminUser } from '@/types/admin.types';

export interface AdminHeaderProps {
  user: AdminUser;
  onLogout: () => void;
}
