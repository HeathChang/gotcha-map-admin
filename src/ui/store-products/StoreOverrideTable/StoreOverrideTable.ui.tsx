'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Badge, Button, Text } from 'null_ong2-design-system';
import type { StoreOverrideTableProps } from './StoreOverrideTable.types';

export function StoreOverrideTable({
  overrides,
  onEdit,
  onDelete,
  selectedId,
}: StoreOverrideTableProps) {
  if (overrides.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          카탈로그 오버라이드가 없습니다. 매장 전용 제품이나 정보 덮어쓰기를 추가하세요.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-2">제품명</th>
            <th className="w-24 px-4 py-2">구분</th>
            <th className="w-28 px-4 py-2 text-right">가격</th>
            <th className="w-24 px-4 py-2 text-right">재고</th>
            <th className="w-32 px-4 py-2">수정일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {overrides.map((override) => {
            const isSelected = selectedId === override.overrideId;
            const isLocal = override.productId === null;
            return (
              <tr
                key={override.overrideId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {override.productName}
                  </Text>
                  {override.productInfo ? (
                    <Text size="xs" color="muted" truncate>
                      {override.productInfo}
                    </Text>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  {isLocal ? (
                    <Badge variant="info" size="sm">
                      매장 전용
                    </Badge>
                  ) : (
                    <Badge variant="neutral" size="sm">
                      덮어쓰기
                    </Badge>
                  )}
                </td>
                <td className="px-4 py-3 text-right">
                  <Text size="sm">{override.price.toLocaleString()}원</Text>
                </td>
                <td className="px-4 py-3 text-right">
                  {override.stock === null ? (
                    <Badge variant="neutral" size="sm">
                      무제한
                    </Badge>
                  ) : (
                    <Text size="sm">{override.stock.toLocaleString()}</Text>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(override.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(override)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(override)}>
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
