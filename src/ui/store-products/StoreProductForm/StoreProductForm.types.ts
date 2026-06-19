import type { AdminStoreProduct } from '@/types/storeProduct.types';

export interface StoreProductFormValues {
  // 신규 등록 시에만 사용 (수정 시 제품은 고정).
  productId: string;
  // 빈 문자열 = 입력 전. 폼 스키마에서 숫자로 강제 변환한다.
  price: number;
  // 빈 문자열 = 무제한(null) 으로 변환.
  stock: string;
}

export interface StoreProductOption {
  productId: string;
  productName: string;
}

export interface StoreProductFormProps {
  // null: 신규 등록 / AdminStoreProduct: 수정.
  initial: AdminStoreProduct | null;
  // 신규 등록용 제품 선택지 (글로벌 카탈로그).
  productOptions: ReadonlyArray<StoreProductOption>;
  onSubmit: (values: StoreProductFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
