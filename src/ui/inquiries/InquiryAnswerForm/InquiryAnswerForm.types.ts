import type { AdminInquiry, InquiryStatus } from '@/types/admin.types';

export interface InquiryAnswerFormValues {
  status: InquiryStatus;
  answer: string;
}

export interface InquiryAnswerFormProps {
  inquiry: AdminInquiry;
  onSubmit: (values: InquiryAnswerFormValues) => void;
  isSubmitting: boolean;
}
