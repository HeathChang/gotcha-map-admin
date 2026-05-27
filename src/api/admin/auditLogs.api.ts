import { adminAxios } from '@/lib/axios/adminAxios';
import { ENV } from '@/lib/env';
import type {
  AdminAuditLog,
  AdminAuditLogListResponse,
  ListAdminAuditLogParams,
} from '@/types/auditLog.types';
import { MOCK_AUDIT_LOGS } from '@/api/admin/_mock/auditLogMockData';
import { delay } from '@/api/admin/_mock/mockHelpers';

// 감사 로그는 읽기 전용이라 mock 상태 변형이 없다.
const MOCK_STATE: AdminAuditLog[] = MOCK_AUDIT_LOGS.map((it) => ({ ...it }));

function paginate(
  list: AdminAuditLog[],
  page: number,
  limit: number,
): AdminAuditLogListResponse {
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

export async function listAdminAuditLogs(
  params: ListAdminAuditLogParams = {},
): Promise<AdminAuditLogListResponse> {
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  if (ENV.useMockApi) {
    let filtered = MOCK_STATE;
    if (params.targetType) {
      filtered = filtered.filter((it) => it.targetType === params.targetType);
    }
    if (params.action) {
      filtered = filtered.filter((it) => it.action === params.action);
    }
    return delay(paginate(filtered, page, limit));
  }

  const { data } = await adminAxios.get<AdminAuditLogListResponse>(
    '/admin/audit-logs',
    { params: { ...params, page, limit } },
  );
  return data;
}
