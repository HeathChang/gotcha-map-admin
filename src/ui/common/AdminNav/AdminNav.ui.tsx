'use client';

import Link from 'next/link';
import clsx from 'clsx';
import { Stack, Text } from 'null_ong2-design-system';
import type { AdminNavProps } from './AdminNav.types';

export function AdminNav({ items, currentPath, role }: AdminNavProps) {
  const visibleItems = items.filter((item) => item.allowedRoles.includes(role));

  return (
    <nav aria-label="admin sections">
      <Stack spacing="1">
        {visibleItems.map((item) => {
          const isActive =
            currentPath === item.href || currentPath.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'block rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                  ? 'bg-admin-accent/10 text-admin-accent font-medium'
                  : 'text-gray-700 hover:bg-gray-100',
              )}
            >
              <Text size="sm">{item.label}</Text>
            </Link>
          );
        })}
      </Stack>
    </nav>
  );
}
