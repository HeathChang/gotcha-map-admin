'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createAdminBanner,
  deleteAdminBanner,
  listAdminBanners,
  updateAdminBanner,
} from '@/api/admin/banners.api';
import type {
  AdminBanner,
  CreateAdminBannerPayload,
  UpdateAdminBannerPayload,
} from '@/types/banner.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';
import { useCrudModal, type CrudModalState } from '@/lib/hooks/useCrudModal';
import type { BannerFormValues } from '@/ui/banners/BannerForm/BannerForm.types';

const QUERY_KEY = ['admin', 'banners'] as const;
const PAGE_SIZE = 20;

export type ActiveFilter = 'all' | 'active' | 'inactive';

const ACTIVE_FILTER_TO_BOOL: Record<ActiveFilter, boolean | undefined> = {
  all: undefined,
  active: true,
  inactive: false,
};

interface UseBannerListResult {
  banners: ReadonlyArray<AdminBanner>;
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

  modal: CrudModalState<AdminBanner>;
  openCreate: () => void;
  openEdit: (banner: AdminBanner) => void;
  closeModal: () => void;

  submitForm: (values: BannerFormValues) => void;
  isSubmitting: boolean;

  requestDelete: (banner: AdminBanner) => void;
  isDeleting: boolean;

  toggleActive: (banner: AdminBanner) => void;
  togglingId: string | null;
}

export function useBannerList(): UseBannerListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [activeFilter, setActiveFilter] = useState<ActiveFilter>('all');
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch({ resetPageDeps: [activeFilter] });
  const { modal, openCreate, openEdit, close } = useCrudModal<AdminBanner>();

  const isActive = ACTIVE_FILTER_TO_BOOL[activeFilter];

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, isActive, page }] as const,
    queryFn: () =>
      listAdminBanners({
        q: debouncedQ || undefined,
        isActive,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminBannerPayload) => createAdminBanner(payload),
    onSuccess: () => {
      toast.success('배너가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '배너 등록에 실패했습니다.';
      toast.danger(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      bannerId,
      payload,
    }: {
      bannerId: string;
      payload: UpdateAdminBannerPayload;
    }) => updateAdminBanner(bannerId, payload),
    onSuccess: () => {
      toast.success('배너가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '배너 수정에 실패했습니다.';
      toast.danger(message);
    },
  });

  // 인라인 활성 토글은 모달을 닫지 않고 목록만 갱신한다 (별도 mutation).
  const toggleMutation = useMutation({
    mutationFn: ({ bannerId, isActive }: { bannerId: string; isActive: boolean }) =>
      updateAdminBanner(bannerId, { isActive }),
    onMutate: ({ bannerId }) => setTogglingId(bannerId),
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
    mutationFn: (bannerId: string) => deleteAdminBanner(bannerId),
    onSuccess: () => {
      toast.success('배너가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '배너 삭제에 실패했습니다.';
      toast.danger(message);
    },
  });

  const submitForm = (values: BannerFormValues) => {
    if (modal.mode === 'edit') {
      updateMutation.mutate({ bannerId: modal.entity.bannerId, payload: values });
    } else {
      createMutation.mutate(values);
    }
  };

  const requestDelete = (banner: AdminBanner) => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(
        `배너 "${banner.title || banner.bannerId}"을(를) 삭제할까요? 되돌릴 수 없습니다.`,
      );
    if (!ok) return;
    deleteMutation.mutate(banner.bannerId);
  };

  const toggleActive = (banner: AdminBanner) => {
    toggleMutation.mutate({
      bannerId: banner.bannerId,
      isActive: !banner.isActive,
    });
  };

  return {
    banners: query.data?.items ?? [],
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
