export type GenderTarget = 'M' | 'F' | 'ALL';

/** 목록 응답 항목 — 갤러리/태그는 detail 에서. tagCount/imageCount 만 노출. */
export interface AdminProductListItem {
  productId: string;
  productName: string;
  productManufacturer: string | null;
  productInfo: string | null;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  imageUrl: string | null;
  viewCount: number;
  isNew: boolean;
  isPopular: boolean;
  genderTarget: GenderTarget;
  tagCount: number;
  imageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AdminProductTag {
  tagId: string;
  name: string;
  relationType: string | null;
}

/** 상세 응답 — 폼 채우기에 필요한 풀 정보. */
export interface AdminProductDetail {
  productId: string;
  productName: string;
  productManufacturer: string | null;
  productInfo: string | null;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  imageUrl: string | null;
  viewCount: number;
  isNew: boolean;
  isPopular: boolean;
  genderTarget: GenderTarget;
  images: string[];
  tags: AdminProductTag[];
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminProductParams {
  q?: string;
  category?: string;
  isNew?: boolean;
  isPopular?: boolean;
  genderTarget?: GenderTarget;
  page?: number;
  limit?: number;
}

export interface CreateAdminProductPayload {
  productName: string;
  productManufacturer?: string | null;
  productInfo?: string | null;
  category?: string | null;
  minPrice: number;
  maxPrice: number;
  imageUrl?: string | null;
  isNew?: boolean;
  isPopular?: boolean;
  genderTarget?: GenderTarget;
  images?: string[];
  tagIds?: string[];
}

export type UpdateAdminProductPayload = Partial<CreateAdminProductPayload>;

export interface AdminProductListResponse {
  items: AdminProductListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
