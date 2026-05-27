'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createAdminStore,
  deleteAdminStore,
  listAdminStores,
  updateAdminStore,
} from '@/api/admin/stores.api';
import type {
  AdminStore,
  CreateAdminStorePayload,
  UpdateAdminStorePayload,
} from '@/types/store.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';
import { useCrudModal, type CrudModalState } from '@/lib/hooks/useCrudModal';
import type { StoreFormValues } from '@/ui/stores/StoreForm/StoreForm.types';

const QUERY_KEY = ['admin', 'stores'] as const;
const PAGE_SIZE = 20;

interface UseStoreListResult {
  stores: ReadonlyArray<AdminStore>;
  isLoading: boolean;
  errorMessage: string | null;

  searchInput: string;
  setSearchInput: (next: string) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  modal: CrudModalState<AdminStore>;
  openCreate: () => void;
  openEdit: (store: AdminStore) => void;
  closeModal: () => void;

  submitForm: (values: StoreFormValues) => void;
  isSubmitting: boolean;

  requestDelete: (store: AdminStore) => void;
  isDeleting: boolean;
}

// react-hook-form 의 빈 문자열을 BE 가 기대하는 null 로 변환한다.
function stripEmpty(values: StoreFormValues): CreateAdminStorePayload {
  return {
    name: values.name,
    address: values.address,
    lat: values.lat,
    lon: values.lon,
    phone: values.phone === '' ? null : values.phone,
    description: values.description === '' ? null : values.description,
    imageUrl: values.imageUrl === '' ? null : values.imageUrl,
    openingHours: values.openingHours === '' ? null : values.openingHours,
    rating: values.rating,
  };
}

export function useStoreList(): UseStoreListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch();
  const { modal, openCreate, openEdit, close } = useCrudModal<AdminStore>();

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, page }] as const,
    queryFn: () =>
      listAdminStores({ q: debouncedQ || undefined, page, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminStorePayload) => createAdminStore(payload),
    onSuccess: () => {
      toast.success('매장이 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '매장 등록에 실패했습니다.';
      toast.danger(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ storeId, payload }: { storeId: string; payload: UpdateAdminStorePayload }) =>
      updateAdminStore(storeId, payload),
    onSuccess: () => {
      toast.success('매장이 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '매장 수정에 실패했습니다.';
      toast.danger(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (storeId: string) => deleteAdminStore(storeId),
    onSuccess: () => {
      toast.success('매장이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '매장 삭제에 실패했습니다.';
      toast.danger(message);
    },
  });

  const submitForm = (values: StoreFormValues) => {
    const payload = stripEmpty(values);
    if (modal.mode === 'edit') {
      updateMutation.mutate({ storeId: modal.entity.storeId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const requestDelete = (store: AdminStore) => {
    // 삭제는 되돌리기 어려우니 confirm 1단계. 브라우저 confirm 으로 충분 (vision §5 데스크톱 전용).
    const ok = typeof window !== 'undefined' && window.confirm(
      `매장 "${store.name}"을(를) 삭제할까요? 되돌릴 수 없습니다.`,
    );
    if (!ok) return;
    deleteMutation.mutate(store.storeId);
  };

  return {
    stores: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage:
      query.error instanceof AdminApiError ? query.error.message : null,

    searchInput,
    setSearchInput,

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
  };
}
