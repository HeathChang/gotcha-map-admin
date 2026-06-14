export interface AdminBanner {
  bannerId: string;
  title: string | null;
  imageUrl: string;
  linkUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminBannerParams {
  q?: string;
  // 미지정: 전체 / true: 활성만 / false: 비활성만.
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateAdminBannerPayload {
  imageUrl: string;
  title?: string;
  linkUrl?: string;
  sortOrder?: number;
  isActive?: boolean;
}

// PATCH 라 모든 필드 optional (BE adminUpdateBannerSchema 동일).
export type UpdateAdminBannerPayload = Partial<CreateAdminBannerPayload>;

export interface AdminBannerListResponse {
  items: AdminBanner[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
