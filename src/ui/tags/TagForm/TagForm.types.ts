import type { AdminTag } from '@/types/tag.types';

export interface TagFormValues {
  name: string;
  relationType: string;
}

export interface TagFormProps {
  // null: 신규 생성 / AdminTag: 수정.
  initial: AdminTag | null;
  onSubmit: (values: TagFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
