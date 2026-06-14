import type { AdminBanner } from '@/types/banner.types';

export interface BannerFormValues {
  imageUrl: string;
  title: string;
  linkUrl: string;
  sortOrder: number;
  isActive: boolean;
}

export interface BannerFormProps {
  // null: 신규 생성 / AdminBanner: 수정.
  initial: AdminBanner | null;
  onSubmit: (values: BannerFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
