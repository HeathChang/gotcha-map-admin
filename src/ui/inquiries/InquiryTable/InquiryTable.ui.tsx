'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Text } from 'null_ong2-design-system';
import { InquiryStatusBadge } from '@/ui/inquiries/InquiryStatusBadge/InquiryStatusBadge.ui';
import type { InquiryTableProps } from './InquiryTable.types';

export function InquiryTable({
  inquiries,
  onSelect,
  selectedInquiryId,
}: InquiryTableProps) {
  if (inquiries.length === 0) {
    return (
      <div className="rounded-md border border-admin-border bg-admin-surface p-8 text-center">
        <Text size="sm" color="muted">
          조건에 맞는 문의가 없습니다.
        </Text>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-md border border-admin-border bg-admin-surface">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-admin-border bg-gray-50 text-xs text-gray-500">
          <tr>
            <th className="w-24 px-4 py-2">상태</th>
            <th className="px-4 py-2">제목</th>
            <th className="w-48 px-4 py-2">요청자</th>
            <th className="w-40 px-4 py-2">접수일</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            const isSelected = selectedInquiryId === inquiry.inquiryId;
            return (
              <tr
                key={inquiry.inquiryId}
                onClick={() => onSelect(inquiry)}
                className={clsx(
                  'cursor-pointer border-b border-admin-border last:border-b-0',
                  isSelected ? 'bg-admin-accent/5' : 'hover:bg-gray-50',
                )}
              >
                <td className="px-4 py-3">
                  <InquiryStatusBadge status={inquiry.status} />
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" weight="medium" truncate>
                    {inquiry.title}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {inquiry.userEmail}
                  </Text>
                </td>
                <td className="px-4 py-3">
                  <Text size="sm" color="muted">
                    {dayjs(inquiry.createdAt).format('YYYY-MM-DD HH:mm')}
                  </Text>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
