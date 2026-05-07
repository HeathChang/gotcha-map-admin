'use client';

import { Badge, Button, Flex, Heading, Text } from 'null_ong2-design-system';
import type { AdminHeaderProps } from './AdminHeader.types';
import { ROLE_LABEL_MAP } from './adminHeader.constants';

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <header className="flex h-14 items-center justify-between border-b border-admin-border bg-admin-surface px-6">
      <Heading as="h2" size="lg">
        GachaMap Admin
      </Heading>
      <Flex align="center" gap="3">
        <Badge variant="info" size="sm">
          {ROLE_LABEL_MAP[user.role]}
        </Badge>
        <Text size="sm" color="muted">
          {user.email}
        </Text>
        <Button variant="ghost" size="sm" onClick={onLogout}>
          로그아웃
        </Button>
      </Flex>
    </header>
  );
}
