'use client';

import { useSession } from '@/lib/auth/SessionProvider';

interface UseMyStoreResult {
  // 세션 복원 전이면 false — 깜빡임 방지를 위해 로딩 처리.
  isReady: boolean;
  // 점주(member) 의 담당 매장. admin/staff 또는 미배정이면 null.
  storeId: string | null;
}

/**
 * /my-store 진입점. 세션의 storeId 만 노출한다.
 * 실제 매장 정보·가격/재고 조회는 하위 컨테이너(StoreInfoEditor / StoreProductsManager)
 * 가 storeId 를 받아 처리한다.
 */
export function useMyStore(): UseMyStoreResult {
  const { session, isReady } = useSession();

  return {
    isReady,
    storeId: session?.user.storeId ?? null,
  };
}
