'use client';

import dayjs from 'dayjs';
import { Badge, Button, Switch, Text } from 'null_ong2-design-system';
import type { AdminRole } from '@/types/admin.types';
import type { AdminUserTableProps } from './AdminUserTable.types';

const ROLE_LABEL: Record<AdminRole, string> = {
  admin: '관리자',
  staff: '운영',
  member: '점주',
};

const ROLE_BADGE: Record<AdminRole, 'primary' | 'info' | 'neutral'> = {
  admin: 'primary',
  staff: 'info',
  member: 'neutral',
};

export function AdminUserTable({
  admins,
  onToggleStatus,
  onResetPassword,
  pendingStatusId,
}: AdminUserTableProps) {
  if (admins.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 운영자가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-2">이메일</th>
            <th className="px-4 py-2">이름</th>
            <th className="w-20 px-4 py-2">역할</th>
            <th className="px-4 py-2">담당 매장</th>
            <th className="w-24 px-4 py-2">활성</th>
            <th className="w-32 px-4 py-2">생성일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => {
            const isActive = admin.status === 1;
            return (
              <tr
                key={admin.adminId}
                className="border-b border-admin-border last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <Text size="sm" truncate>
                    {admin.email}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {admin.name}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Badge variant={ROLE_BADGE[admin.role]} size="sm">
                    {ROLE_LABEL[admin.role]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted" truncate>
                    {admin.storeName ?? '—'}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    checked={isActive}
                    disabled={pendingStatusId === admin.adminId}
                    onChange={() => onToggleStatus(admin)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(admin.createdAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onResetPassword(admin)}
                    >
                      비밀번호 재설정
                    </Button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
