import type { AdminInquiry } from '@/types/admin.types';

export interface InquiryTableProps {
  inquiries: ReadonlyArray<AdminInquiry>;
  onSelect: (inquiry: AdminInquiry) => void;
  selectedInquiryId: string | null;
}
