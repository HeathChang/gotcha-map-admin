import type { AdminNavItem } from './AdminNav.types';

// gotcha-map-policy §4.1 권한 매트릭스와 1:1. admin·staff 는 콘텐츠/문의/회원 전부,
// member 는 자기 매장(/my-store)만, /admins·/audit-logs 는 admin 전용.
export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  {
    href: '/my-store',
    label: '내 매장',
    allowedRoles: ['member'],
  },
  {
    href: '/inquiries',
    label: '문의',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/users',
    label: '회원',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/products',
    label: '제품',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/stores',
    label: '스토어',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/announcements',
    label: '공지',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/banners',
    label: '배너',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/tags',
    label: '태그',
    allowedRoles: ['admin', 'staff'],
  },
  {
    href: '/admins',
    label: '운영자 관리',
    allowedRoles: ['admin'],
  },
  {
    href: '/audit-logs',
    label: '감사 로그',
    allowedRoles: ['admin'],
  },
];
