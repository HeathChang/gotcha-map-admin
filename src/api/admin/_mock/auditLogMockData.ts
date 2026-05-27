import type { AdminAuditLog } from '@/types/auditLog.types';

// 감사 로그 읽기 전용 UX 확인용 mock. 운영자 mutation 100% 기록 정책의 결과물.
export const MOCK_AUDIT_LOGS: AdminAuditLog[] = [
  {
    auditId: 'audit-001',
    adminId: 'admin-001',
    adminEmail: 'ops@gachamap.io',
    adminName: '운영자',
    action: 'announcement.update',
    targetType: 'announcement',
    targetId: 'ann-002',
    diff: {
      before: { isActive: false },
      after: { isActive: true },
    },
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-05-26T08:12:00.000Z',
  },
  {
    auditId: 'audit-002',
    adminId: 'admin-001',
    adminEmail: 'ops@gachamap.io',
    adminName: '운영자',
    action: 'tag.create',
    targetType: 'tag',
    targetId: 'tag-006',
    diff: {
      after: { name: '신상', relationType: null },
    },
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-05-25T03:40:00.000Z',
  },
  {
    auditId: 'audit-003',
    adminId: 'admin-002',
    adminEmail: 'cs@gachamap.io',
    adminName: 'CS담당',
    action: 'inquiry.answer',
    targetType: 'inquiry',
    targetId: 'inq-014',
    diff: {
      before: { status: 'pending', answer: null },
      after: { status: 'completed', answer: '확인 후 처리했습니다.' },
    },
    ip: '10.0.0.21',
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    createdAt: '2026-05-24T11:05:00.000Z',
  },
  {
    auditId: 'audit-004',
    adminId: 'admin-001',
    adminEmail: 'ops@gachamap.io',
    adminName: '운영자',
    action: 'tag.delete',
    targetType: 'tag',
    targetId: 'tag-009',
    diff: {
      before: { name: '테스트태그', relationType: null },
    },
    ip: '127.0.0.1',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    createdAt: '2026-05-23T07:22:00.000Z',
  },
];
