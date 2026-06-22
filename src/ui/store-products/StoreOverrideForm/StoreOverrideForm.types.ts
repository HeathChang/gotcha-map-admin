import type { AdminStoreOverride } from '@/types/storeProduct.types';

export interface StoreOverrideFormValues {
  // 빈 문자열 = 매장 전용 신규 제품(null). 채우면 글로벌 제품 덮어쓰기.
  productId: string;
  productName: string;
  productInfo: string;
  imageUrl: string;
  price: number;
  // 빈 문자열 = 무제한(null).
  stock: string;
}

export interface StoreOverrideFormProps {
  // null: 신규 등록 / AdminStoreOverride: 수정.
  initial: AdminStoreOverride | null;
  onSubmit: (values: StoreOverrideFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
