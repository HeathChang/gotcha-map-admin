import type { ReactNode } from 'react';
import { AdminShellContainer } from '@/container/common/AdminShell/AdminShell.container';

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return <AdminShellContainer>{children}</AdminShellContainer>;
}
