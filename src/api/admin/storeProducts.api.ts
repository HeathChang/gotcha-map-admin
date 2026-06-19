import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminStoreOverride,
  AdminStoreOverrideListResponse,
  AdminStoreProduct,
  AdminStoreProductListResponse,
  CreateStoreOverridePayload,
  CreateStoreProductPayload,
  UpdateStoreOverridePayload,
  UpdateStoreProductPayload,
} from '@/types/storeProduct.types';
import { delay } from '@/api/admin/_mock/mockHelpers';
import { MOCK_PRODUCT_LIST } from '@/api/admin/_mock/productMockData';

// mock 상태는 모듈 단위로 들고 다닌다 (실서버 미연결 시 CRUD UX 검증용).
// 매장 단위로 분리해두어 화면 전환 시 섞이지 않게 한다.
const MOCK_PRODUCTS: Record<string, AdminStoreProduct[]> = {
  'store-001': [
    {
      id: 'sp-001',
      storeId: 'store-001',
      productId: 'prod-001',
      productName: '치이카와 키링 컬렉션 1탄',
      productImageUrl: 'https://placehold.co/200x200?text=Chiikawa',
      price: 5000,
      stock: 12,
      createdAt: '2026-04-01T03:00:00.000Z',
      updatedAt: '2026-04-01T03:00:00.000Z',
    },
    {
      id: 'sp-002',
      storeId: 'store-001',
      productId: 'prod-002',
      productName: '산리오 캐릭터즈 미니피규어 시즌3',
      productImageUrl: 'https://placehold.co/200x200?text=Sanrio',
      price: 6500,
      stock: null,
      createdAt: '2026-04-02T03:00:00.000Z',
      updatedAt: '2026-04-02T03:00:00.000Z',
    },
  ],
};

const MOCK_OVERRIDES: Record<string, AdminStoreOverride[]> = {
  'store-001': [
    {
      overrideId: 'ov-001',
      storeId: 'store-001',
      productId: 'prod-001',
      productName: '치이카와 키링 (매장 한정 컬러)',
      productInfo: '본 매장에서만 판매하는 한정 컬러 버전입니다.',
      imageUrl: null,
      price: 7000,
      stock: 5,
      createdByAdminId: 'admin-001',
      createdAt: '2026-04-05T03:00:00.000Z',
      updatedAt: '2026-04-05T03:00:00.000Z',
    },
  ],
};

function randomId(prefix: string): string {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// ─── store_products (가격/재고) ───────────────────────────────────────────

export async function listStoreProducts(
  storeId: string,
): Promise<AdminStoreProductListResponse> {
  if (ENV.useMockApi) {
    const items = (MOCK_PRODUCTS[storeId] ?? []).map((it) => ({ ...it }));
    return delay({ items });
  }

  const { data } = await adminAxios.get<AdminStoreProductListResponse>(
    `/admin/stores/${storeId}/products`,
  );
  return data;
}

export async function createStoreProduct(
  storeId: string,
  payload: CreateStoreProductPayload,
): Promise<AdminStoreProduct> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    // 실 BE 처럼 카탈로그에서 상품명·이미지를 해석 (mock/real 응답 일치).
    const catalogItem = MOCK_PRODUCT_LIST.find((p) => p.productId === payload.productId);
    const created: AdminStoreProduct = {
      id: randomId('sp'),
      storeId,
      productId: payload.productId,
      productName: catalogItem?.productName ?? payload.productId,
      productImageUrl: catalogItem?.imageUrl ?? null,
      price: payload.price,
      stock: payload.stock ?? null,
      createdAt: now,
      updatedAt: now,
    };
    const list = MOCK_PRODUCTS[storeId] ?? [];
    list.unshift(created);
    MOCK_PRODUCTS[storeId] = list;
    return delay(created);
  }

  const { data } = await adminAxios.post<AdminStoreProduct>(
    `/admin/stores/${storeId}/products`,
    payload,
  );
  return data;
}

