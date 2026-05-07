import type { InquiryStatus } from '@/types/admin.types';

type BadgeVariant = 'neutral' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

export const INQUIRY_STATUS_LABEL_MAP: Record<InquiryStatus, string> = {
  pending: '대기',
  processing: '처리중',
  completed: '완료',
  rejected: '반려',
};

export const INQUIRY_STATUS_VARIANT_MAP: Record<InquiryStatus, BadgeVariant> = {
  pending: 'warning',
  processing: 'info',
  completed: 'success',
  rejected: 'danger',
};

export const INQUIRY_STATUS_OPTIONS: ReadonlyArray<{
  value: InquiryStatus;
  label: string;
}> = [
  { value: 'pending', label: '대기' },
  { value: 'processing', label: '처리중' },
  { value: 'completed', label: '완료' },
  { value: 'rejected', label: '반려' },
];
