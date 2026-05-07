'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { useToast } from 'null_ong2-design-system';
import { loginAdmin } from '@/api/admin/auth.api';
import { useSession } from '@/lib/auth/SessionProvider';
import { AdminApiError } from '@/lib/axios/adminAxios';
import type { LoginFormValues } from '@/ui/auth/LoginForm/LoginForm.types';

interface UseLoginResult {
  submit: (values: LoginFormValues) => void;
  isSubmitting: boolean;
  errorMessage: string | null;
}

export function useLogin(redirectTo: string): UseLoginResult {
  const router = useRouter();
  const { setSession } = useSession();
  const toast = useToast();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: loginAdmin,
    onSuccess: (session) => {
      setSession(session);
      toast.success('로그인되었습니다.');
      router.replace(redirectTo);
    },
    onError: (error: unknown) => {
      const message =
        error instanceof AdminApiError
          ? error.message
          : '로그인 중 오류가 발생했습니다.';
      setErrorMessage(message);
    },
  });

  return {
    submit: (values) => {
      setErrorMessage(null);
      mutation.mutate(values);
    },
    isSubmitting: mutation.isPending,
    errorMessage,
  };
}
