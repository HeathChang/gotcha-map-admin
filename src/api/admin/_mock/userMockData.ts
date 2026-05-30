import type { AdminUser } from '@/types/user.types';

// 회원 목록 + 상태 변경 UX 확인용 mock. mock 모드에서는 마스킹 없이 풀 노출(BE 가 결정).
export const MOCK_USERS: AdminUser[] = [
  {
    userId: 'user-001',
    email: 'alice@example.com',
    nickname: 'alice',
    gender: 'F',
    profileImageUrl: null,
    userStatus: 1,
    userFlag: 0,
    createdAt: '2026-01-04T05:12:00.000Z',
    updatedAt: '2026-05-20T02:00:00.000Z',
  },
  {
    userId: 'user-002',
    email: 'bob.long.name@example.com',
    nickname: 'bobby',
    gender: 'M',
    profileImageUrl: null,
    userStatus: 1,
    userFlag: 0,
    createdAt: '2026-02-15T07:00:00.000Z',
    updatedAt: '2026-04-11T03:10:00.000Z',
  },
  {
    userId: 'user-003',
    email: 'charlie@example.com',
    nickname: 'chacha',
    gender: null,
    profileImageUrl: null,
    userStatus: 0,
    userFlag: 0,
    createdAt: '2026-03-01T01:30:00.000Z',
    updatedAt: '2026-05-10T11:20:00.000Z',
  },
  {
    userId: 'user-004',
    email: 'former@example.com',
    nickname: '탈퇴회원',
    gender: 'M',
    profileImageUrl: null,
    userStatus: -1,
    userFlag: 0,
    createdAt: '2025-12-20T08:00:00.000Z',
    updatedAt: '2026-03-05T09:00:00.000Z',
  },
];
