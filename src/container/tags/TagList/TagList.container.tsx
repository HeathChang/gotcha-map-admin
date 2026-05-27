'use client';

import { Button, Heading, Input, Modal, Stack, Text } from 'null_ong2-design-system';
import { TagTable } from '@/ui/tags/TagTable/TagTable.ui';
import { TagForm } from '@/ui/tags/TagForm/TagForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useTagList } from './useTagList';

export function TagListContainer() {
  const {
    tags,
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
  } = useTagList();

  const selectedTagId = modal.mode === 'edit' ? modal.entity.tagId : null;

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          태그 관리
        </Heading>
        <Text size="sm" color="muted">
          제품 분류용 태그를 등록·수정·삭제합니다. 분류(relationType)로 제품을 묶을 수 있습니다.
        </Text>
      </Stack>

      <div className="flex items-center justify-between gap-3">
        <div className="max-w-md flex-1">
          <Input
            placeholder="태그명으로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <Button variant="primary" onClick={openCreate}>
          + 신규 태그
        </Button>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="태그 목록을 불러오지 못했습니다"
      >
        <TagTable
          tags={tags}
          onEdit={openEdit}
          onDelete={requestDelete}
          selectedTagId={selectedTagId}
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
        title={modal.mode === 'edit' ? '태그 수정' : '신규 태그 등록'}
        size="md"
      >
        {modal.mode !== 'closed' ? (
          <TagForm
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
