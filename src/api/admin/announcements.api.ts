import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminAnnouncement,
  AdminAnnouncementListResponse,
  CreateAdminAnnouncementPayload,
  ListAdminAnnouncementParams,
  UpdateAdminAnnouncementPayload,
} from '@/types/announcement.types';
import { MOCK_ANNOUNCEMENTS } from '@/api/admin/_mock/announcementMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

const MOCK_STATE: AdminAnnouncement[] = MOCK_ANNOUNCEMENTS.map((it) => ({ ...it }));

function paginate(
  list: AdminAnnouncement[],
  page: number,
  limit: number,
): AdminAnnouncementListResponse {
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

export async function listAdminAnnouncements(
  params: ListAdminAnnouncementParams = {},
): Promise<AdminAnnouncementListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter((it) => it.title.toLowerCase().includes(needle));
    }
    if (params.isActive !== undefined) {
      filtered = filtered.filter((it) => it.isActive === params.isActive);
    }
    return delay(paginate(filtered, page, limit));
  }

  // BE 쿼리는 isActive 를 'true'/'false' 문자열로 받는다 (axios 가 boolean 을 그대로 직렬화).
  const { data } = await adminAxios.get<AdminAnnouncementListResponse>(
    '/admin/announcements',
    { params: { ...params, page, limit } },
  );
  return data;
}

export async function createAdminAnnouncement(
  payload: CreateAdminAnnouncementPayload,
): Promise<AdminAnnouncement> {
  if (ENV.useMockApi) {
    const now = new Date().toISOString();
    const created: AdminAnnouncement = {
      announceId: `ann-${Math.random().toString(36).slice(2, 8)}`,
      title: payload.title,
      content: payload.content,
      isActive: payload.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    };
    MOCK_STATE.unshift(created);
    return delay(created);
  }

  const { data } = await adminAxios.post<AdminAnnouncement>(
    '/admin/announcements',
    payload,
  );
  return data;
}

export async function updateAdminAnnouncement(
  announceId: string,
  payload: UpdateAdminAnnouncementPayload,
): Promise<AdminAnnouncement> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.announceId === announceId);
    const existing = MOCK_STATE[idx];
    if (idx < 0 || !existing) throw new Error(`Announcement not found: ${announceId}`);
    const updated: AdminAnnouncement = {
      ...existing,
      title: payload.title ?? existing.title,
      content: payload.content ?? existing.content,
      isActive: payload.isActive ?? existing.isActive,
      updatedAt: new Date().toISOString(),
    };
    MOCK_STATE[idx] = updated;
    return delay(updated);
  }

  const { data } = await adminAxios.patch<AdminAnnouncement>(
    `/admin/announcements/${announceId}`,
    payload,
  );
  return data;
}

export async function deleteAdminAnnouncement(announceId: string): Promise<void> {
  if (ENV.useMockApi) {
    const idx = MOCK_STATE.findIndex((it) => it.announceId === announceId);
    if (idx < 0) throw new Error(`Announcement not found: ${announceId}`);
    MOCK_STATE.splice(idx, 1);
    await delay(undefined);
    return;
  }

  await adminAxios.delete(`/admin/announcements/${announceId}`);
}
