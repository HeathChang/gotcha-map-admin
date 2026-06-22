'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createAdmin,
  listAdmins,
  resetAdminPassword,
  updateAdminStatus,
} from '@/api/admin/admins.api';
import { listAdminStores } from '@/api/admin/stores.api';
import type { AdminRole } from '@/types/admin.types';
import type {
  AdminManagedUser,
  CreateAdminManagedUserPayload,
} from '@/types/adminManagement.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';
import type {
  AdminStoreOption,
  AdminUserFormValues,
} from '@/ui/admins/AdminUserForm/AdminUserForm.types';
import type { PasswordResetFormValues } from '@/ui/admins/PasswordResetForm/PasswordResetForm.types';

const QUERY_KEY = ['admin', 'admins'] as const;
const PAGE_SIZE = 20;
const STORE_OPTION_LIMIT = 100;

// 'all' 은 미필터 sentinel — BE 에는 role 미전송.
export type AdminRoleFilter = 'all' | AdminRole;

interface UseAdminUserListResult {
  admins: ReadonlyArray<AdminManagedUser>;
  isLoading: boolean;
  errorMessage: string | null;

  searchInput: string;
  setSearchInput: (next: string) => void;

  roleFilter: AdminRoleFilter;
  setRoleFilter: (next: AdminRoleFilter) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  // 운영자 생성 모달
  isCreateOpen: boolean;
  openCreate: () => void;
  closeCreate: () => void;
  storeOptions: ReadonlyArray<AdminStoreOption>;
  storeOptionsLoading: boolean;
  submitCreate: (values: AdminUserFormValues) => void;
  isCreating: boolean;

  // 활성/비활성 토글
  toggleStatus: (admin: AdminManagedUser) => void;
  pendingStatusId: string | null;

  // 비밀번호 재설정 모달
  passwordTarget: AdminManagedUser | null;
  openPasswordReset: (admin: AdminManagedUser) => void;
  closePasswordReset: () => void;
  submitPasswordReset: (values: PasswordResetFormValues) => void;
  isResettingPassword: boolean;
}

function toCreatePayload(
  values: AdminUserFormValues,
): CreateAdminManagedUserPayload {
  return {
    email: values.email,
    password: values.password,
    name: values.name,
    role: values.role,
    storeId: values.role === 'member' ? values.storeId : null,
  };
}

export function useAdminUserList(): UseAdminUserListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [roleFilter, setRoleFilter] = useState<AdminRoleFilter>('all');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
  const [passwordTarget, setPasswordTarget] = useState<AdminManagedUser | null>(
    null,
  );

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch({ resetPageDeps: [roleFilter] });

  const role = roleFilter === 'all' ? undefined : roleFilter;

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, role, page }] as const,
    queryFn: () =>
      listAdmins({
        q: debouncedQ || undefined,
        role,
        page,
        limit: PAGE_SIZE,
      }),
  });

  // 점주 계정 생성 시 담당 매장 선택지 (최대 100개).
  const storeQuery = useQuery({
    queryKey: ['admin', 'store-options', STORE_OPTION_LIMIT] as const,
    queryFn: () => listAdminStores({ page: 1, limit: STORE_OPTION_LIMIT }),
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminManagedUserPayload) => createAdmin(payload),
    onSuccess: () => {
      toast.success('운영자 계정이 생성되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setIsCreateOpen(false);
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError
          ? error.message
          : '운영자 생성에 실패했습니다.',
      );
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ adminId, status }: { adminId: string; status: 1 | 0 }) =>
      updateAdminStatus(adminId, { status }),
    onMutate: ({ adminId }) => {
      setPendingStatusId(adminId);
    },
    onSuccess: (updated) => {
      toast.success(
        updated.status === 1
          ? '운영자를 활성화했습니다.'
          : '운영자를 비활성화했습니다.',
      );
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '상태 변경에 실패했습니다.',
      );
    },
    onSettled: () => {
      setPendingStatusId(null);
    },
  });

  const passwordMutation = useMutation({
    mutationFn: ({ adminId, password }: { adminId: string; password: string }) =>
      resetAdminPassword(adminId, { password }),
    onSuccess: () => {
      toast.success('비밀번호가 변경되었습니다.');
      setPasswordTarget(null);
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError
          ? error.message
          : '비밀번호 변경에 실패했습니다.',
      );
    },
  });

  const submitCreate = (values: AdminUserFormValues) => {
    createMutation.mutate(toCreatePayload(values));
  };

  const toggleStatus = (admin: AdminManagedUser) => {
    if (pendingStatusId !== null) return;
    const nextStatus: 1 | 0 = admin.status === 1 ? 0 : 1;
    statusMutation.mutate({ adminId: admin.adminId, status: nextStatus });
  };

  const submitPasswordReset = (values: PasswordResetFormValues) => {
    if (!passwordTarget) return;
    passwordMutation.mutate({
      adminId: passwordTarget.adminId,
      password: values.password,
    });
  };

  const storeOptions: AdminStoreOption[] = (storeQuery.data?.items ?? []).map(
    (it) => ({ storeId: it.storeId, name: it.name }),
  );

  return {
    admins: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

    searchInput,
    setSearchInput,

    roleFilter,
    setRoleFilter,

    page,
    pageSize: PAGE_SIZE,
    total: query.data?.pagination.total ?? 0,
    setPage,

    isCreateOpen,
    openCreate: () => setIsCreateOpen(true),
    closeCreate: () => setIsCreateOpen(false),
    storeOptions,
    storeOptionsLoading: storeQuery.isLoading,
    submitCreate,
    isCreating: createMutation.isPending,

    toggleStatus,
    pendingStatusId,

    passwordTarget,
    openPasswordReset: setPasswordTarget,
    closePasswordReset: () => setPasswordTarget(null),
    submitPasswordReset,
    isResettingPassword: passwordMutation.isPending,
  };
}
