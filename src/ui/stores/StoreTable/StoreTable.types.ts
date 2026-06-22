import type { AdminStore } from '@/types/store.types';

export interface StoreTableProps {
  stores: ReadonlyArray<AdminStore>;
  onEdit: (store: AdminStore) => void;
  onDelete: (store: AdminStore) => void;
  // 매장 상세(상품·가격) 화면으로 이동.
  onManageProducts: (store: AdminStore) => void;
  selectedStoreId: string | null;
}
