'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Button, Text } from 'null_ong2-design-system';
import type { StoreTableProps } from './StoreTable.types';

export function StoreTable({ stores, onEdit, onDelete, selectedStoreId }: StoreTableProps) {
  if (stores.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 매장이 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-2">이름</th>
            <th className="px-4 py-2">주소</th>
            <th className="w-28 px-4 py-2">위경도</th>
            <th className="w-20 px-4 py-2">평점</th>
            <th className="w-32 px-4 py-2">수정일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((store) => {
            const isSelected = selectedStoreId === store.storeId;
            return (
              <tr
                key={store.storeId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {store.name}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted" truncate>
                    {store.address}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    {store.lat.toFixed(4)}, {store.lon.toFixed(4)}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm">{store.rating.toFixed(1)}</Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(store.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(store)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(store)}>
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
