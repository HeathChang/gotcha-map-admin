import type { AdminStoreProduct } from '@/types/storeProduct.types';

export interface StoreProductTableProps {
  products: ReadonlyArray<AdminStoreProduct>;
  onEdit: (product: AdminStoreProduct) => void;
  onDelete: (product: AdminStoreProduct) => void;
  selectedId: string | null;
}
