import type { AdminProductDetail, GenderTarget } from '@/types/product.types';

export interface ProductFormValues {
  productName: string;
  productManufacturer: string;
  category: string;
  productInfo: string;
  minPrice: number;
  maxPrice: number;
  imageUrl: string;
  isNew: boolean;
  isPopular: boolean;
  genderTarget: GenderTarget;
  // useFieldArray 가 객체 배열을 요구하므로 url 을 감싼다.
  images: Array<{ url: string }>;
  tagIds: string[];
}

export interface TagOption {
  tagId: string;
  name: string;
  relationType: string | null;
}

export interface ProductFormProps {
  // null: 신규 / AdminProductDetail: 수정.
  initial: AdminProductDetail | null;
  /** 태그 multi-select 옵션 (container 가 미리 로드해 주입). */
  tagOptions: ReadonlyArray<TagOption>;
  onSubmit: (values: ProductFormValues) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}
