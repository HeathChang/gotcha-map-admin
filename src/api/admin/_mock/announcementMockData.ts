import type { AdminAnnouncement } from '@/types/announcement.types';

// 공지 CRUD + isActive 토글 UX 확인용 mock.
export const MOCK_ANNOUNCEMENTS: AdminAnnouncement[] = [
  {
    announceId: 'ann-001',
    title: '가챠맵 v1.2 업데이트 안내',
    content:
      '신규 매장 검색 필터와 즐겨찾기 정렬 기능이 추가되었습니다. 자세한 내용은 본문을 확인해주세요.',
    isActive: true,
    createdAt: '2026-05-01T01:00:00.000Z',
    updatedAt: '2026-05-01T01:00:00.000Z',
  },
  {
    announceId: 'ann-002',
    title: '5월 정기 점검 안내 (5/20 02:00~04:00)',
    content: '서버 안정화를 위한 정기 점검이 예정되어 있습니다. 점검 시간 동안 서비스 이용이 제한됩니다.',
    isActive: true,
    createdAt: '2026-05-10T05:30:00.000Z',
    updatedAt: '2026-05-12T02:10:00.000Z',
  },
  {
    announceId: 'ann-003',
    title: '[종료] 봄맞이 이벤트 안내',
    content: '봄맞이 가챠 이벤트가 종료되었습니다. 많은 참여 감사드립니다.',
    isActive: false,
    createdAt: '2026-03-02T00:00:00.000Z',
    updatedAt: '2026-04-01T00:00:00.000Z',
  },
];
