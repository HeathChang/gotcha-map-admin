import type { AdminAnnouncement } from '@/types/announcement.types';

export interface AnnouncementFormValues {
  title: string;
  content: string;
  isActive: boolean;
}

export interface AnnouncementFormProps {
  // null: 신규 생성 / AdminAnnouncement: 수정.
  initial: AdminAnnouncement | null;
  onSubmit: (values: AnnouncementFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
