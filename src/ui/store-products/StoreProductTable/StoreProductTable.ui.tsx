'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Badge, Button, Text } from 'null_ong2-design-system';
import type { StoreProductTableProps } from './StoreProductTable.types';

export function StoreProductTable({
  products,
  onEdit,
  onDelete,
  selectedId,
}: StoreProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          등록된 가격·재고가 없습니다. 우측 상단에서 제품을 추가하세요.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="px-4 py-2">제품</th>
            <th className="w-28 px-4 py-2 text-right">가격</th>
            <th className="w-24 px-4 py-2 text-right">재고</th>
            <th className="w-32 px-4 py-2">수정일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const isSelected = selectedId === product.id;
            return (
              <tr
                key={product.id}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {product.productName}
                  </Text>
                </td>
                <td className="px-4 py-3 text-right">
                  <Text size="sm">{product.price.toLocaleString()}원</Text>
                </td>
                <td className="px-4 py-3 text-right">
                  {product.stock === null ? (
                    <Badge variant="neutral" size="sm">
                      무제한
                    </Badge>
                  ) : (
                    <Text size="sm">{product.stock.toLocaleString()}</Text>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(product.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(product)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(product)}>
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
