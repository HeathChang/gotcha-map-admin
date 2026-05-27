import type { AdminTag } from '@/types/tag.types';

// 가챠 제품 분류용 태그 — CRUD UX 확인용 mock.
export const MOCK_TAGS: AdminTag[] = [
  {
    tagId: 'tag-001',
    name: '산리오',
    relationType: 'character',
    createdAt: '2026-01-10T02:00:00.000Z',
  },
  {
    tagId: 'tag-002',
    name: '치이카와',
    relationType: 'character',
    createdAt: '2026-01-10T02:01:00.000Z',
  },
  {
    tagId: 'tag-003',
    name: '포켓몬',
    relationType: 'character',
    createdAt: '2026-01-12T05:30:00.000Z',
  },
  {
    tagId: 'tag-004',
    name: '피규어',
    relationType: 'category',
    createdAt: '2026-02-01T08:00:00.000Z',
  },
  {
    tagId: 'tag-005',
    name: '키링',
    relationType: 'category',
    createdAt: '2026-02-01T08:01:00.000Z',
  },
  {
    tagId: 'tag-006',
    name: '신상',
    relationType: null,
    createdAt: '2026-03-15T01:00:00.000Z',
  },
];
