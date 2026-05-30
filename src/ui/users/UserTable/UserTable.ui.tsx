'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Button, Text } from 'null_ong2-design-system';
import { UserStatusBadge } from '@/ui/users/UserStatusBadge/UserStatusBadge.ui';
import type { UserTableProps } from './UserTable.types';

const GENDER_LABEL: Record<'M' | 'F', string> = { M: '남', F: '여' };

export function UserTable({ users, onChangeStatus, selectedUserId }: UserTableProps) {
  if (users.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 회원이 없습니다.
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
            <th className="px-4 py-2">닉네임</th>
            <th className="w-16 px-4 py-2">성별</th>
            <th className="w-20 px-4 py-2">상태</th>
            <th className="w-32 px-4 py-2">가입일</th>
            <th className="w-28 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => {
            const isSelected = selectedUserId === user.userId;
            return (
              <tr
                key={user.userId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" truncate>
                    {user.email}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {user.nickname}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    {user.gender ? GENDER_LABEL[user.gender] : '—'}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <UserStatusBadge status={user.userStatus} />
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(user.createdAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end">
                    <Button variant="ghost" size="sm" onClick={() => onChangeStatus(user)}>
                      상태 변경
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
