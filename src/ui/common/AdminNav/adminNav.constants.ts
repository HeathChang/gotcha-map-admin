import type { AdminNavItem } from './AdminNav.types';

export const ADMIN_NAV_ITEMS: ReadonlyArray<AdminNavItem> = [
  {
    href: '/inquiries',
    label: '문의',
    allowedRoles: ['super_admin', 'support_staff'],
  },
  {
    href: '/users',
    label: '회원',
    allowedRoles: ['super_admin', 'support_staff'],
  },
  {
    href: '/products',
    label: '제품',
    allowedRoles: ['super_admin', 'content_manager'],
  },
  {
    href: '/stores',
    label: '스토어',
    allowedRoles: ['super_admin', 'content_manager'],
  },
  {
    href: '/announcements',
    label: '공지',
    allowedRoles: ['super_admin', 'content_manager'],
  },
  {
    href: '/tags',
    label: '태그',
    allowedRoles: ['super_admin', 'content_manager'],
  },
  {
    href: '/audit-logs',
    label: '감사 로그',
    allowedRoles: ['super_admin'],
  },
];
