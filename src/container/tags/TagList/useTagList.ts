'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createAdminTag,
  deleteAdminTag,
  listAdminTags,
  updateAdminTag,
} from '@/api/admin/tags.api';
import type {
  AdminTag,
  CreateAdminTagPayload,
  UpdateAdminTagPayload,
} from '@/types/tag.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';
import { useCrudModal, type CrudModalState } from '@/lib/hooks/useCrudModal';
import type { TagFormValues } from '@/ui/tags/TagForm/TagForm.types';

const QUERY_KEY = ['admin', 'tags'] as const;
const PAGE_SIZE = 20;

interface UseTagListResult {
  tags: ReadonlyArray<AdminTag>;
  isLoading: boolean;
  errorMessage: string | null;

  searchInput: string;
  setSearchInput: (next: string) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  modal: CrudModalState<AdminTag>;
  openCreate: () => void;
  openEdit: (tag: AdminTag) => void;
  closeModal: () => void;

  submitForm: (values: TagFormValues) => void;
  isSubmitting: boolean;

  requestDelete: (tag: AdminTag) => void;
  isDeleting: boolean;
}

// react-hook-form 의 빈 문자열을 BE 가 기대하는 null 로 변환한다.
function stripEmpty(values: TagFormValues): CreateAdminTagPayload {
  return {
    name: values.name,
    relationType: values.relationType === '' ? null : values.relationType,
  };
}

export function useTagList(): UseTagListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch();
  const { modal, openCreate, openEdit, close } = useCrudModal<AdminTag>();

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, page }] as const,
    queryFn: () =>
      listAdminTags({ q: debouncedQ || undefined, page, limit: PAGE_SIZE }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminTagPayload) => createAdminTag(payload),
    onSuccess: () => {
      toast.success('태그가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '태그 등록에 실패했습니다.';
      toast.danger(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ tagId, payload }: { tagId: string; payload: UpdateAdminTagPayload }) =>
      updateAdminTag(tagId, payload),
    onSuccess: () => {
      toast.success('태그가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      close();
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '태그 수정에 실패했습니다.';
      toast.danger(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (tagId: string) => deleteAdminTag(tagId),
    onSuccess: () => {
      toast.success('태그가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '태그 삭제에 실패했습니다.';
      toast.danger(message);
    },
  });

  const submitForm = (values: TagFormValues) => {
    const payload = stripEmpty(values);
    if (modal.mode === 'edit') {
      updateMutation.mutate({ tagId: modal.entity.tagId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const requestDelete = (tag: AdminTag) => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(`태그 "${tag.name}"을(를) 삭제할까요? 되돌릴 수 없습니다.`);
    if (!ok) return;
    deleteMutation.mutate(tag.tagId);
  };

  return {
    tags: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

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
