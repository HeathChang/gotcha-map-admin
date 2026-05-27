export interface AdminAnnouncement {
  announceId: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminAnnouncementParams {
  q?: string;
  // 미지정: 전체 / true: 활성만 / false: 비활성만.
  isActive?: boolean;
  page?: number;
  limit?: number;
}

export interface CreateAdminAnnouncementPayload {
  title: string;
  content: string;
  isActive?: boolean;
}

// PATCH 라 모든 필드 optional (BE adminUpdateAnnouncementSchema 동일).
export type UpdateAdminAnnouncementPayload = Partial<CreateAdminAnnouncementPayload>;

export interface AdminAnnouncementListResponse {
  items: AdminAnnouncement[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
