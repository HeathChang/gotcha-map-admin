'use client';

import { Alert, Button, Heading, Input, Modal, Spinner, Stack, Text } from 'null_ong2-design-system';
import clsx from 'clsx';
import { InquiryTable } from '@/ui/inquiries/InquiryTable/InquiryTable.ui';
import { InquiryAnswerForm } from '@/ui/inquiries/InquiryAnswerForm/InquiryAnswerForm.ui';
import {
  INQUIRY_STATUS_LABEL_MAP,
  INQUIRY_STATUS_OPTIONS,
} from '@/ui/inquiries/InquiryStatusBadge/inquiryStatusBadge.constants';
import type { AdminInquiryStats, InquiryStatus } from '@/types/admin.types';
import { useInquiryList } from './useInquiryList';

function StatsBanner({ stats }: { stats: AdminInquiryStats | undefined }) {
  if (!stats) return null;
  const { countByStatus, avgResponseHours, medianResponseHours, overdueCount } = stats;
  const totalActive = countByStatus.pending + countByStatus.processing;

  // vision §3 (admin): "신규 문의 응답 평균 24시간 이내" — overdueCount > 0 면 SLA 위반.
  const slaTone =
    overdueCount > 0
      ? 'border-red-300 bg-red-50'
      : 'border-admin-border bg-admin-surface';

  const formatHours = (h: number | null) =>
    h === null ? '–' : h < 1 ? `${(h * 60).toFixed(0)}분` : `${h.toFixed(1)}시간`;

  return (
    <div className={clsx('rounded-md border p-4', slaTone)}>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <div>
          <Text size="xs" color="muted">
            미답변 (대기 + 처리중)
          </Text>
          <Text size="xl" weight="bold">
            {totalActive}
          </Text>
        </div>
        <div>
          <Text size="xs" color={overdueCount > 0 ? 'danger' : 'muted'}>
            24h 초과 미답변
          </Text>
          <Text
            size="xl"
            weight="bold"
            color={overdueCount > 0 ? 'danger' : 'default'}
          >
            {overdueCount}
          </Text>
        </div>
        <div>
          <Text size="xs" color="muted">
            평균 응답
          </Text>
          <Text size="xl" weight="bold">
            {formatHours(avgResponseHours)}
          </Text>
        </div>
        <div>
          <Text size="xs" color="muted">
            중앙값 응답
          </Text>
          <Text size="xl" weight="bold">
            {formatHours(medianResponseHours)}
          </Text>
        </div>
      </div>
    </div>
  );
}

export function InquiryListContainer() {
  const {
    inquiries,
    isLoading,
    errorMessage,
    statusFilter,
    toggleStatusFilter,
    resetStatusFilter,
    searchInput,
    setSearchInput,
    page,
    pageSize,
    total,
    setPage,
    stats,
    selected,
    selectInquiry,
    closeSelected,
    saveAnswer,
    isSaving,
  } = useInquiryList();

  const lastPage = Math.max(1, Math.ceil(total / pageSize));
  const rangeStart = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const rangeEnd = Math.min(page * pageSize, total);

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          문의 관리
        </Heading>
        <Text size="sm" color="muted">
          유저 문의를 확인하고 답변하세요. 24시간 SLA 초과 건은 빨간색으로 강조됩니다.
        </Text>
      </Stack>

      <StatsBanner stats={stats} />

      {/* 검색 + 다중 상태 필터 */}
      <Stack spacing="sm">
        <div className="max-w-md">
          <Input
            placeholder="제목 또는 요청자 이메일로 검색"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Text size="sm" color="muted">
            상태:
          </Text>
          {INQUIRY_STATUS_OPTIONS.map((opt) => {
            const active = statusFilter.has(opt.value);
            return (
              <button
                type="button"
                key={opt.value}
                onClick={() => toggleStatusFilter(opt.value as InquiryStatus)}
                className={clsx(
                  'rounded-full border px-3 py-1 text-xs transition-colors',
                  active
                    ? 'border-admin-accent bg-admin-accent/10 text-admin-accent'
                    : 'border-admin-border text-gray-600 hover:bg-gray-50',
                )}
              >
                {INQUIRY_STATUS_LABEL_MAP[opt.value as InquiryStatus]}
              </button>
            );
          })}
          {statusFilter.size > 0 ? (
            <Button variant="ghost" size="sm" onClick={resetStatusFilter}>
              전체 보기
            </Button>
          ) : (
            <Text size="xs" color="muted">
              (선택 없음 = 전체)
            </Text>
          )}
        </div>
      </Stack>

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
        <>
          <InquiryTable
            inquiries={inquiries}
            onSelect={selectInquiry}
            selectedInquiryId={selected?.inquiryId ?? null}
          />

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between">
            <Text size="sm" color="muted">
              {total === 0
                ? '결과 없음'
                : `${rangeStart}–${rangeEnd} / 총 ${total}건`}
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
                {page} / {lastPage}
              </Text>
              <Button
                variant="ghost"
                size="sm"
                disabled={page >= lastPage}
                onClick={() => setPage(Math.min(lastPage, page + 1))}
              >
                다음
              </Button>
            </div>
          </div>
        </>
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
