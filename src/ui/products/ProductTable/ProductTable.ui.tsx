'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Badge, Button, Text } from 'null_ong2-design-system';
import type { GenderTarget } from '@/types/product.types';
import type { ProductTableProps } from './ProductTable.types';

const GENDER_LABEL: Record<GenderTarget, string> = {
  ALL: '전체',
  M: '남',
  F: '여',
};

function priceLabel(min: number, max: number): string {
  if (min === max) return `${min.toLocaleString()}원`;
  return `${min.toLocaleString()} ~ ${max.toLocaleString()}원`;
}

export function ProductTable({
  products,
  onEdit,
  onDelete,
  selectedProductId,
}: ProductTableProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 제품이 없습니다.
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
            <th className="w-28 px-4 py-2">카테고리</th>
            <th className="w-36 px-4 py-2">가격</th>
            <th className="w-32 px-4 py-2">노출 플래그</th>
            <th className="w-20 px-4 py-2">성별</th>
            <th className="w-24 px-4 py-2">태그/이미지</th>
            <th className="w-32 px-4 py-2">수정일</th>
            <th className="w-32 px-4 py-2 text-right">액션</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => {
            const isSelected = selectedProductId === p.productId;
            return (
              <tr
                key={p.productId}
                className={clsx(
                  'border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {p.productName}
                  </Text>
                  {p.productManufacturer ? (
                    <Text size="xs" color="muted" truncate>
                      {p.productManufacturer}
                    </Text>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    {p.category ?? '—'}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm">{priceLabel(p.minPrice, p.maxPrice)}</Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {p.isNew ? <Badge variant="info" size="sm">신상</Badge> : null}
                    {p.isPopular ? <Badge variant="success" size="sm">인기</Badge> : null}
                    {!p.isNew && !p.isPopular ? (
                      <Text size="xs" color="muted">—</Text>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    {GENDER_LABEL[p.genderTarget]}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="xs" color="muted">
                    태그 {p.tagCount} · 이미지 {p.imageCount}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(p.updatedAt).format('YYYY-MM-DD')}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onEdit(p)}>
                      수정
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => onDelete(p)}>
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
