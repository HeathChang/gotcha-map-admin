import type { AdminInquiry, AdminUser } from '@/types/admin.types';

export const MOCK_ADMIN_USER: AdminUser = {
  adminId: 'admin-1',
  email: 'ops@gachamap.io',
  name: '운영자',
  role: 'super_admin',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const MOCK_INQUIRIES: AdminInquiry[] = [
  {
    inquiryId: 'inq-001',
    userId: 'user-101',
    userEmail: 'minji@example.com',
    title: '특정 매장에서 가격이 다르게 표시돼요',
    content:
      '강남역 캡슐카페에서 산리오 가챠 가격이 6,000원인데 앱에는 5,000원으로 떠 있어요. 확인 부탁드려요.',
    status: 'pending',
    answer: null,
    answeredAt: null,
    answeredByAdminId: null,
    createdAt: '2026-05-02T07:32:00.000Z',
  },
  {
    inquiryId: 'inq-002',
    userId: 'user-102',
    userEmail: 'taeho@example.com',
    title: '회원 탈퇴는 어떻게 하나요?',
    content: '마이페이지에서 탈퇴 버튼이 안 보입니다.',
    status: 'processing',
    answer: null,
    answeredAt: null,
    answeredByAdminId: null,
    createdAt: '2026-05-01T03:11:00.000Z',
  },
  {
    inquiryId: 'inq-003',
    userId: 'user-103',
    userEmail: 'sora@example.com',
    title: '신상 가챠 등록 요청',
    content: '5월 신상 산리오 시리즈를 등록해주세요. 카탈로그 첨부합니다.',
    status: 'completed',
    answer: '5/3 자로 신상 카테고리에 추가 완료했습니다. 감사합니다.',
    answeredAt: '2026-05-03T01:00:00.000Z',
    answeredByAdminId: 'admin-1',
    createdAt: '2026-04-30T22:05:00.000Z',
  },
  {
    inquiryId: 'inq-004',
    userId: 'user-104',
    userEmail: 'spam@example.com',
    title: '광고성 메시지',
    content: '안녕하세요 부업 권유드립니다 ...',
    status: 'rejected',
    answer: '서비스와 무관한 문의로 처리됩니다.',
    answeredAt: '2026-05-02T10:00:00.000Z',
    answeredByAdminId: 'admin-1',
    createdAt: '2026-05-02T09:55:00.000Z',
  },
];
