import type { AdminRole } from '@/types/admin.types';

// 운영자 계정 관리 (admin 전용). BE admin.service 의 managed-user shape 와 1:1.
// status: 1=활성, 0=비활성.
export type AdminManagedUserStatus = 1 | 0;

export interface AdminManagedUser {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  storeId: string | null;
  storeName: string | null;
  status: number;
  createdAt: string;
  updatedAt: string;
}

export interface ListAdminManagedUserParams {
  q?: string;
  role?: AdminRole;
  page?: number;
  limit?: number;
}

export interface AdminManagedUserListResponse {
  items: AdminManagedUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface CreateAdminManagedUserPayload {
  email: string;
  password: string;
  name: string;
  role: AdminRole;
  // member 는 storeId 필수 (BE 강제).
  storeId?: string | null;
}

export interface UpdateAdminManagedUserStatusPayload {
  status: AdminManagedUserStatus;
}

export interface ResetAdminManagedUserPasswordPayload {
  password: string;
}
