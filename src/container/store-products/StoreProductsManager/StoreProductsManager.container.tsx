'use client';

import { Button, Heading, Modal, Stack, Text } from 'null_ong2-design-system';
import { StoreProductTable } from '@/ui/store-products/StoreProductTable/StoreProductTable.ui';
import { StoreProductForm } from '@/ui/store-products/StoreProductForm/StoreProductForm.ui';
import { StoreOverrideTable } from '@/ui/store-products/StoreOverrideTable/StoreOverrideTable.ui';
import { StoreOverrideForm } from '@/ui/store-products/StoreOverrideForm/StoreOverrideForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { useStoreProductsManager } from './useStoreProductsManager';

interface StoreProductsManagerContainerProps {
  storeId: string;
}

export function StoreProductsManagerContainer({
  storeId,
}: StoreProductsManagerContainerProps) {
  const {
    products,
    productsLoading,
    productsError,
    productOptions,
    productModal,
    openCreateProduct,
    openEditProduct,
    closeProductModal,
    submitProduct,
    isSubmittingProduct,
    requestDeleteProduct,
    isDeletingProduct,

    overrides,
    overridesLoading,
    overridesError,
    overrideModal,
    openCreateOverride,
    openEditOverride,
    closeOverrideModal,
    submitOverride,
    isSubmittingOverride,
    requestDeleteOverride,
    isDeletingOverride,
  } = useStoreProductsManager(storeId);

  const selectedProductId =
    productModal.mode === 'edit' ? productModal.entity.id : null;
  const selectedOverrideId =
    overrideModal.mode === 'edit' ? overrideModal.entity.overrideId : null;

  return (
    <Stack spacing="xl">
      {/* 가격/재고 */}
      <Stack spacing="md">
        <div className="flex items-center justify-between gap-3">
          <Stack spacing="2">
            <Heading as="h2" size="lg">
              가격·재고
            </Heading>
            <Text size="sm" color="muted">
              이 매장에서 판매하는 제품의 가격과 재고를 관리합니다.
              {isDeletingProduct ? ' · 삭제 중…' : ''}
            </Text>
          </Stack>
          <Button variant="primary" onClick={openCreateProduct}>
            + 제품 추가
          </Button>
        </div>

        <ListStateView
          isLoading={productsLoading}
          errorMessage={productsError}
          errorTitle="가격·재고를 불러오지 못했습니다"
        >
          <StoreProductTable
            products={products}
            onEdit={openEditProduct}
            onDelete={requestDeleteProduct}
            selectedId={selectedProductId}
          />
        </ListStateView>
      </Stack>

      {/* 카탈로그 오버라이드 */}
      <Stack spacing="md">
        <div className="flex items-center justify-between gap-3">
          <Stack spacing="2">
            <Heading as="h2" size="lg">
              카탈로그 오버라이드
            </Heading>
            <Text size="sm" color="muted">
              글로벌 제품 정보를 이 매장에서만 덮어쓰거나, 매장 전용 신규 제품을 등록합니다.
              {isDeletingOverride ? ' · 삭제 중…' : ''}
            </Text>
          </Stack>
          <Button variant="primary" onClick={openCreateOverride}>
            + 오버라이드 추가
          </Button>
        </div>

        <ListStateView
          isLoading={overridesLoading}
          errorMessage={overridesError}
          errorTitle="카탈로그 오버라이드를 불러오지 못했습니다"
        >
          <StoreOverrideTable
            overrides={overrides}
            onEdit={openEditOverride}
            onDelete={requestDeleteOverride}
            selectedId={selectedOverrideId}
          />
        </ListStateView>
      </Stack>

      <Modal
        isOpen={productModal.mode !== 'closed'}
        onClose={closeProductModal}
        title={productModal.mode === 'edit' ? '가격·재고 수정' : '가격·재고 등록'}
        size="md"
      >
        {productModal.mode !== 'closed' ? (
          <StoreProductForm
            initial={productModal.mode === 'edit' ? productModal.entity : null}
            productOptions={productOptions}
            onSubmit={submitProduct}
            onCancel={closeProductModal}
            isSubmitting={isSubmittingProduct}
          />
        ) : null}
      </Modal>

      <Modal
        isOpen={overrideModal.mode !== 'closed'}
        onClose={closeOverrideModal}
        title={overrideModal.mode === 'edit' ? '오버라이드 수정' : '오버라이드 등록'}
        size="lg"
      >
        {overrideModal.mode !== 'closed' ? (
          <StoreOverrideForm
            initial={overrideModal.mode === 'edit' ? overrideModal.entity : null}
            onSubmit={submitOverride}
            onCancel={closeOverrideModal}
            isSubmitting={isSubmittingOverride}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
