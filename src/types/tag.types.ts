export interface AdminTag {
  tagId: string;
  name: string;
  relationType: string | null;
  createdAt: string;
}

export interface ListAdminTagParams {
  q?: string;
  relationType?: string;
  page?: number;
  limit?: number;
}

export interface CreateAdminTagPayload {
  name: string;
  relationType?: string | null;
}

// PATCH 라 모든 필드 optional (BE adminUpdateTagSchema 동일).
export type UpdateAdminTagPayload = Partial<CreateAdminTagPayload>;

// BE 가 `pagination` 객체로 감싸 응답한다 (stores 와 동일 envelope).
export interface AdminTagListResponse {
  items: AdminTag[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
