'use client';

import { useEffect, type ReactNode } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Spinner } from 'null_ong2-design-system';
import { AdminHeader } from '@/ui/common/AdminHeader/AdminHeader.ui';
import { AdminNav } from '@/ui/common/AdminNav/AdminNav.ui';
import { ADMIN_NAV_ITEMS } from '@/ui/common/AdminNav/adminNav.constants';
import { useSession } from '@/lib/auth/SessionProvider';
import { logoutAdmin } from '@/api/admin/auth.api';

interface AdminShellContainerProps {
  children: ReactNode;
}

export function AdminShellContainer({ children }: AdminShellContainerProps) {
  const router = useRouter();
  const pathname = usePathname() ?? '/';
  const { session, isReady, clearSession } = useSession();

  useEffect(() => {
    if (isReady && !session) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
    }
  }, [isReady, session, pathname, router]);

  if (!isReady || !session) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Spinner size="lg" label="세션 확인 중" />
      </div>
    );
  }

  const handleLogout = async () => {
    await logoutAdmin().catch(() => undefined);
    clearSession();
    router.replace('/login');
  };

  return (
    <div className="flex h-screen flex-col">
      <AdminHeader user={session.user} onLogout={handleLogout} />
      <div className="flex flex-1 overflow-hidden">
        <aside className="w-56 shrink-0 border-r border-admin-border bg-admin-surface p-3">
          <AdminNav
            items={ADMIN_NAV_ITEMS}
            currentPath={pathname}
            role={session.user.role}
          />
        </aside>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
