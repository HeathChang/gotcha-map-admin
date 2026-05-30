import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminProductDetail,
  AdminProductListItem,
  AdminProductListResponse,
  CreateAdminProductPayload,
  ListAdminProductParams,
  UpdateAdminProductPayload,
} from '@/types/product.types';
import {
  MOCK_PRODUCT_LIST,
  buildMockProductDetail,
} from '@/api/admin/_mock/productMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

// mock 상태는 모듈 단위로 가지고 다닌다. detail 갤러리/태그는 별도 저장.
const MOCK_LIST: AdminProductListItem[] = MOCK_PRODUCT_LIST.map((it) => ({ ...it }));
const MOCK_EXTRAS: Map<string, { images: string[]; tagIds: string[] }> = new Map();

function paginate(
  list: AdminProductListItem[],
  page: number,
  limit: number,
): AdminProductListResponse {
  const start = (page - 1) * limit;
  const total = list.length;
  return {
    items: list.slice(start, start + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  };
}

export async function listAdminProducts(
  params: ListAdminProductParams = {},
): Promise<AdminProductListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_LIST;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter((it) =>
        it.productName.toLowerCase().includes(needle),
      );
    }
    if (params.category) {
      filtered = filtered.filter((it) => it.category === params.category);
    }
    if (params.isNew !== undefined) {
      filtered = filtered.filter((it) => it.isNew === params.isNew);
    }
    if (params.isPopular !== undefined) {
      filtered = filtered.filter((it) => it.isPopular === params.isPopular);
    }
    if (params.genderTarget) {
      filtered = filtered.filter((it) => it.genderTarget === params.genderTarget);
    }
    return delay(paginate(filtered, page, limit));
  }

  const { data } = await adminAxios.get<AdminProductListResponse>('/admin/products', {
    params: { ...params, page, limit },
  });
  return data;
}

export async function getAdminProductDetail(
  productId: string,
): Promise<AdminProductDetail> {
  if (ENV.useMockApi) {
    const item = MOCK_LIST.find((it) => it.productId === productId);
    if (!item) throw new Error(`Product not found: ${productId}`);
    const seed = buildMockProductDetail(item);
    // 모듈 상태에 저장된 변경분이 있으면 그것을 우선한다.
    const override = MOCK_EXTRAS.get(productId);
    if (override) {
      const tags = override.tagIds.map((id) => {
        const existing = seed.tags.find((t) => t.tagId === id);
        return existing ?? { tagId: id, name: id, relationType: null };
      });
      return delay({ ...seed, images: override.images, tags });
    }
    return delay(seed);
  }

  const { data } = await adminAxios.get<AdminProductDetail>(
    `/admin/products/${productId}`,
  );
  return data;
}

export async function createAdminProduct(
  payload: CreateAdminProductPayload,
): Promise<AdminProductDetail> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    const productId = `prod-${Math.random().toString(36).slice(2, 8)}`;
    const item: AdminProductListItem = {
      productId,
      productName: payload.productName,
      productManufacturer: payload.productManufacturer ?? null,
      productInfo: payload.productInfo ?? null,
      category: payload.category ?? null,
      minPrice: payload.minPrice,
      maxPrice: payload.maxPrice,
      imageUrl: payload.imageUrl ?? null,
      viewCount: 0,
      isNew: payload.isNew ?? false,
      isPopular: payload.isPopular ?? false,
      genderTarget: payload.genderTarget ?? 'ALL',
      tagCount: payload.tagIds?.length ?? 0,
      imageCount: payload.images?.length ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_LIST.unshift(item);
    MOCK_EXTRAS.set(productId, {
      images: payload.images ?? [],
      tagIds: payload.tagIds ?? [],
    });
    return delay({
      ...item,
      images: payload.images ?? [],
      tags: (payload.tagIds ?? []).map((id) => ({
        tagId: id,
        name: id,
        relationType: null,
      })),
    });
  }

  const { data } = await adminAxios.post<AdminProductDetail>(
    '/admin/products',
    payload,
  );
  return data;
}

export async function updateAdminProduct(
  productId: string,
  payload: UpdateAdminProductPayload,
): Promise<AdminProductDetail> {
  if (ENV.useMockApi) {
    const idx = MOCK_LIST.findIndex((it) => it.productId === productId);
    const existing = MOCK_LIST[idx];
    if (idx < 0 || !existing) throw new Error(`Product not found: ${productId}`);

    const merged: AdminProductListItem = {
      ...existing,
      productName: payload.productName ?? existing.productName,
      productManufacturer:
        payload.productManufacturer === undefined
          ? existing.productManufacturer
          : (payload.productManufacturer ?? null),
      productInfo:
        payload.productInfo === undefined
          ? existing.productInfo
          : (payload.productInfo ?? null),
      category:
        payload.category === undefined
          ? existing.category
          : (payload.category ?? null),
      minPrice: payload.minPrice ?? existing.minPrice,
      maxPrice: payload.maxPrice ?? existing.maxPrice,
      imageUrl:
        payload.imageUrl === undefined
          ? existing.imageUrl
          : (payload.imageUrl ?? null),
      isNew: payload.isNew ?? existing.isNew,
      isPopular: payload.isPopular ?? existing.isPopular,
      genderTarget: payload.genderTarget ?? existing.genderTarget,
      tagCount: payload.tagIds?.length ?? existing.tagCount,
      imageCount: payload.images?.length ?? existing.imageCount,
      updatedAt: new Date().toISOString(),
    };
    MOCK_LIST[idx] = merged;

    if (payload.images !== undefined || payload.tagIds !== undefined) {
      const prev = MOCK_EXTRAS.get(productId) ?? { images: [], tagIds: [] };
      MOCK_EXTRAS.set(productId, {
        images: payload.images ?? prev.images,
        tagIds: payload.tagIds ?? prev.tagIds,
      });
    }
    return getAdminProductDetail(productId);
  }

  const { data } = await adminAxios.patch<AdminProductDetail>(
    `/admin/products/${productId}`,
    payload,
  );
  return data;
}

export async function deleteAdminProduct(productId: string): Promise<void> {
  if (ENV.useMockApi) {
    const idx = MOCK_LIST.findIndex((it) => it.productId === productId);
    if (idx < 0) throw new Error(`Product not found: ${productId}`);
    MOCK_LIST.splice(idx, 1);
    MOCK_EXTRAS.delete(productId);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/products/${productId}`);
}
