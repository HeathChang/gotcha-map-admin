'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import { listAdminUsers, updateAdminUserStatus } from '@/api/admin/users.api';
import type {
  AdminUser,
  AdminUserStatus,
  UpdateAdminUserStatusPayload,
} from '@/types/user.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';

const QUERY_KEY = ['admin', 'users'] as const;
const PAGE_SIZE = 20;

// 'all' 은 미필터 sentinel — BE 에는 status 미전송.
export type UserStatusFilter = 'all' | '1' | '0' | '-1';

const FILTER_TO_STATUS: Record<UserStatusFilter, AdminUserStatus | undefined> = {
  all: undefined,
  '1': 1,
  '0': 0,
  '-1': -1,
};

interface UseUserListResult {
  users: ReadonlyArray<AdminUser>;
  isLoading: boolean;
  errorMessage: string | null;

  searchInput: string;
  setSearchInput: (next: string) => void;

  statusFilter: UserStatusFilter;
  setStatusFilter: (next: UserStatusFilter) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  selected: AdminUser | null;
  openStatusChange: (user: AdminUser) => void;
  closeStatusChange: () => void;
  submitStatus: (status: AdminUserStatus) => void;
  isSubmitting: boolean;
}

export function useUserList(): UseUserListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [statusFilter, setStatusFilter] = useState<UserStatusFilter>('all');
  const [selected, setSelected] = useState<AdminUser | null>(null);

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch({ resetPageDeps: [statusFilter] });

  const status = FILTER_TO_STATUS[statusFilter];

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, status, page }] as const,
    queryFn: () =>
      listAdminUsers({
        q: debouncedQ || undefined,
        status,
        page,
        limit: PAGE_SIZE,
      }),
  });

  const mutation = useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: UpdateAdminUserStatusPayload }) =>
      updateAdminUserStatus(userId, payload),
    onSuccess: () => {
      toast.success('회원 상태가 변경되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setSelected(null);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '상태 변경에 실패했습니다.';
      toast.danger(message);
    },
  });

  const submitStatus = (status: AdminUserStatus) => {
    if (!selected) return;
    mutation.mutate({ userId: selected.userId, payload: { status } });
  };

  return {
    users: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

    searchInput,
    setSearchInput,

    statusFilter,
    setStatusFilter,

    page,
    pageSize: PAGE_SIZE,
    total: query.data?.pagination.total ?? 0,
    setPage,

    selected,
    openStatusChange: setSelected,
    closeStatusChange: () => setSelected(null),
    submitStatus,
    isSubmitting: mutation.isPending,
  };
}
