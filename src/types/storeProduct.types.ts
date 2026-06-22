// 매장별 가격/재고 (store_products) — BE adminStoreProduct* 스키마와 1:1.
export interface AdminStoreProduct {
  id: string;
  storeId: string;
  productId: string;
  productName: string;
  productImageUrl: string | null;
  price: number;
  stock: number | null;
  createdAt: string;
  updatedAt: string;
}

// BE 가 { items } 형태로 감싸 응답한다 (pagination 없음).
export interface AdminStoreProductListResponse {
  items: AdminStoreProduct[];
}

export interface CreateStoreProductPayload {
  productId: string;
  price: number;
  stock?: number | null;
}

// PATCH 라 모든 필드 optional.
export interface UpdateStoreProductPayload {
  price?: number;
  stock?: number | null;
}

// 매장별 카탈로그 오버라이드 (store_product_overrides).
// productId null = 글로벌 카탈로그에 없는 매장 전용 신규 제품.
export interface AdminStoreOverride {
  overrideId: string;
  storeId: string;
  productId: string | null;
  productName: string;
  productInfo: string | null;
  imageUrl: string | null;
  price: number;
  stock: number | null;
  createdByAdminId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface AdminStoreOverrideListResponse {
  items: AdminStoreOverride[];
}

export interface CreateStoreOverridePayload {
  productId?: string | null;
  productName: string;
  productInfo?: string | null;
  imageUrl?: string | null;
  price?: number;
  stock?: number | null;
}

// PATCH 라 모든 필드 optional (productName 포함).
export type UpdateStoreOverridePayload = Partial<CreateStoreOverridePayload>;
