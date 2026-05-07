'use client';

import {
  Alert,
  Heading,
  Modal,
  Select,
  Spinner,
  Stack,
  Text,
} from 'null_ong2-design-system';
import { InquiryTable } from '@/ui/inquiries/InquiryTable/InquiryTable.ui';
import { InquiryAnswerForm } from '@/ui/inquiries/InquiryAnswerForm/InquiryAnswerForm.ui';
import { INQUIRY_STATUS_OPTIONS } from '@/ui/inquiries/InquiryStatusBadge/inquiryStatusBadge.constants';
import type { InquiryStatus } from '@/types/admin.types';
import { useInquiryList } from './useInquiryList';

const FILTER_OPTIONS: ReadonlyArray<{ value: InquiryStatus | 'all'; label: string }> = [
  { value: 'all', label: '전체' },
  ...INQUIRY_STATUS_OPTIONS,
];

export function InquiryListContainer() {
  const {
    inquiries,
    isLoading,
    errorMessage,
    statusFilter,
    setStatusFilter,
    selected,
    selectInquiry,
    closeSelected,
    saveAnswer,
    isSaving,
  } = useInquiryList();

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          문의 관리
        </Heading>
        <Text size="sm" color="muted">
          유저 문의를 확인하고 답변하세요.
        </Text>
      </Stack>

      <div className="max-w-xs">
        <Select
          label="상태 필터"
          options={[...FILTER_OPTIONS]}
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as InquiryStatus | 'all')
          }
        />
      </div>

      {errorMessage ? (
        <Alert variant="danger" title="문의 목록을 불러오지 못했습니다">
          {errorMessage}
        </Alert>
      ) : null}

      {isLoading ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="md" label="목록 불러오는 중" />
        </div>
      ) : (
        <InquiryTable
          inquiries={inquiries}
          onSelect={selectInquiry}
          selectedInquiryId={selected?.inquiryId ?? null}
        />
      )}

      <Modal
        isOpen={selected !== null}
        onClose={closeSelected}
        title="문의 답변"
        size="lg"
      >
        {selected ? (
          <InquiryAnswerForm
            inquiry={selected}
            onSubmit={saveAnswer}
            isSubmitting={isSaving}
          />
        ) : null}
      </Modal>
    </Stack>
  );
}
