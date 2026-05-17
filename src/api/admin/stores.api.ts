import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminStore,
  AdminStoreListResponse,
  CreateAdminStorePayload,
  ListAdminStoreParams,
  UpdateAdminStorePayload,
} from '@/types/store.types';
import { MOCK_STORES } from '@/api/admin/_mock/storeMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

// mock 상태는 모듈 단위로 가지고 다닌다 (실서버 미연결 시 CRUD UX 검증용).
const MOCK_STATE: AdminStore[] = MOCK_STORES.map((it) => ({ ...it }));

function paginateStores(
  list: AdminStore[],
  page: number,
  limit: number,
): AdminStoreListResponse {
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

export async function listAdminStores(
  params: ListAdminStoreParams = {},
): Promise<AdminStoreListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter(
        (it) =>
          it.name.toLowerCase().includes(needle) ||
          it.address.toLowerCase().includes(needle),
      );
    }
    return delay(paginateStores(filtered, page, limit));
  }

  const { data } = await adminAxios.get<AdminStoreListResponse>('/admin/stores', {
    params: { ...params, page, limit },
  });
  return data;
}

export async function createAdminStore(
  payload: CreateAdminStorePayload,
): Promise<AdminStore> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    const newStore: AdminStore = {
      storeId: `store-${Math.random().toString(36).slice(2, 8)}`,
      name: payload.name,
      address: payload.address,
      lat: payload.lat,
      lon: payload.lon,
      phone: payload.phone ?? null,
      description: payload.description ?? null,
      imageUrl: payload.imageUrl ?? null,
      openingHours: payload.openingHours ?? null,
      rating: payload.rating ?? 0,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_STATE.unshift(newStore);
    return delay(newStore);
  }

  const { data } = await adminAxios.post<AdminStore>('/admin/stores', payload);
  return data;
}

export async function updateAdminStore(
  storeId: string,
  payload: UpdateAdminStorePayload,
): Promise<AdminStore> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.storeId === storeId);
    const existing = MOCK_STATE[idx];
    if (idx < 0 || !existing) throw new Error(`Store not found: ${storeId}`);
    const updated: AdminStore = {
      ...existing,
      ...payload,
      // partial 에서 undefined 로 들어온 키가 null 로 덮어쓰지 않도록 좁힌다.
      phone: payload.phone === undefined ? existing.phone : (payload.phone ?? null),
      description:
        payload.description === undefined ? existing.description : (payload.description ?? null),
      imageUrl:
        payload.imageUrl === undefined ? existing.imageUrl : (payload.imageUrl ?? null),
      openingHours:
        payload.openingHours === undefined
          ? existing.openingHours
          : (payload.openingHours ?? null),
      updatedAt: new Date().toISOString(),
    };
    MOCK_STATE[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminStore>(
    `/admin/stores/${storeId}`,
    payload,
  );
  return data;
}

export async function deleteAdminStore(storeId: string): Promise<void> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.storeId === storeId);
    if (idx < 0) throw new Error(`Store not found: ${storeId}`);
    MOCK_STATE.splice(idx, 1);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/stores/${storeId}`);
}
