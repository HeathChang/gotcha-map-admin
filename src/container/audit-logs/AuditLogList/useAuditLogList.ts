'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { listAdminAuditLogs } from '@/api/admin/auditLogs.api';
import type { AdminAuditLog } from '@/types/auditLog.types';
import { AdminApiError } from '@/lib/axios/adminAxios';
import { usePaginatedSearch } from '@/lib/hooks/usePaginatedSearch';

const QUERY_KEY = ['admin', 'audit-logs'] as const;
const PAGE_SIZE = 20;

interface UseAuditLogListResult {
  logs: ReadonlyArray<AdminAuditLog>;
  isLoading: boolean;
  errorMessage: string | null;

  // 'all' 은 미필터 sentinel.
  targetType: string;
  setTargetType: (next: string) => void;
  action: string;
  setAction: (next: string) => void;

  page: number;
  pageSize: number;
  total: number;
  setPage: (next: number) => void;

  selected: AdminAuditLog | null;
  viewDiff: (log: AdminAuditLog) => void;
  closeDiff: () => void;
}

export function useAuditLogList(): UseAuditLogListResult {
  const [targetType, setTargetType] = useState('all');
  const [action, setAction] = useState('all');
  const [selected, setSelected] = useState<AdminAuditLog | null>(null);

  // 감사 로그는 검색어 없이 필터만 쓰므로 page 리셋 트리거에 필터를 건다.
  const { page, setPage } = usePaginatedSearch({
    resetPageDeps: [targetType, action],
  });

  const serverTargetType = targetType === 'all' ? undefined : targetType;
  const serverAction = action === 'all' ? undefined : action;

  const query = useQuery({
    queryKey: [
      ...QUERY_KEY,
      { targetType: serverTargetType, action: serverAction, page },
    ] as const,
    queryFn: () =>
      listAdminAuditLogs({
        targetType: serverTargetType,
        action: serverAction,
        page,
        limit: PAGE_SIZE,
      }),
  });

  return {
    logs: query.data?.items ?? [],
    isLoading: query.isLoading,
    errorMessage: query.error instanceof AdminApiError ? query.error.message : null,

    targetType,
    setTargetType,
    action,
    setAction,

    page,
    pageSize: PAGE_SIZE,
    total: query.data?.pagination.total ?? 0,
    setPage,

    selected,
    viewDiff: setSelected,
    closeDiff: () => setSelected(null),
  };
}
