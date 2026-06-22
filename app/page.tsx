'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Spinner } from 'null_ong2-design-system';
import { useSession } from '@/lib/auth/SessionProvider';
import type { AdminRole } from '@/types/admin.types';

/**
 * 역할별 첫 화면 (gotcha-map-policy §4.1).
 * - admin: 권한·감사 책임자 → 감사 로그
 * - staff: 중앙 운영(콘텐츠·문의·회원) → 제품
 * - member: 매장 점주 → 내 매장
 */
const ROLE_LANDING: Record<AdminRole, string> = {
  admin: '/audit-logs',
  staff: '/products',
  member: '/my-store',
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
