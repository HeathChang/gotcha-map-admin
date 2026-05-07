import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminInquiry,
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
    const filtered = params.status
      ? MOCK_STORE.filter((it) => it.status === params.status)
      : MOCK_STORE;
    return delay(paginate(filtered, page, limit));
  }

  const { data } = await adminAxios.get<Paginated<AdminInquiry>>(
    '/admin/inquiries',
    { params: { ...params, page, limit } },
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
