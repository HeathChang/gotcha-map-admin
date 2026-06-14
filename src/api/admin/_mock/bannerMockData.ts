import type { AdminBanner } from '@/types/banner.types';

// 배너 CRUD + isActive 토글 UX 확인용 mock. 실제 업로드는 useMockApi=false 에서만 동작.
export const MOCK_BANNERS: AdminBanner[] = [
  {
    bannerId: 'banner-001',
    title: '샘플 배너 1',
    imageUrl: '/uploads/sample/sample-banner.jpeg',
    linkUrl: 'https://www.google.com',
    sortOrder: 0,
    isActive: true,
    createdAt: '2026-05-01T01:00:00.000Z',
    updatedAt: '2026-05-01T01:00:00.000Z',
  },
  {
    bannerId: 'banner-002',
    title: '샘플 배너 2',
    imageUrl: '/uploads/sample/sample-banner-2.png',
    linkUrl: 'https://www.google.com',
    sortOrder: 1,
    isActive: true,
    createdAt: '2026-05-02T01:00:00.000Z',
    updatedAt: '2026-05-02T01:00:00.000Z',
  },
];
