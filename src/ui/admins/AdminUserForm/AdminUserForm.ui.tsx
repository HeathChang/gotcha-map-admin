'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Select, Stack, Text } from 'null_ong2-design-system';
import type {
  AdminUserFormProps,
  AdminUserFormValues,
} from './AdminUserForm.types';

// member 는 storeId 필수 (BE 강제). superRefine 으로 조건부 검증한다.
const adminUserFormSchema = z
  .object({
    email: z.string().trim().min(1, '이메일을 입력해주세요.').email('올바른 이메일을 입력하세요.'),
    password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(72),
    name: z.string().trim().min(1, '이름을 입력해주세요.').max(100),
    role: z.enum(['admin', 'staff', 'member']),
    storeId: z.string().trim(),
  })
  .superRefine((values, ctx) => {
    if (values.role === 'member' && values.storeId === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['storeId'],
        message: '점주(member)는 담당 매장을 선택해야 합니다.',
      });
    }
  });

const ROLE_OPTIONS: ReadonlyArray<{ value: AdminUserFormValues['role']; label: string }> = [
  { value: 'admin', label: '관리자 (admin)' },
  { value: 'staff', label: '운영 (staff)' },
  { value: 'member', label: '점주 (member)' },
];

const DEFAULT_VALUES: AdminUserFormValues = {
  email: '',
  password: '',
  name: '',
  role: 'staff',
  storeId: '',
};

export function AdminUserForm({
  storeOptions,
  storeOptionsLoading,
  onSubmit,
  onCancel,
  isSubmitting,
}: AdminUserFormProps) {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserFormSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const role = watch('role');

  const storeSelectOptions = storeOptions.map((opt) => ({
    value: opt.storeId,
    label: opt.name,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Stack spacing="sm">
          <Input
            label="이메일"
            type="email"
            placeholder="operator@gotchamap.kr"
            required
            error={errors.email?.message}
            {...register('email')}
          />
        </Stack>

        <Stack spacing="sm">
          <Input
            label="초기 비밀번호"
            type="password"
            placeholder="8자 이상"
            required
            error={errors.password?.message}
            {...register('password')}
          />
        </Stack>

        <Stack spacing="sm">
          <Input
            label="이름"
            placeholder="예: 운영팀 김OO"
            required
            error={errors.name?.message}
            {...register('name')}
          />
        </Stack>

        <Stack spacing="sm">
          <Select
            label="역할"
            required
            options={ROLE_OPTIONS as Array<{ value: string; label: string }>}
            error={errors.role?.message}
            {...register('role')}
          />
        </Stack>

        {role === 'member' ? (
          <Stack spacing="sm">
            <Select
              label="담당 매장"
              required
              placeholder={storeOptionsLoading ? '매장 불러오는 중…' : '매장을 선택하세요'}
              options={storeSelectOptions}
              error={errors.storeId?.message}
              {...register('storeId')}
            />
            <Text size="xs" color="muted">
              점주 계정은 선택한 매장(/my-store)만 관리할 수 있습니다.
            </Text>
          </Stack>
        ) : null}

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '생성 중…' : '운영자 생성'}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
