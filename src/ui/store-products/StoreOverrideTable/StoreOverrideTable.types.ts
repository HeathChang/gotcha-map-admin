import type { AdminStoreOverride } from '@/types/storeProduct.types';

export interface StoreOverrideTableProps {
  overrides: ReadonlyArray<AdminStoreOverride>;
  onEdit: (override: AdminStoreOverride) => void;
  onDelete: (override: AdminStoreOverride) => void;
  selectedId: string | null;
}
