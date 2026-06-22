'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Button, Heading, Stack, Text } from 'null_ong2-design-system';
import { StoreInfoEditorContainer } from '@/container/store-products/StoreInfoEditor/StoreInfoEditor.container';
import { StoreProductsManagerContainer } from '@/container/store-products/StoreProductsManager/StoreProductsManager.container';

export function StoreDetailContainer() {
  const params = useParams<{ storeId: string }>();
  const storeId = typeof params?.storeId === 'string' ? params.storeId : null;

  if (!storeId) {
    return (
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          매장 상세
        </Heading>
        <Text size="sm" color="muted">
          매장 정보를 찾을 수 없습니다.
        </Text>
      </Stack>
    );
  }

  return (
    <Stack spacing="xl">
      <Stack spacing="2">
        <Link href="/stores">
          <Button variant="ghost" size="sm">
            ← 매장 목록
          </Button>
        </Link>
        <Heading as="h1" size="lg">
          매장 상품·가격 관리
        </Heading>
        <Text size="sm" color="muted">
          매장 정보와 가격·재고, 카탈로그 오버라이드를 관리합니다.
        </Text>
      </Stack>

      <StoreInfoEditorContainer storeId={storeId} />
      <StoreProductsManagerContainer storeId={storeId} />
    </Stack>
  );
}
