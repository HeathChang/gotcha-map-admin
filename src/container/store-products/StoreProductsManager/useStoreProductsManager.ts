'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import {
  createStoreOverride,
  createStoreProduct,
  deleteStoreOverride,
  deleteStoreProduct,
  listStoreOverrides,
  listStoreProducts,
  updateStoreOverride,
  updateStoreProduct,
} from '@/api/admin/storeProducts.api';
import { listAdminProducts } from '@/api/admin/products.api';
import type {
  AdminStoreOverride,
  AdminStoreProduct,
  CreateStoreOverridePayload,
  CreateStoreProductPayload,
  UpdateStoreOverridePayload,
  UpdateStoreProductPayload,
} from '@/types/storeProduct.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { useCrudModal, type CrudModalState } from '@/lib/hooks/useCrudModal';
import type { StoreProductFormValues, StoreProductOption } from '@/ui/store-products/StoreProductForm/StoreProductForm.types';
import type { StoreOverrideFormValues } from '@/ui/store-products/StoreOverrideForm/StoreOverrideForm.types';

const PRODUCTS_KEY = ['admin', 'store-products'] as const;
const CATALOG_KEY = ['admin', 'store-catalog'] as const;
// 제품 선택지는 글로벌 카탈로그에서 최대 100개까지 끌어온다.
const PRODUCT_OPTION_LIMIT = 100;

interface UseStoreProductsManagerResult {
  // 가격/재고
  products: ReadonlyArray<AdminStoreProduct>;
  productsLoading: boolean;
  productsError: string | null;
  productOptions: ReadonlyArray<StoreProductOption>;

  productModal: CrudModalState<AdminStoreProduct>;
  openCreateProduct: () => void;
  openEditProduct: (product: AdminStoreProduct) => void;
  closeProductModal: () => void;
  submitProduct: (values: StoreProductFormValues) => void;
  isSubmittingProduct: boolean;
  requestDeleteProduct: (product: AdminStoreProduct) => void;
  isDeletingProduct: boolean;

  // 카탈로그 오버라이드
  overrides: ReadonlyArray<AdminStoreOverride>;
  overridesLoading: boolean;
  overridesError: string | null;

  overrideModal: CrudModalState<AdminStoreOverride>;
  openCreateOverride: () => void;
  openEditOverride: (override: AdminStoreOverride) => void;
  closeOverrideModal: () => void;
  submitOverride: (values: StoreOverrideFormValues) => void;
  isSubmittingOverride: boolean;
  requestDeleteOverride: (override: AdminStoreOverride) => void;
  isDeletingOverride: boolean;
}

function toCreateProductPayload(
  values: StoreProductFormValues,
): CreateStoreProductPayload {
  return {
    productId: values.productId,
    price: values.price,
    stock: values.stock === '' ? null : Number(values.stock),
  };
}

function toUpdateProductPayload(
  values: StoreProductFormValues,
): UpdateStoreProductPayload {
  return {
    price: values.price,
    stock: values.stock === '' ? null : Number(values.stock),
  };
}

function toOverridePayload(
  values: StoreOverrideFormValues,
): CreateStoreOverridePayload {
  return {
    productId: values.productId === '' ? null : values.productId,
    productName: values.productName,
    productInfo: values.productInfo === '' ? null : values.productInfo,
    imageUrl: values.imageUrl === '' ? null : values.imageUrl,
    price: values.price,
    stock: values.stock === '' ? null : Number(values.stock),
  };
}

