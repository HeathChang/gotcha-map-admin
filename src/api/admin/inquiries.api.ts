import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminInquiry,
  AdminInquiryStats,
  AnswerInquiryPayload,
  ListAdminInquiryParams,
  Paginated,
} from '@/types/admin.types';
import { MOCK_INQUIRIES } from '@/api/admin/_mock/mockData';
import { delay, paginate } from '@/api/admin/_mock/mockHelpers';

const MOCK_STORE: AdminInquiry[] = MOCK_INQUIRIES.map((it) => ({ ...it }));

export async function listAdminInquiries(
  params: ListAdminInquiryParams = {},
): Promise<Paginated<AdminInquiry>> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STORE;
    if (params.status) {
      filtered = filtered.filter((it) => it.status === params.status);
    }
    if (params.q) {
      const needle = params.q.toLowerCase();
      filtered = filtered.filter(
        (it) =>
          it.title.toLowerCase().includes(needle) ||
          it.userEmail.toLowerCase().includes(needle),
      );
    }
    return delay(paginate(filtered, page, limit));
  }

  const { data } = await adminAxios.get<Paginated<AdminInquiry>>(
    '/admin/inquiries',
    { params: { ...params, page, limit } },
  );
  return data;
}

export async function getAdminInquiryStats(): Promise<AdminInquiryStats> {
  if (ENV.useMockApi) {
    const countByStatus = {
      pending: 0,
      processing: 0,
      completed: 0,
      rejected: 0,
    };
    for (const it of MOCK_STORE) countByStatus[it.status] += 1;

    const answered = MOCK_STORE.filter((it) => it.answeredAt !== null);
    const hoursList = answered
      .map((it) => {
        const created = new Date(it.createdAt).getTime();
        const ans = new Date(it.answeredAt as string).getTime();
        return (ans - created) / 3_600_000;
      })
      .sort((a, b) => a - b);
    const sampleSize = hoursList.length;
    const avgResponseHours =
      sampleSize > 0 ? hoursList.reduce((acc, v) => acc + v, 0) / sampleSize : null;
    const medianResponseHours =
      sampleSize > 0
        ? sampleSize % 2 === 1
          ? hoursList[(sampleSize - 1) / 2] ?? null
          : ((hoursList[sampleSize / 2 - 1] ?? 0) + (hoursList[sampleSize / 2] ?? 0)) / 2
        : null;

    const now = Date.now();
    const overdueCount = MOCK_STORE.filter(
      (it) =>
        (it.status === 'pending' || it.status === 'processing') &&
        now - new Date(it.createdAt).getTime() > 24 * 3_600_000,
    ).length;

    return delay({
      countByStatus,
      avgResponseHours,
      medianResponseHours,
      overdueCount,
      answeredSampleSize: sampleSize,
    });
  }

  const { data } = await adminAxios.get<AdminInquiryStats>(
    '/admin/inquiries/stats',
  );
  return data;
}

export async function answerAdminInquiry(
  inquiryId: string,
  payload: AnswerInquiryPayload,
): Promise<AdminInquiry> {
  if (ENV.useMockApi) {
    const target = MOCK_STORE.find((it) => it.inquiryId === inquiryId);
    if (!target) throw new Error(`Inquiry not found: ${inquiryId}`);
    target.status = payload.status;
    target.answer = payload.answer;
    target.answeredAt = new Date().toISOString();
    target.answeredByAdminId = 'admin-1';
    return delay({ ...target });
  }

  const { data } = await adminAxios.patch<AdminInquiry>(
    `/admin/inquiries/${inquiryId}`,
    payload,
  );
  return data;
}
