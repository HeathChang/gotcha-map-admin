'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Alert,
  Button,
  Heading,
  Input,
  Label,
  Stack,
  Text,
} from 'null_ong2-design-system';
import type { LoginFormProps, LoginFormValues } from './LoginForm.types';

const loginSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다.'),
  password: z.string().min(4, '비밀번호는 4자 이상이어야 합니다.'),
});

export function LoginForm({
  onSubmit,
  isSubmitting,
  errorMessage,
}: LoginFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <Stack spacing="lg">
        <Stack spacing="xs">
          <Heading as="h1" size="lg">
            GachaMap 어드민
          </Heading>
          <Text size="sm" color="muted">
            운영자 계정으로 로그인하세요.
          </Text>
        </Stack>

        {errorMessage ? (
          <Alert variant="danger" title="로그인 실패">
            {errorMessage}
          </Alert>
        ) : null}

        <Stack spacing="sm">
          <Label htmlFor="email" required>
            이메일
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="username"
            placeholder="ops@gachamap.io"
            {...register('email')}
          />
          {errors.email ? (
            <Text size="sm" color="danger">
              {errors.email.message}
            </Text>
          ) : null}
        </Stack>

        <Stack spacing="sm">
          <Label htmlFor="password" required>
            비밀번호
          </Label>
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
          />
          {errors.password ? (
            <Text size="sm" color="danger">
              {errors.password.message}
            </Text>
          ) : null}
        </Stack>

        <Button type="submit" variant="primary" size="lg" disabled={isSubmitting}>
          {isSubmitting ? '로그인 중…' : '로그인'}
        </Button>
      </Stack>
    </form>
  );
}
