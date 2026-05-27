'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Badge, Button, Text } from 'null_ong2-design-system';
import type { TagTableProps } from './TagTable.types';

export function TagTable({ tags, onEdit, onDelete, selectedTagId }: TagTableProps) {
  if (tags.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 태그가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-2">태그명</th>
            <th className="w-40 px-4 py-2">분류</th>
            <th className="w-32 px-4 py-2">생성일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {tags.map((tag) => {
            const isSelected = selectedTagId === tag.tagId;
            return (
              <tr
                key={tag.tagId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {tag.name}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  {tag.relationType ? (
                    <Badge variant="neutral" size="sm">
                      {tag.relationType}
                    </Badge>
                  ) : (
                    <Text size="xs" color="muted">
                      —
                    </Text>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(tag.createdAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(tag)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(tag)}>
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