export async function updateStoreProduct(
  storeId: string,
  storeProductId: string,
  payload: UpdateStoreProductPayload,
): Promise<AdminStoreProduct> {
  if (ENV.useMockApi) {
    const list = MOCK_PRODUCTS[storeId] ?? [];
    const idx = list.findIndex((it) => it.id === storeProductId);
    const existing = list[idx];
    if (idx < 0 || !existing) {
      throw new Error(`Store product not found: ${storeProductId}`);
    }
    const updated: AdminStoreProduct = {
      ...existing,
      price: payload.price ?? existing.price,
      stock: payload.stock === undefined ? existing.stock : (payload.stock ?? null),
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminStoreProduct>(
    `/admin/stores/${storeId}/products/${storeProductId}`,
    payload,
  );
  return data;
}

export async function deleteStoreProduct(
  storeId: string,
  storeProductId: string,
): Promise<void> {
  if (ENV.useMockApi) {
    const list = MOCK_PRODUCTS[storeId] ?? [];
    const idx = list.findIndex((it) => it.id === storeProductId);
    if (idx < 0) throw new Error(`Store product not found: ${storeProductId}`);
    list.splice(idx, 1);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/stores/${storeId}/products/${storeProductId}`);
}

// ─── store_product_overrides (카탈로그 오버라이드) ─────────────────────────

export async function listStoreOverrides(
  storeId: string,
): Promise<AdminStoreOverrideListResponse> {
  if (ENV.useMockApi) {
    const items = (MOCK_OVERRIDES[storeId] ?? []).map((it) => ({ ...it }));
    return delay({ items });
  }

  const { data } = await adminAxios.get<AdminStoreOverrideListResponse>(
    `/admin/stores/${storeId}/catalog`,
  );
  return data;
}

export async function createStoreOverride(
  storeId: string,
  payload: CreateStoreOverridePayload,
): Promise<AdminStoreOverride> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    const created: AdminStoreOverride = {
      overrideId: randomId('ov'),
      storeId,
      productId: payload.productId ?? null,
      productName: payload.productName,
      productInfo: payload.productInfo ?? null,
      imageUrl: payload.imageUrl ?? null,
      price: payload.price ?? 0,
      stock: payload.stock ?? null,
      createdByAdminId: null,
      createdAt: now,
      updatedAt: now,
    };
    const list = MOCK_OVERRIDES[storeId] ?? [];
    list.unshift(created);
    MOCK_OVERRIDES[storeId] = list;
    return delay(created);
  }

  const { data } = await adminAxios.post<AdminStoreOverride>(
    `/admin/stores/${storeId}/catalog`,
    payload,
  );
  return data;
}

export async function updateStoreOverride(
  storeId: string,
  overrideId: string,
  payload: UpdateStoreOverridePayload,
): Promise<AdminStoreOverride> {
  if (ENV.useMockApi) {
    const list = MOCK_OVERRIDES[storeId] ?? [];
    const idx = list.findIndex((it) => it.overrideId === overrideId);
    const existing = list[idx];
    if (idx < 0 || !existing) {
      throw new Error(`Store override not found: ${overrideId}`);
    }
    const updated: AdminStoreOverride = {
      ...existing,
      productId:
        payload.productId === undefined
          ? existing.productId
          : (payload.productId ?? null),
      productName: payload.productName ?? existing.productName,
      productInfo:
        payload.productInfo === undefined
          ? existing.productInfo
          : (payload.productInfo ?? null),
      imageUrl:
        payload.imageUrl === undefined
          ? existing.imageUrl
          : (payload.imageUrl ?? null),
      price: payload.price ?? existing.price,
      stock: payload.stock === undefined ? existing.stock : (payload.stock ?? null),
      updatedAt: new Date().toISOString(),
    };
    list[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminStoreOverride>(
    `/admin/stores/${storeId}/catalog/${overrideId}`,
    payload,
  );
  return data;
}

export async function deleteStoreOverride(
  storeId: string,
  overrideId: string,
): Promise<void> {
  if (ENV.useMockApi) {
    const list = MOCK_OVERRIDES[storeId] ?? [];
    const idx = list.findIndex((it) => it.overrideId === overrideId);
    if (idx < 0) throw new Error(`Store override not found: ${overrideId}`);
    list.splice(idx, 1);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/stores/${storeId}/catalog/${overrideId}`);
}
