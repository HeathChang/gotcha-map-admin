// BE users.user_status 와 1:1 (마이그레이션 0001).
export type AdminUserStatus = 1 | 0 | -1;

export interface AdminUser {
  userId: string;
  /** admin·staff 에게는 BE 가 풀 노출 (gotcha-map-policy §7). */
  email: string;
  nickname: string;
  gender: 'M' | 'F' | null;
  profileImageUrl: string | null;
  userStatus: AdminUserStatus;
  userFlag: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminUserParams {
  q?: string;
  status?: AdminUserStatus;
  page?: number;
  limit?: number;
}

export interface UpdateAdminUserStatusPayload {
  status: AdminUserStatus;
}

export interface AdminUserListResponse {
  items: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
