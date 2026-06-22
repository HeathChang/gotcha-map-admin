'use client';

import { Button, Heading, Modal, Stack, Text } from 'null_ong2-design-system';
import { StoreForm } from '@/ui/stores/StoreForm/StoreForm.ui';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { useStoreInfoEditor } from './useStoreInfoEditor';

interface StoreInfoEditorContainerProps {
  storeId: string;
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3">
      <div className="w-24 shrink-0">
        <Text size="sm" color="muted">
          {label}
        </Text>
      </div>
      <Text size="sm">{value}</Text>
    </div>
  );
}

export function StoreInfoEditorContainer({ storeId }: StoreInfoEditorContainerProps) {
  const {
    store,
    isLoading,
    errorMessage,
    isEditing,
    openEdit,
    closeEdit,
    submitEdit,
    isSubmitting,
  } = useStoreInfoEditor(storeId);

  return (
    <Stack spacing="md">
      <div className="flex items-center justify-between gap-3">
        <Heading as="h2" size="lg">
          매장 정보
        </Heading>
        {store ? (
          <Button variant="secondary" onClick={openEdit}>
            매장 정보 수정
          </Button>
        ) : null}
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="매장 정보를 불러오지 못했습니다"
      >
        {store ? (
          <div className="rounded-md border border-admin-border bg-admin-surface p-5">
            <Stack spacing="sm">
              <InfoRow label="매장명" value={store.name} />
              <InfoRow label="주소" value={store.address} />
              <InfoRow
                label="위경도"
                value={`${store.lat.toFixed(6)}, ${store.lon.toFixed(6)}`}
              />
              <InfoRow label="전화번호" value={store.phone ?? '—'} />
              <InfoRow label="영업시간" value={store.openingHours ?? '—'} />
              <InfoRow label="평점" value={store.rating.toFixed(1)} />
              <InfoRow label="설명" value={store.description ?? '—'} />
            </Stack>
          </div>
        ) : null}
      </ListStateView>

      <Modal isOpen={isEditing} onClose={closeEdit} title="매장 정보 수정" size="lg">
        {isEditing && store ? (
          <StoreForm
            initial={store}
            onSubmit={submitEdit}
            onCancel={closeEdit}
            isSubmitting={isSubmitting}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
