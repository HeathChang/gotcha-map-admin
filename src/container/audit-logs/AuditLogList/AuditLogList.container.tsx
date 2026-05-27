'use client';

import dayjs from 'dayjs';
import { Heading, Modal, Select, Stack, Text } from 'null_ong2-design-system';
import { AuditLogTable } from '@/ui/audit-logs/AuditLogTable/AuditLogTable.ui';
import {
  AUDIT_ACTION_OPTIONS,
  AUDIT_TARGET_TYPE_OPTIONS,
  actionLabel,
} from '@/ui/audit-logs/auditLog.constants';
import { ListStateView } from '@/ui/common/ListStateView/ListStateView.ui';
import { Pagination } from '@/ui/common/Pagination/Pagination.ui';
import { useAuditLogList } from './useAuditLogList';

export function AuditLogListContainer() {
  const {
    logs,
    isLoading,
    errorMessage,
    targetType,
    setTargetType,
    action,
    setAction,
    page,
    pageSize,
    total,
    setPage,
    selected,
    viewDiff,
    closeDiff,
  } = useAuditLogList();

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h1" size="lg">
          감사 로그
        </Heading>
        <Text size="sm" color="muted">
          운영자의 모든 쓰기 작업 기록입니다. 읽기 전용이며 super_admin 만 조회할 수 있습니다.
        </Text>
      </Stack>

      <div className="flex flex-wrap items-end gap-3">
        <div className="w-44">
          <Select
            options={AUDIT_TARGET_TYPE_OPTIONS as Array<{ value: string; label: string }>}
            value={targetType}
            onChange={(e) => setTargetType(e.target.value)}
          />
        </div>
        <div className="w-44">
          <Select
            options={AUDIT_ACTION_OPTIONS as Array<{ value: string; label: string }>}
            value={action}
            onChange={(e) => setAction(e.target.value)}
          />
        </div>
      </div>

      <ListStateView
        isLoading={isLoading}
        errorMessage={errorMessage}
        errorTitle="감사 로그를 불러오지 못했습니다"
      >
        <AuditLogTable
          logs={logs}
          onViewDiff={viewDiff}
          selectedAuditId={selected?.auditId ?? null}
        />

        <Pagination page={page} pageSize={pageSize} total={total} onPageChange={setPage} />
      </ListStateView>

      <Modal
        isOpen={selected !== null}
        onClose={closeDiff}
        title="변경 내역 (diff)"
        size="lg"
      >
        {selected ? (
          <Stack spacing="md">
            <Stack spacing="1">
              <Text size="sm" weight="medium">
                {actionLabel(selected.action)} · {selected.targetType}:{selected.targetId}
              </Text>
              <Text size="xs" color="muted">
                {selected.adminEmail ?? selected.adminId} ·{' '}
                {dayjs(selected.createdAt).format('YYYY-MM-DD HH:mm:ss')}
                {selected.ip ? ` · ${selected.ip}` : ''}
              </Text>
            </Stack>
            <pre className="max-h-[50vh] overflow-auto rounded-md border border-admin-border bg-gray-50 p-4 text-xs leading-relaxed">
              {JSON.stringify(selected.diff, null, 2)}
            </pre>
          </Stack>
        ) : null}
      </Modal>
    </Stack>
  );
}
