'use client';

import { useRouter } from 'next/navigation';
import { Button, Heading, Input, Modal, Stack, Text } from 'null_ong2-design-system';
import type { AdminStore } from '@/types/store.types';
import { StoreTable } from '@/ui/stores/StoreTable/StoreTable.ui';
import { StoreForm } from '@/ui/stores/StoreForm/StoreForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useStoreList } from './useStoreList';

export function StoreListContainer() {
  const {
    stores,
    isLoading,
    errorMessage,
    searchInput,
    setSearchInput,
    page,
    pageSize,
    total,
    setPage,
    modal,
    openCreate,
    openEdit,
    closeModal,
    submitForm,
    isSubmitting,
    requestDelete,
    isDeleting,
  } = useStoreList();

  const router = useRouter();
  const selectedStoreId = modal.mode === 'edit' ? modal.entity.storeId : null;

  const handleManageProducts = (store: AdminStore) => {
    router.push(`/stores/${store.storeId}`);
  };

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          매장 관리
        </Heading>
        <Text size="sm" color="muted">
          매장 등록·수정·삭제. 위경도는 네이버맵·구글맵에서 마우스 우클릭으로 복사할 수 있습니다.
        </Text>
      </Stack>

      <div className="flex items-center justify-between gap-3">
        <div className="max-w-md flex-1">
          <Input
            placeholder="매장명 또는 주소로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={openCreate}>
          + 신규 매장
        </Button>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="매장 목록을 불러오지 못했습니다"
      >
        <StoreTable
          stores={stores}
          onEdit={openEdit}
          onDelete={requestDelete}
          onManageProducts={handleManageProducts}
          selectedStoreId={selectedStoreId}
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
        isOpen={modal.mode !== 'closed'}
        onClose={closeModal}
        title={modal.mode === 'edit' ? '매장 수정' : '신규 매장 등록'}
        size="lg"
      >
        {modal.mode !== 'closed' ? (
          <StoreForm
            initial={modal.mode === 'edit' ? modal.entity : null}
            onSubmit={submitForm}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
