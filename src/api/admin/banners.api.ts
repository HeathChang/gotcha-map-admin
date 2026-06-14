import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminBanner,
  AdminBannerListResponse,
  CreateAdminBannerPayload,
  ListAdminBannerParams,
  UpdateAdminBannerPayload,
} from '@/types/banner.types';
import { MOCK_BANNERS } from '@/api/admin/_mock/bannerMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

const MOCK_STATE: AdminBanner[] = MOCK_BANNERS.map((it) => ({ ...it }));

function paginate(
  list: AdminBanner[],
  page: number,
  limit: number,
): AdminBannerListResponse {
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

export async function listAdminBanners(
  params: ListAdminBannerParams = {},
): Promise<AdminBannerListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter((it) =>
        (it.title ?? '').toLowerCase().includes(needle),
      );
    }
    if (params.isActive !== undefined) {
      filtered = filtered.filter((it) => it.isActive === params.isActive);
    }
    const sorted = [...filtered].sort((a, b) => a.sortOrder - b.sortOrder);
    return delay(paginate(sorted, page, limit));
  }

  const { data } = await adminAxios.get<AdminBannerListResponse>('/admin/banners', {
    params: { ...params, page, limit },
  });
  return data;
}

export async function createAdminBanner(
  payload: CreateAdminBannerPayload,
): Promise<AdminBanner> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    const created: AdminBanner = {
      bannerId: `banner-${Math.random().toString(36).slice(2, 8)}`,
      title: payload.title ?? null,
      imageUrl: payload.imageUrl,
      linkUrl: payload.linkUrl ?? null,
      sortOrder: payload.sortOrder ?? 0,
      isActive: payload.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_STATE.push(created);
    return delay(created);
  }

  const { data } = await adminAxios.post<AdminBanner>('/admin/banners', payload);
  return data;
}

export async function updateAdminBanner(
  bannerId: string,
  payload: UpdateAdminBannerPayload,
): Promise<AdminBanner> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.bannerId === bannerId);
    const existing = MOCK_STATE[idx];
    if (idx < 0 || !existing) throw new Error(`Banner not found: ${bannerId}`);
    const updated: AdminBanner = {
      ...existing,
      title: payload.title ?? existing.title,
      imageUrl: payload.imageUrl ?? existing.imageUrl,
      linkUrl: payload.linkUrl ?? existing.linkUrl,
      sortOrder: payload.sortOrder ?? existing.sortOrder,
      isActive: payload.isActive ?? existing.isActive,
      updatedAt: new Date().toISOString(),
    };
    MOCK_STATE[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminBanner>(
    `/admin/banners/${bannerId}`,
    payload,
  );
  return data;
}

export async function deleteAdminBanner(bannerId: string): Promise<void> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.bannerId === bannerId);
    if (idx < 0) throw new Error(`Banner not found: ${bannerId}`);
    MOCK_STATE.splice(idx, 1);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/banners/${bannerId}`);
}

/**
 * 이미지 업로드 → 저장 가능한 상대경로(`/uploads/...`) 반환.
 * 관리자 전용 업로드 엔드포인트(POST /admin/images, adminAuth)를 사용한다.
 */
export async function uploadAdminImage(file: File): Promise<string> {
  if (ENV.useMockApi) {
    // mock 모드에선 실제 업로드 없이 샘플 경로를 돌려준다.
    return delay('/uploads/sample/sample-banner.jpeg');
  }

  const formData = new FormData();
  formData.append('image', file);
  const { data } = await adminAxios.post<{ imageUrl: string }>(
    '/admin/images',
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } },
  );
  return data.imageUrl;
}
