'use client';

import { Alert, Button, Heading, Input, Modal, Spinner, Stack, Text } from 'null_ong2-design-system';
import { StoreTable } from '@/ui/stores/StoreTable/StoreTable.ui';
import { StoreForm } from '@/ui/stores/StoreForm/StoreForm.ui';
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
    totalPages,
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

  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);
  const selectedStoreId = modal.mode === 'edit' ? modal.store.storeId : null;

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

      {errorMessage ? (
        <Alert variant="danger" title="매장 목록을 불러오지 못했습니다">
          {errorMessage}
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="md" label="목록 불러오는 중" />
        </div>
      ) : (
        <>
          <StoreTable
            stores={stores}
            onEdit={openEdit}
            onDelete={requestDelete}
            selectedStoreId={selectedStoreId}
          />

          <div className="flex items-center justify-between">
            <Text size="sm" color="muted">
              {total === 0 ? '결과 없음' : `${rangeStart}–${rangeEnd} / 총 ${total}건`}
              {isDeleting ? ' · 삭제 중…' : ''}
            </Text>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(Math.max(1, page - 1))}
              >
                이전
              </Button>
              <Text size="sm" color="muted">
                {page} / {totalPages}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(Math.min(totalPages, page + 1))}
              >
                다음
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        isOpen={modal.mode !== 'closed'}
        onClose={closeModal}
        title={modal.mode === 'edit' ? '매장 수정' : '신규 매장 등록'}
        size="lg"
      >
        {modal.mode !== 'closed' ? (
          <StoreForm
            initial={modal.mode === 'edit' ? modal.store : null}
            onSubmit={submitForm}
            onCancel={closeModal}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
