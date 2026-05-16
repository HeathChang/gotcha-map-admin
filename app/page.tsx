'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'null_ong2-design-system';
import { useSession } from '@/lib/auth/SessionProvider';
import type { AdminRole } from '@/types/admin.types';

/**
 * 역할별 첫 화면.
 * vision §2.1 (admin) 의 1순위 업무가 역할별로 다르므로, 로그인 직후 자기 업무 화면으로 직행한다.
 * - super_admin: 권한·감사 책임자 → 감사 로그
 * - content_manager: 콘텐츠 등록·수정 → 제품
 * - support_staff: CS → 문의
 */
const ROLE_LANDING: Record<AdminRole, string> = {
  super_admin: '/audit-logs',
  content_manager: '/products',
  support_staff: '/inquiries',
};

const FALLBACK_LANDING = '/inquiries';

export default function RootPage() {
  const router = useRouter();
  const { session, isReady } = useSession();

  useEffect(() => {
    if (!isReady) return;
    if (!session) {
      router.replace('/login');
      return;
    }
    router.replace(ROLE_LANDING[session.user.role] ?? FALLBACK_LANDING);
  }, [isReady, session, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Spinner size="lg" label="로딩 중" />
    </div>
  );
}