export function useStoreProductsManager(
  storeId: string,
): UseStoreProductsManagerResult {
  const queryClient = useQueryClient();
  const toast = useToast();

  const productsQueryKey = [...PRODUCTS_KEY, storeId] as const;
  const catalogQueryKey = [...CATALOG_KEY, storeId] as const;

  const productModalState = useCrudModal<AdminStoreProduct>();
  const overrideModalState = useCrudModal<AdminStoreOverride>();

  // ── 가격/재고 ──────────────────────────────────────────────────────────
  const productsQuery = useQuery({
    queryKey: productsQueryKey,
    queryFn: () => listStoreProducts(storeId),
  });

  // 신규 등록용 제품 선택지 (글로벌 카탈로그).
  const productCatalogQuery = useQuery({
    queryKey: ['admin', 'product-options', PRODUCT_OPTION_LIMIT] as const,
    queryFn: () => listAdminProducts({ page: 1, limit: PRODUCT_OPTION_LIMIT }),
  });

  const createProductMutation = useMutation({
    mutationFn: (payload: CreateStoreProductPayload) =>
      createStoreProduct(storeId, payload),
    onSuccess: () => {
      toast.success('가격·재고가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      productModalState.close();
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '등록에 실패했습니다.',
      );
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStoreProductPayload }) =>
      updateStoreProduct(storeId, id, payload),
    onSuccess: () => {
      toast.success('가격·재고가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
      productModalState.close();
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '수정에 실패했습니다.',
      );
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => deleteStoreProduct(storeId, id),
    onSuccess: () => {
      toast.success('가격·재고가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: productsQueryKey });
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '삭제에 실패했습니다.',
      );
    },
  });

  const submitProduct = (values: StoreProductFormValues) => {
    if (productModalState.modal.mode === 'edit') {
      updateProductMutation.mutate({
        id: productModalState.modal.entity.id,
        payload: toUpdateProductPayload(values),
      });
    } else {
      createProductMutation.mutate(toCreateProductPayload(values));
    }
  };

  const requestDeleteProduct = (product: AdminStoreProduct) => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(
        `"${product.productName}"의 가격·재고를 삭제할까요? 되돌릴 수 없습니다.`,
      );
    if (!ok) return;
    deleteProductMutation.mutate(product.id);
  };

  // ── 카탈로그 오버라이드 ────────────────────────────────────────────────
  const overridesQuery = useQuery({
    queryKey: catalogQueryKey,
    queryFn: () => listStoreOverrides(storeId),
  });

  const createOverrideMutation = useMutation({
    mutationFn: (payload: CreateStoreOverridePayload) =>
      createStoreOverride(storeId, payload),
    onSuccess: () => {
      toast.success('오버라이드가 등록되었습니다.');
      queryClient.invalidateQueries({ queryKey: catalogQueryKey });
      overrideModalState.close();
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '등록에 실패했습니다.',
      );
    },
  });

  const updateOverrideMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateStoreOverridePayload }) =>
      updateStoreOverride(storeId, id, payload),
    onSuccess: () => {
      toast.success('오버라이드가 수정되었습니다.');
      queryClient.invalidateQueries({ queryKey: catalogQueryKey });
      overrideModalState.close();
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '수정에 실패했습니다.',
      );
    },
  });

  const deleteOverrideMutation = useMutation({
    mutationFn: (id: string) => deleteStoreOverride(storeId, id),
    onSuccess: () => {
      toast.success('오버라이드가 삭제되었습니다.');
      queryClient.invalidateQueries({ queryKey: catalogQueryKey });
    },
    onError: (error: unknown) => {
      toast.danger(
        error instanceof AdminApiError ? error.message : '삭제에 실패했습니다.',
      );
    },
  });

  const submitOverride = (values: StoreOverrideFormValues) => {
    if (overrideModalState.modal.mode === 'edit') {
      updateOverrideMutation.mutate({
        id: overrideModalState.modal.entity.overrideId,
        payload: toOverridePayload(values),
      });
    } else {
      createOverrideMutation.mutate(toOverridePayload(values));
    }
  };

  const requestDeleteOverride = (override: AdminStoreOverride) => {
    const ok =
      typeof window !== 'undefined' &&
      window.confirm(
        `"${override.productName}" 오버라이드를 삭제할까요? 되돌릴 수 없습니다.`,
      );
    if (!ok) return;
    deleteOverrideMutation.mutate(override.overrideId);
  };

  const productOptions: StoreProductOption[] = (
    productCatalogQuery.data?.items ?? []
  ).map((it) => ({ productId: it.productId, productName: it.productName }));

  return {
    products: productsQuery.data?.items ?? [],
    productsLoading: productsQuery.isLoading,
    productsError:
      productsQuery.error instanceof AdminApiError
        ? productsQuery.error.message
        : null,
    productOptions,

    productModal: productModalState.modal,
    openCreateProduct: productModalState.openCreate,
    openEditProduct: productModalState.openEdit,
    closeProductModal: productModalState.close,
    submitProduct,
    isSubmittingProduct:
      createProductMutation.isPending || updateProductMutation.isPending,
    requestDeleteProduct,
    isDeletingProduct: deleteProductMutation.isPending,

    overrides: overridesQuery.data?.items ?? [],
    overridesLoading: overridesQuery.isLoading,
    overridesError:
      overridesQuery.error instanceof AdminApiError
        ? overridesQuery.error.message
        : null,

    overrideModal: overrideModalState.modal,
    openCreateOverride: overrideModalState.openCreate,
    openEditOverride: overrideModalState.openEdit,
    closeOverrideModal: overrideModalState.close,
    submitOverride,
    isSubmittingOverride:
      createOverrideMutation.isPending || updateOverrideMutation.isPending,
    requestDeleteOverride,
    isDeletingOverride: deleteOverrideMutation.isPending,
  };
}
