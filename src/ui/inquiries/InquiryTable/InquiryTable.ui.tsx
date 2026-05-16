'use client';

import dayjs from 'dayjs';
import clsx from 'clsx';
import { Text } from 'null_ong2-design-system';
import { InquiryStatusBadge } from '@/ui/inquiries/InquiryStatusBadge/InquiryStatusBadge.ui';
import type { AdminInquiry } from '@/types/admin.types';
import type { InquiryTableProps } from './InquiryTable.types';

const SLA_HOURS = 24;

interface ElapsedDescriptor {
  label: string;
  /** SLA(24h) 초과 미답변 — 운영팀이 가장 먼저 봐야 한다. */
  overdue: boolean;
}

function describeElapsed(inquiry: AdminInquiry): ElapsedDescriptor {
  // 답변 완료/반려는 응답 시간(접수 → 답변)이 SLA 의미 있는 값.
  // 미답변(pending/processing) 은 현재까지 경과 시간이 SLA 위반 여부 신호.
  const created = dayjs(inquiry.createdAt);
  const ended =
    inquiry.answeredAt && (inquiry.status === 'completed' || inquiry.status === 'rejected')
      ? dayjs(inquiry.answeredAt)
      : dayjs();
  const diffH = ended.diff(created, 'hour', true);
  const isAnswered = inquiry.status === 'completed' || inquiry.status === 'rejected';

  const label =
    diffH < 1
      ? `${Math.max(0, Math.round(diffH * 60))}분`
      : diffH < 48
        ? `${diffH.toFixed(1)}시간`
        : `${Math.floor(diffH / 24)}일`;

  return {
    label: isAnswered ? `${label} 만에 답변` : `${label} 경과`,
    overdue: !isAnswered && diffH >= SLA_HOURS,
  };
}

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
            <th className="w-40 px-4 py-2">경과/응답</th>
          </tr>
        </thead>
        <tbody>
          {inquiries.map((inquiry) => {
            const isSelected = selectedInquiryId === inquiry.inquiryId;
            const elapsed = describeElapsed(inquiry);
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
                <td className="px-4 py-3">
                  <Text
                    size="sm"
                    color={elapsed.overdue ? 'danger' : 'muted'}
                    weight={elapsed.overdue ? 'medium' : undefined}
                  >
                    {elapsed.overdue ? '⚠ ' : ''}
                    {elapsed.label}
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
