'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createAdminAnnouncement,
  deleteAdminAnnouncement,
  listAdminAnnouncements,
  updateAdminAnnouncement,
} from '@/api/admin/announcements.api';
import type {
  AdminAnnouncement,
  CreateAdminAnnouncementPayload,
  UpdateAdminAnnouncementPayload,
} from '@/types/announcement.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';
import { useCrudModal, type CrudModalState } from '@/lib/hooks/useCrudModal';
import type { AnnouncementFormValues } from '@/ui/announcements/AnnouncementForm/AnnouncementForm.types';

const QUERY_KEY = ['admin', 'announcements'] as const;
const PAGE_SIZE = 20;

export type ActiveFilter = 'all' | 'active' | 'inactive';

const ACTIVE_FILTER_TO_BOOL: Record<ActiveFilter, boolean | undefined> = {
  all: undefined,
  active: true,
  inactive: false,
};

interface UseAnnouncementListResult {
  announcements: ReadonlyArray<AdminAnnouncement>;
  isLoading: boolean;
  errorMessage: string | null;

  searchInput: string;
  setSearchInput: (next: string) => void;

  activeFilter: ActiveFilter;
  setActiveFilter: (next: ActiveFilter) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  modal: CrudModalState<AdminAnnouncement>;
  openCreate: () => void;
  openEdit: (announcement: AdminAnnouncement) => void;
  closeModal: () => void;

  submitForm: (values: AnnouncementFormValues) => void;
  isSubmitting: boolean;

  requestDelete: (announcement: AdminAnnouncement) => void;
  isDeleting: boolean;

  toggleActive: (announcement: AdminAnnouncement) => void;
  togglingId: string | null;
}

export function useAnnouncementList(): UseAnnouncementListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch({ resetPageDeps: [activeFilter] });
  const { modal, openCreate, openEdit, close } = useCrudModal<AdminAnnouncement>();

  const isActive = ACTIVE_FILTER_TO_BOOL[activeFilter];

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, isActive, page }] as const,
    queryFn: () =>
      listAdminAnnouncements({
        q: debouncedQ || undefined,
        isActive,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminAnnouncementPayload) =>
      createAdminAnnouncement(payload),
    onSuccess: () => {
      toast.success('공지가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '공지 등록에 실패했습니다.';
      toast.danger(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      announceId,
      payload,
    }: {
      announceId: string;
      payload: UpdateAdminAnnouncementPayload;
    }) => updateAdminAnnouncement(announceId, payload),
    onSuccess: () => {
      toast.success('공지가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '공지 수정에 실패했습니다.';
      toast.danger(message);
    },
  });

  // 인라인 활성 토글은 모달을 닫지 않고 목록만 갱신한다 (별도 mutation).
  const toggleMutation = useMutation({
    mutationFn: ({ announceId, isActive }: { announceId: string; isActive: boolean }) =>
      updateAdminAnnouncement(announceId, { isActive }),
    onMutate: ({ announceId }) => setTogglingId(announceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '활성 상태 변경에 실패했습니다.';
      toast.danger(message);
    },
    onSettled: () => setTogglingId(null),
  });

  const deleteMutation = useMutation({
    mutationFn: (announceId: string) => deleteAdminAnnouncement(announceId),
    onSuccess: () => {
      toast.success('공지가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '공지 삭제에 실패했습니다.';
      toast.danger(message);
    },
  });

  const submitForm = (values: AnnouncementFormValues) => {
    if (modal.mode === 'edit') {
      updateMutation.mutate({ announceId: modal.entity.announceId, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const requestDelete = (announcement: AdminAnnouncement) => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(`공지 "${announcement.title}"을(를) 삭제할까요? 되돌릴 수 없습니다.`);
    if (!ok) return;
    deleteMutation.mutate(announcement.announceId);
  };

  const toggleActive = (announcement: AdminAnnouncement) => {
    toggleMutation.mutate({
      announceId: announcement.announceId,
      isActive: !announcement.isActive,
    });
  };

  return {
    announcements: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

    searchInput,
    setSearchInput,

    activeFilter,
    setActiveFilter,

    page,
    pageSize: PAGE_SIZE,
    total: query.data?.pagination.total ?? 0,
    setPage,

    modal,
    openCreate,
    openEdit,
    closeModal: close,

    submitForm,
    isSubmitting: createMutation.isPending || updateMutation.isPending,

    requestDelete,
    isDeleting: deleteMutation.isPending,

    toggleActive,
    togglingId,
  };
}
