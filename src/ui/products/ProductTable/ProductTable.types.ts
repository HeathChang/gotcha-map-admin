import type { AdminProductListItem } from '@/types/product.types';

export interface ProductTableProps {
  products: ReadonlyArray<AdminProductListItem>;
  onEdit: (product: AdminProductListItem) => void;
  onDelete: (product: AdminProductListItem) => void;
  selectedProductId: string | null;
}
