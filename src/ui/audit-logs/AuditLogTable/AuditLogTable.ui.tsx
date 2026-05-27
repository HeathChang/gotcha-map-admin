'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Badge, Button, Text } from 'null_ong2-design-system';
import type { AuditLogTableProps } from './AuditLogTable.types';
import { actionLabel, actionVariant } from '../auditLog.constants';

export function AuditLogTable({ logs, onViewDiff, selectedAuditId }: AuditLogTableProps) {
  if (logs.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 감사 로그가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="w-40 px-4 py-2">시각</th>
            <th className="px-4 py-2">운영자</th>
            <th className="w-32 px-4 py-2">액션</th>
            <th className="px-4 py-2">대상</th>
            <th className="w-28 px-4 py-2">IP</th>
            <th className="w-20 px-4 py-2 text-right">변경</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => {
            const isSelected = selectedAuditId === log.auditId;
            return (
              <tr
                key={log.auditId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    {dayjs(log.createdAt).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {log.adminName ?? '—'}
                  </Text>
                  <Text size="xs" color="muted" truncate>
                    {log.adminEmail ?? log.adminId}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={actionVariant(log.action)} size="sm">
                    {actionLabel(log.action)}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm">{log.targetType}</Text>
                  <Text size="xs" color="muted" truncate>
                    {log.targetId}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    {log.ip ?? '—'}
                  </Text>
                </td>
                <td className="px-4 py-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDiff(log)}
                    disabled={log.diff === null || log.diff === undefined}
                  >
                    보기
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
