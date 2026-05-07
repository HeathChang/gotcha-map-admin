'use client';

import { useState } from 'react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  answerAdminInquiry,
  listAdminInquiries,
} from '@/api/admin/inquiries.api';
import type {
  AdminInquiry,
  AnswerInquiryPayload,
  InquiryStatus,
} from '@/types/admin.types';
import { AdminApiError } from '@/lib/axios/adminAxios';

const QUERY_KEY = ['admin', 'inquiries'] as const;

interface UseInquiryListResult {
  inquiries: ReadonlyArray<AdminInquiry>;
  isLoading: boolean;
  errorMessage: string | null;
  statusFilter: InquiryStatus | 'all';
  setStatusFilter: (next: InquiryStatus | 'all') => void;
  selected: AdminInquiry | null;
  selectInquiry: (inquiry: AdminInquiry) => void;
  closeSelected: () => void;
  saveAnswer: (payload: AnswerInquiryPayload) => void;
  isSaving: boolean;
}

export function useInquiryList(): UseInquiryListResult {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<InquiryStatus | 'all'>('all');
  const [selected, setSelected] = useState<AdminInquiry | null>(null);

  const query = useQuery({
    queryKey: [...QUERY_KEY, statusFilter] as const,
    queryFn: () =>
      listAdminInquiries({
        status: statusFilter === 'all' ? undefined : statusFilter,
        limit: 50,
      }),
  });

  const mutation = useMutation({
    mutationFn: (payload: AnswerInquiryPayload) => {
      if (!selected) {
        throw new Error('No inquiry selected');
      }
      return answerAdminInquiry(selected.inquiryId, payload);
    },
    onSuccess: (updated) => {
      toast.success('답변이 저장되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setSelected(updated);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError
          ? error.message
          : '답변 저장에 실패했습니다.';
      toast.danger(message);
    },
  });

  return {
    inquiries: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage:
      query.error instanceof AdminApiError ? query.error.message : null,
    statusFilter,
    setStatusFilter,
    selected,
    selectInquiry: setSelected,
    closeSelected: () => setSelected(null),
    saveAnswer: mutation.mutate,
    isSaving: mutation.isPending,
  };
}
