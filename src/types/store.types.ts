export interface AdminStore {
  storeId: string;
  name: string;
  address: string;
  lat: number;
  lon: number;
  phone: string | null;
  description: string | null;
  imageUrl: string | null;
  openingHours: string | null;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminStoreParams {
  q?: string;
  page?: number;
  limit?: number;
}

export interface CreateAdminStorePayload {
  name: string;
  address: string;
  lat: number;
  lon: number;
  phone?: string | null;
  description?: string | null;
  imageUrl?: string | null;
  openingHours?: string | null;
  rating?: number;
}

// PATCH 라 모든 필드 optional. lat/lon 은 짝으로 보내야 한다 (BE 스키마 동일 제약).
export type UpdateAdminStorePayload = Partial<CreateAdminStorePayload>;

// BE 가 `pagination` 객체로 감싸 응답하므로 별도 응답 타입을 둔다.
export interface AdminStoreListResponse {
  items: AdminStore[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
