import type { AdminRole } from '@/types/admin.types';

export interface AdminNavItem {
  href: string;
  label: string;
  allowedRoles: ReadonlyArray<AdminRole>;
}

export interface AdminNavProps {
  items: ReadonlyArray<AdminNavItem>;
  currentPath: string;
  role: AdminRole;
}
