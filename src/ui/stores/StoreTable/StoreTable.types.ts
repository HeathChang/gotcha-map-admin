import type { AdminStore } from '@/types/store.types';

export interface StoreTableProps {
  stores: ReadonlyArray<AdminStore>;
  onEdit: (store: AdminStore) => void;
  onDelete: (store: AdminStore) => void;
  selectedStoreId: string | null;
}
