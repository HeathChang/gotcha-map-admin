'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input, Stack, Text } from 'null_ong2-design-system';
import type {
  PasswordResetFormProps,
  PasswordResetFormValues,
} from './PasswordResetForm.types';

const passwordResetFormSchema = z.object({
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다.').max(72),
});

export function PasswordResetForm({
  targetLabel,
  onSubmit,
  onCancel,
  isSubmitting,
}: PasswordResetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordResetFormValues>({
    resolver: zodResolver(passwordResetFormSchema),
    defaultValues: { password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Text size="sm" color="muted">
          <Text as="span" size="sm" weight="medium">
            {targetLabel}
          </Text>{' '}
          계정의 새 비밀번호를 입력하세요.
        </Text>

        <Stack spacing="sm">
          <Input
            label="새 비밀번호"
            type="password"
            placeholder="8자 이상"
            required
            error={errors.password?.message}
            {...register('password')}
          />
        </Stack>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isSubmitting}>
            취소
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? '변경 중…' : '비밀번호 변경'}
          </Button>
        </div>
      </Stack>
    </form>
  );
}
