'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Button, Switch, Text } from 'null_ong2-design-system';
import type { AnnouncementTableProps } from './AnnouncementTable.types';

export function AnnouncementTable({
  announcements,
  onEdit,
  onDelete,
  onToggleActive,
  selectedAnnounceId,
  togglingId,
}: AnnouncementTableProps) {
  if (announcements.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 공지가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-2">제목</th>
            <th className="w-28 px-4 py-2">활성</th>
            <th className="w-32 px-4 py-2">수정일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map((ann) => {
            const isSelected = selectedAnnounceId === ann.announceId;
            return (
              <tr
                key={ann.announceId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {ann.title}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    size="sm"
                    checked={ann.isActive}
                    disabled={togglingId === ann.announceId}
                    onChange={() => onToggleActive(ann)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(ann.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(ann)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(ann)}>
                      삭제
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
