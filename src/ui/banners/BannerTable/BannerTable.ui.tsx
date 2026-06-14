'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Button, Switch, Text } from 'null_ong2-design-system';
import { resolveAdminImageUrl } from '@/lib/imageUrl';
import type { BannerTableProps } from './BannerTable.types';

export function BannerTable({
  banners,
  onEdit,
  onDelete,
  onToggleActive,
  selectedBannerId,
  togglingId,
}: BannerTableProps) {
  if (banners.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 배너가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="w-28 px-4 py-2">미리보기</th>
            <th className="px-4 py-2">제목</th>
            <th className="w-16 px-4 py-2">순서</th>
            <th className="w-28 px-4 py-2">활성</th>
            <th className="w-32 px-4 py-2">수정일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {banners.map((banner) => {
            const isSelected = selectedBannerId === banner.bannerId;
            const preview = resolveAdminImageUrl(banner.imageUrl);
            return (
              <tr
                key={banner.bannerId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  {preview ? (
                    <img
                      src={preview}
                      alt={banner.title ?? '배너'}
                      className="h-10 w-20 rounded border border-admin-border object-cover"
                    />
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {banner.title || '(제목 없음)'}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {banner.sortOrder}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Switch
                    size="sm"
                    checked={banner.isActive}
                    disabled={togglingId === banner.bannerId}
                    onChange={() => onToggleActive(banner)}
                  />
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(banner.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(banner)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(banner)}>
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
