'use client';

import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  answerAdminInquiry,
  getAdminInquiryStats,
  listAdminInquiries,
} from '@/api/admin/inquiries.api';
import type {
  AdminInquiry,
  AdminInquiryStats,
  AnswerInquiryPayload,
  InquiryStatus,
} from '@/types/admin.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';

const QUERY_KEY = ['admin', 'inquiries'] as const;
const STATS_KEY = ['admin', 'inquiries', 'stats'] as const;
const PAGE_SIZE = 20;

const ALL_STATUSES: ReadonlyArray<InquiryStatus> = [
  'pending',
  'processing',
  'completed',
  'rejected',
];

interface UseInquiryListResult {
  inquiries: ReadonlyArray<AdminInquiry>;
  isLoading: boolean;
  errorMessage: string | null;

  // 다중 상태 필터: 빈 Set 이면 모두 노출.
  statusFilter: ReadonlySet<InquiryStatus>;
  toggleStatusFilter: (status: InquiryStatus) => void;
  resetStatusFilter: () => void;

  // 검색
  searchInput: string;
  setSearchInput: (next: string) => void;

  // 페이지네이션
  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  // 통계 (대시보드 배너)
  stats: AdminInquiryStats | undefined;

  // 모달 / 답변
  selected: AdminInquiry | null;
  selectInquiry: (inquiry: AdminInquiry) => void;
  closeSelected: () => void;
  saveAnswer: (payload: AnswerInquiryPayload) => void;
  isSaving: boolean;
}

export function useInquiryList(): UseInquiryListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<ReadonlySet<InquiryStatus>>(
    () => new Set(),
  );
  const [selected, setSelected] = useState<AdminInquiry | null>(null);

  // 검색어 / 필터 변경 시 첫 페이지로. (statusFilter 변경도 reset 트리거)
  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch({ resetPageDeps: [statusFilter] });

  // BE 는 단일 status 만 지원하므로,
  // - 0개 또는 2개 이상 선택: 서버는 미필터 + 클라이언트 필터링
  // - 정확히 1개 선택: 서버 필터링 (네트워크/페이징 효율)
  const serverStatus =
    statusFilter.size === 1 ? Array.from(statusFilter)[0] : undefined;

  const query = useQuery({
    queryKey: [
      ...QUERY_KEY,
      { serverStatus, q: debouncedQ, page },
    ] as const,
    queryFn: () =>
      listAdminInquiries({
        status: serverStatus,
        q: debouncedQ || undefined,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const statsQuery = useQuery({
    queryKey: STATS_KEY,
    queryFn: getAdminInquiryStats,
    staleTime: 60_000,
  });

  // 클라이언트 추가 필터링 (다중 상태)
  const visibleInquiries = useMemo<ReadonlyArray<AdminInquiry>>(() => {
    const items = query.data?.items ?? [];
    if (statusFilter.size <= 1) return items;
    return items.filter((it) => statusFilter.has(it.status));
  }, [query.data, statusFilter]);

  const mutation = useMutation({
    mutationFn: (payload: AnswerInquiryPayload) => {
      if (!selected) {
        throw new Error('No inquiry selected');
      }
      return answerAdminInquiry(selected.inquiryId, payload);
    },
    // 저장 성공 시 모달을 닫고 목록·통계를 갱신한다.
    // (이전: 모달 유지로 CS 가 연속 답변마다 X 를 눌러야 함)
    onSuccess: () => {
      toast.success('답변이 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: STATS_KEY });
      setSelected(null);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError
          ? error.message
          : '답변 저장에 실패했습니다.';
      toast.danger(message);
    },
  });

  const toggleStatusFilter = (status: InquiryStatus) => {
    setStatusFilter((prev) => {
      const next = new Set(prev);
      if (next.has(status)) next.delete(status);
      else next.add(status);
      return next;
    });
  };

  const resetStatusFilter = () => setStatusFilter(new Set());

  return {
    inquiries: visibleInquiries,
    isLoading: query.isLoading,
    errorMessage:
      query.error instanceof AdminApiError ? query.error.message : null,

    statusFilter,
    toggleStatusFilter,
    resetStatusFilter,

    searchInput,
    setSearchInput,

    page,
    pageSize: PAGE_SIZE,
    total: query.data?.total ?? 0,
    setPage,

    stats: statsQuery.data,

    selected,
    selectInquiry: setSelected,
    closeSelected: () => setSelected(null),
    saveAnswer: mutation.mutate,
    isSaving: mutation.isPending,
  };
}

export const ADMIN_INQUIRY_ALL_STATUSES = ALL_STATUSES;
