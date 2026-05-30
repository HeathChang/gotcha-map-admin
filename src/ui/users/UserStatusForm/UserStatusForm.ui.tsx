'use client';

import { useState } from 'react';
import dayjs from 'dayjs';
import { Button, Heading, Select, Stack, Text } from 'null_ong2-design-system';
import type { AdminUserStatus } from '@/types/user.types';
import { USER_STATUS_OPTIONS } from '@/ui/users/UserStatusBadge/userStatusBadge.constants';
import type { UserStatusFormProps } from './UserStatusForm.types';

const STATUS_SELECT_OPTIONS = USER_STATUS_OPTIONS.map((o) => ({
  value: String(o.value),
  label: o.label,
}));

export function UserStatusForm({
  user,
  onSubmit,
  onCancel,
  isSubmitting,
}: UserStatusFormProps) {
  const [next, setNext] = useState<AdminUserStatus>(user.userStatus);
  const isUnchanged = next === user.userStatus;

  return (
    <Stack spacing="lg">
      <Stack spacing="2">
        <Heading as="h3" size="lg">
          회원 상태 변경
        </Heading>
        <Text size="xs" color="muted">
          {user.email} · {user.nickname} · 가입 {dayjs(user.createdAt).format('YYYY-MM-DD')}
        </Text>
      </Stack>

      <Select
        label="상태"
        options={STATUS_SELECT_OPTIONS}
        value={String(next)}
        onChange={(e) => setNext(Number(e.target.value) as AdminUserStatus)}
        required
      />

      <Text size="xs" color="muted">
        탈퇴(-1)는 되돌릴 수 있지만, 사용자에게는 즉시 비활성으로 노출됩니다.
      </Text>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
          취소
        </Button>
        <Button
          type="button"
          variant="primary"
          disabled={isSubmitting || isUnchanged}
          onClick={() => onSubmit(next)}
        >
          {isSubmitting ? '저장 중…' : '변경 저장'}
        </Button>
      </div>
    </Stack>
  );
}
