'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createAdminProduct,
  deleteAdminProduct,
  getAdminProductDetail,
  listAdminProducts,
  updateAdminProduct,
} from '@/api/admin/products.api';
import { listAdminTags } from '@/api/admin/tags.api';
import type {
  AdminProductDetail,
  AdminProductListItem,
  CreateAdminProductPayload,
  UpdateAdminProductPayload,
} from '@/types/product.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';
import type {
  ProductFormValues,
  TagOption,
} from '@/ui/products/ProductForm/ProductForm.types';

const QUERY_KEY = ['admin', 'products'] as const;
const TAGS_KEY = ['admin', 'tags', 'for-products'] as const;
const PAGE_SIZE = 20;

type ModalMode = 'closed' | 'create' | 'edit';

interface UseProductListResult {
  products: ReadonlyArray<AdminProductListItem>;
  isLoading: boolean;
  errorMessage: string | null;

  searchInput: string;
  setSearchInput: (next: string) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  tagOptions: ReadonlyArray<TagOption>;

  modalMode: ModalMode;
  openCreate: () => void;
  openEdit: (item: AdminProductListItem) => void;
  closeModal: () => void;

  /** edit 모달에서 form 채우기에 쓸 상세. 로딩 중엔 null. */
  editingDetail: AdminProductDetail | null;
  editingDetailLoading: boolean;
  /** 선택된 제품 (테이블 강조용). */
  selectedProductId: string | null;

  submitForm: (values: ProductFormValues) => void;
  isSubmitting: boolean;

  requestDelete: (item: AdminProductListItem) => void;
  isDeleting: boolean;
}

// 폼 값 → BE payload. 빈 문자열은 null 로, 빈 image URL 항목은 제거.
function toPayload(values: ProductFormValues): CreateAdminProductPayload {
  return {
    productName: values.productName,
    productManufacturer:
      values.productManufacturer === '' ? null : values.productManufacturer,
    productInfo: values.productInfo === '' ? null : values.productInfo,
    category: values.category === '' ? null : values.category,
    minPrice: values.minPrice,
    maxPrice: values.maxPrice,
    imageUrl: values.imageUrl === '' ? null : values.imageUrl,
    isNew: values.isNew,
    isPopular: values.isPopular,
    genderTarget: values.genderTarget,
    images: values.images.map((it) => it.url).filter((url) => url !== ''),
    tagIds: values.tagIds,
  };
}

export function useProductList(): UseProductListResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const [modalMode, setModalMode] = useState<ModalMode>('closed');
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const { searchInput, setSearchInput, debouncedQ, page, setPage } =
    usePaginatedSearch();

  const query = useQuery({
    queryKey: [...QUERY_KEY, { q: debouncedQ, page }] as const,
    queryFn: () =>
      listAdminProducts({ q: debouncedQ || undefined, page, limit: PAGE_SIZE }),
  });

  // 폼의 태그 multi-select 옵션. limit=100 으로 한 번에 가져온다 (태그 master 는 소규모).
  const tagsQuery = useQuery({
    queryKey: TAGS_KEY,
    queryFn: () => listAdminTags({ limit: 100 }),
    staleTime: 60_000,
  });

  // edit 모달 열렸을 때만 상세 페치.
  const detailQuery = useQuery({
    queryKey: [...QUERY_KEY, 'detail', editingProductId] as const,
    queryFn: () =>
      getAdminProductDetail(editingProductId as string),
    enabled: modalMode === 'edit' && editingProductId !== null,
  });

  const createMutation = useMutation({
    mutationFn: (payload: CreateAdminProductPayload) => createAdminProduct(payload),
    onSuccess: () => {
      toast.success('제품이 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setModalMode('closed');
      setEditingProductId(null);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '제품 등록에 실패했습니다.';
      toast.danger(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      productId,
      payload,
    }: {
      productId: string;
      payload: UpdateAdminProductPayload;
    }) => updateAdminProduct(productId, payload),
    onSuccess: () => {
      toast.success('제품이 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      setModalMode('closed');
      setEditingProductId(null);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '제품 수정에 실패했습니다.';
      toast.danger(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (productId: string) => deleteAdminProduct(productId),
    onSuccess: () => {
      toast.success('제품이 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError ? error.message : '제품 삭제에 실패했습니다.';
      toast.danger(message);
    },
  });

  const submitForm = (values: ProductFormValues) => {
    const payload = toPayload(values);
    if (modalMode === 'edit' && editingProductId) {
      updateMutation.mutate({ productId: editingProductId, payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const requestDelete = (item: AdminProductListItem) => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(
        `제품 "${item.productName}"을(를) 삭제할까요? 갤러리·태그·스토어 매핑도 함께 정리됩니다.`,
      );
    if (!ok) return;
    deleteMutation.mutate(item.productId);
  };

  return {
    products: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

    searchInput,
    setSearchInput,

    page,
    pageSize: PAGE_SIZE,
    total: query.data?.pagination.total ?? 0,
    setPage,

    tagOptions: tagsQuery.data?.items ?? [],

    modalMode,
    openCreate: () => {
      setEditingProductId(null);
      setModalMode('create');
    },
    openEdit: (item) => {
      setEditingProductId(item.productId);
      setModalMode('edit');
    },
    closeModal: () => {
      setModalMode('closed');
      setEditingProductId(null);
    },

    editingDetail: detailQuery.data ?? null,
    editingDetailLoading: detailQuery.isLoading,
    selectedProductId: editingProductId,

    submitForm,
    isSubmitting: createMutation.isPending || updateMutation.isPending,

    requestDelete,
    isDeleting: deleteMutation.isPending,
  };
}
