// gotcha-map-policy §2: admin(전권) / staff(중앙 운영) / member(매장 점주).
// member 는 운영 역할이며 소비자 회원(앱 user)과 다르다.
export type AdminRole = 'admin' | 'staff' | 'member';

export interface AdminUser {
  adminId: string;
  email: string;
  name: string;
  role: AdminRole;
  // member 의 담당 매장 (admin/staff 는 null). /my-store 진입·소유권에 사용.
  storeId: string | null;
  createdAt: string;
}

// 백엔드 (gachamap-be src/services/admin.service.ts) 응답 shape 와 1:1 매칭.
export interface AdminSession {
  user: AdminUser;
  accessToken: string;
  accessExpiresInSec: number;
  refreshToken: string;
  refreshExpiresAt: string;
}

export interface AdminLoginPayload {
  email: string;
  password: string;
}

export type InquiryStatus =
  | 'pending'
  | 'processing'
  | 'completed'
  | 'rejected';

export interface AdminInquiry {
  inquiryId: string;
  userId: string;
  userEmail: string;
  title: string;
  content: string;
  status: InquiryStatus;
  answer: string | null;
  answeredAt: string | null;
  answeredByAdminId: string | null;
  createdAt: string;
}

export interface ListAdminInquiryParams {
  status?: InquiryStatus;
  q?: string;
  page?: number;
  limit?: number;
}

export interface AdminInquiryStats {
  countByStatus: {
    pending: number;
    processing: number;
    completed: number;
    rejected: number;
  };
  avgResponseHours: number | null;
  medianResponseHours: number | null;
  /** 24h SLA 초과 미답변 건수. */
  overdueCount: number;
  answeredSampleSize: number;
}

export interface AnswerInquiryPayload {
  status: InquiryStatus;
  answer: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}
