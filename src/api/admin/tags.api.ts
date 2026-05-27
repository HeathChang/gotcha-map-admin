import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminTag,
  AdminTagListResponse,
  CreateAdminTagPayload,
  ListAdminTagParams,
  UpdateAdminTagPayload,
} from '@/types/tag.types';
import { MOCK_TAGS } from '@/api/admin/_mock/tagMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

// mock 상태는 모듈 단위로 가지고 다닌다 (실서버 미연결 시 CRUD UX 검증용).
const MOCK_STATE: AdminTag[] = MOCK_TAGS.map((it) => ({ ...it }));

function paginateTags(
  list: AdminTag[],
  page: number,
  limit: number,
): AdminTagListResponse {
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

export async function listAdminTags(
  params: ListAdminTagParams = {},
): Promise<AdminTagListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter((it) => it.name.toLowerCase().includes(needle));
    }
    if (params.relationType) {
      filtered = filtered.filter((it) => it.relationType === params.relationType);
    }
    return delay(paginateTags(filtered, page, limit));
  }

  const { data } = await adminAxios.get<AdminTagListResponse>('/admin/tags', {
    params: { ...params, page, limit },
  });
  return data;
}

export async function createAdminTag(
  payload: CreateAdminTagPayload,
): Promise<AdminTag> {
  if (ENV.useMockApi) {
    const newTag: AdminTag = {
      tagId: `tag-${Math.random().toString(36).slice(2, 8)}`,
      name: payload.name,
      relationType: payload.relationType ?? null,
      createdAt: new Date().toISOString(),
    };
    MOCK_STATE.unshift(newTag);
    return delay(newTag);
  }

  const { data } = await adminAxios.post<AdminTag>('/admin/tags', payload);
  return data;
}

export async function updateAdminTag(
  tagId: string,
  payload: UpdateAdminTagPayload,
): Promise<AdminTag> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.tagId === tagId);
    const existing = MOCK_STATE[idx];
    if (idx < 0 || !existing) throw new Error(`Tag not found: ${tagId}`);
    const updated: AdminTag = {
      ...existing,
      name: payload.name ?? existing.name,
      relationType:
        payload.relationType === undefined
          ? existing.relationType
          : (payload.relationType ?? null),
    };
    MOCK_STATE[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminTag>(`/admin/tags/${tagId}`, payload);
  return data;
}

export async function deleteAdminTag(tagId: string): Promise<void> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.tagId === tagId);
    if (idx < 0) throw new Error(`Tag not found: ${tagId}`);
    MOCK_STATE.splice(idx, 1);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/tags/${tagId}`);
}
