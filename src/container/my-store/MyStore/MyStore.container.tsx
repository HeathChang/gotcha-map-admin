'use client';

import { Heading, Spinner, Stack, Text } from 'null_ong2-design-system';
import { StoreInfoEditorContainer } from '@/container/store-products/StoreInfoEditor/StoreInfoEditor.container';
import { StoreProductsManagerContainer } from '@/container/store-products/StoreProductsManager/StoreProductsManager.container';
import { useMyStore } from './useMyStore';

export function MyStoreContainer() {
  const { isReady, storeId } = useMyStore();

  if (!isReady) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Spinner size="md" label="세션 확인 중" />
      </div>
    );
  }

  if (!storeId) {
    return (
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          내 매장
        </Heading>
        <Text size="sm" color="muted">
          배정된 매장이 없습니다. 관리자에게 문의하세요.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack spacing="xl">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          내 매장
        </Heading>
        <Text size="sm" color="muted">
          담당 매장의 정보와 가격·재고, 카탈로그 오버라이드를 관리합니다.
        </Text>
      </Stack>

      <StoreInfoEditorContainer storeId={storeId} />
      <StoreProductsManagerContainer storeId={storeId} />
    </Stack>
  );
}
