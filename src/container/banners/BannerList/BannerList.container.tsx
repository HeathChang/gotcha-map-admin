'use client';

import { Button, Heading, Input, Modal, Select, Stack, Text } from 'null_ong2-design-system';
import { BannerTable } from '@/ui/banners/BannerTable/BannerTable.ui';
import { BannerForm } from '@/ui/banners/BannerForm/BannerForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useBannerList, type ActiveFilter } from './useBannerList';

const ACTIVE_FILTER_OPTIONS: ReadonlyArray<{ value: ActiveFilter; label: string }> = [
  { value: 'all', label: '전체' },
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
];

export function BannerListContainer() {
  const {
    banners,
    isLoading,
    errorMessage,
    searchInput,
    setSearchInput,
    activeFilter,
    setActiveFilter,
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
    toggleActive,
    togglingId,
  } = useBannerList();

  const selectedBannerId = modal.mode === 'edit' ? modal.entity.bannerId : null;

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          배너 관리
        </Heading>
        <Text size="sm" color="muted">
          홈 화면 배너 이미지를 업로드·수정·삭제하고, 활성 스위치로 앱 노출을 즉시 켜고 끌 수 있습니다.
        </Text>
      </Stack>

      <div className="flex items-end justify-between gap-3">
        <div className="flex flex-1 items-end gap-3">
          <div className="max-w-md flex-1">
            <Input
              placeholder="제목으로 검색"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <div className="w-36">
            <Select
              options={ACTIVE_FILTER_OPTIONS as Array<{ value: string; label: string }>}
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value as ActiveFilter)}
            />
          </div>
        </div>
        <Button variant="primary" onClick={openCreate}>
          + 신규 배너
        </Button>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="배너 목록을 불러오지 못했습니다"
      >
        <BannerTable
          banners={banners}
          onEdit={openEdit}
          onDelete={requestDelete}
          onToggleActive={toggleActive}
          selectedBannerId={selectedBannerId}
          togglingId={togglingId}
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
        title={modal.mode === 'edit' ? '배너 수정' : '신규 배너 등록'}
        size="lg"
      >
        {modal.mode !== 'closed' ? (
          <BannerForm
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
