import type { AdminTag } from '@/types/tag.types';

export interface TagTableProps {
  tags: ReadonlyArray<AdminTag>;
  onEdit: (tag: AdminTag) => void;
  onDelete: (tag: AdminTag) => void;
  selectedTagId: string | null;
}
