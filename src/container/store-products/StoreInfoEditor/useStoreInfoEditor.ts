'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import { getAdminStore, updateAdminStore } from '@/api/admin/stores.api';
import type {
  AdminStore,
  CreateAdminStorePayload,
  UpdateAdminStorePayload,
} from '@/types/store.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import type { StoreFormValues } from '@/ui/stores/StoreForm/StoreForm.types';

const QUERY_KEY = ['admin', 'store-detail'] as const;

interface UseStoreInfoEditorResult {
  store: AdminStore | null;
  isLoading: boolean;
  errorMessage: string | null;

  isEditing: boolean;
  openEdit: () => void;
  closeEdit: () => void;
  submitEdit: (values: StoreFormValues) => void;
  isSubmitting: boolean;
}

// react-hook-form 의 빈 문자열을 BE 가 기대하는 null 로 변환한다 (stores.api 의 stripEmpty 와 동일).
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

/**
 * 단일 매장 정보 조회 + 수정 훅. /my-store(점주) 와 /stores/[storeId](admin·staff)
 * 가 동일하게 재사용한다. 수정 권한은 BE 가 강제한다 (member 는 본인 매장만).
 */
export function useStoreInfoEditor(storeId: string): UseStoreInfoEditorResult {
  const queryClient = useQueryClient();
  const toast = useToast();
  const [isEditing, setIsEditing] = useState(false);

  const queryKey = [...QUERY_KEY, storeId] as const;

  const query = useQuery({
    queryKey,
    queryFn: () => getAdminStore(storeId),
  });

  const updateMutation = useMutation({
    mutationFn: (payload: UpdateAdminStorePayload) =>
      updateAdminStore(storeId, payload),
    onSuccess: () => {
      toast.success('매장 정보가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey });
      queryClient.invalidateQueries({ queryKey: ['admin', 'stores'] });
      setIsEditing(false);
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '매장 수정에 실패했습니다.',
      );
    },
  });

  const submitEdit = (values: StoreFormValues) => {
    updateMutation.mutate(stripEmpty(values));
  };

  return {
    store: query.data ?? null,
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

    isEditing,
    openEdit: () => setIsEditing(true),
    closeEdit: () => setIsEditing(false),
    submitEdit,
    isSubmitting: updateMutation.isPending,
  };
}
