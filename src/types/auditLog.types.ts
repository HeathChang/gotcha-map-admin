export interface AdminAuditLog {
  auditId: string;
  adminId: string;
  adminEmail: string | null;
  adminName: string | null;
  action: string;
  targetType: string;
  targetId: string;
  // { before?, after? } 형태이지만 action 마다 달라 unknown 으로 둔다.
  diff: unknown;
  ip: string | null;
  userAgent: string | null;
  createdAt: string;
}

export interface ListAdminAuditLogParams {
  targetType?: string;
  action?: string;
  page?: number;
  limit?: number;
}

export interface AdminAuditLogListResponse {
  items: AdminAuditLog[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
