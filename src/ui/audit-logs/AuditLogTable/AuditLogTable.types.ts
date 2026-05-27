import type { AdminAuditLog } from '@/types/auditLog.types';

export interface AuditLogTableProps {
  logs: ReadonlyArray<AdminAuditLog>;
  onViewDiff: (log: AdminAuditLog) => void;
  selectedAuditId: string | null;
}
