'use client';

import { Button, Heading, Input, Modal, Spinner, Stack, Text } from 'null_ong2-design-system';
import { ProductTable } from '@/ui/products/ProductTable/ProductTable.ui';
import { ProductForm } from '@/ui/products/ProductForm/ProductForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useProductList } from './useProductList';

export function ProductListContainer() {
  const {
    products,
    isLoading,
    errorMessage,
    searchInput,
    setSearchInput,
    page,
    pageSize,
    total,
    setPage,
    tagOptions,
    modalMode,
    openCreate,
    openEdit,
    closeModal,
    editingDetail,
    editingDetailLoading,
    selectedProductId,
    submitForm,
    isSubmitting,
    requestDelete,
    isDeleting,
  } = useProductList();

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          제품 관리
        </Heading>
        <Text size="sm" color="muted">
          제품 등록·수정·삭제. 메인 이미지 외 갤러리 이미지는 URL 다중 입력, 태그는 다중 선택입니다.
          이미지 업로드 인프라(S3/CDN)는 별도 결정 후 추가됩니다.
        </Text>
      </Stack>

      <div className="flex items-center justify-between gap-3">
        <div className="max-w-md flex-1">
          <Input
            placeholder="제품명으로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={openCreate}>
          + 신규 제품
        </Button>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="제품 목록을 불러오지 못했습니다"
      >
        <ProductTable
          products={products}
          onEdit={openEdit}
          onDelete={requestDelete}
          selectedProductId={selectedProductId}
        />

        <Pagination
          page={page}
          pageSize={pageSize}
          total={total}
          onPageChange={setPage}
          note={isDeleting ? '삭제 중…' : undefined}
        />
      </ListStateView>

      <Modal
        isOpen={modalMode !== 'closed'}
        onClose={closeModal}
        title={modalMode === 'edit' ? '제품 수정' : '신규 제품 등록'}
        size="lg"
      >
        {modalMode === 'edit' && editingDetailLoading ? (
          <div className="flex h-40 items-center justify-center">
            <Spinner size="md" label="상세 불러오는 중" />
          </div>
        ) : modalMode !== 'closed' ? (
          <ProductForm
            initial={modalMode === 'edit' ? (editingDetail ?? null) : null}
            tagOptions={tagOptions}
            onSubmit={submitForm}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
