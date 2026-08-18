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

  // H2: 경로→허용역할 인가(ADMIN_NAV_ITEMS 매트릭스). 가장 구체적인(긴) href prefix 로 매칭.
  //     BE 가 모든 /admin/* 에서 role·매장소유권을 강제하지만(1차 방어), member/staff 가 URL·딥링크로
  //     admin 전용 화면(/admins·/audit-logs 등)을 렌더·폼 노출하지 못하도록 클라에서도 차단(심층방어).
  const role = session?.user.role;
  const matchedNav = ADMIN_NAV_ITEMS.filter(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  ).sort((a, b) => b.href.length - a.href.length)[0];
  const isRouteAllowed =
    !matchedNav || (role != null && matchedNav.allowedRoles.includes(role));
  const landingHref = role
    ? ADMIN_NAV_ITEMS.find((item) => item.allowedRoles.includes(role))?.href ?? '/'
    : '/';

  useEffect(() => {
    if (!isReady) return;
    if (!session) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!isRouteAllowed) {
      router.replace(landingHref);
    }
  }, [isReady, session, isRouteAllowed, landingHref, pathname, router]);

  // 세션 확인 중이거나, 허용되지 않은 경로면 리다이렉트 완료 전까지 콘텐츠를 렌더하지 않는다.
  if (!isReady || !session || !isRouteAllowed) {
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
