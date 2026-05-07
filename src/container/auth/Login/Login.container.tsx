'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Container } from 'null_ong2-design-system';
import { LoginForm } from '@/ui/auth/LoginForm/LoginForm.ui';
import { useSession } from '@/lib/auth/SessionProvider';
import { useLogin } from './useLogin';

interface LoginContainerProps {
  redirectTo: string;
}

export function LoginContainer({ redirectTo }: LoginContainerProps) {
  const router = useRouter();
  const { session, isReady } = useSession();
  const { submit, isSubmitting, errorMessage } = useLogin(redirectTo);

  useEffect(() => {
    if (isReady && session) {
      router.replace(redirectTo);
    }
  }, [isReady, session, redirectTo, router]);

  return (
    <Box
      display="flex"
      width="100%"
      height="100vh"
      style={{ alignItems: 'center', justifyContent: 'center' }}
    >
      <Container maxWidth="sm">
        <Box
          padding="xl"
          bg="white"
          borderRadius="lg"
          style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}
        >
          <LoginForm
            onSubmit={submit}
            isSubmitting={isSubmitting}
            errorMessage={errorMessage}
          />
        </Box>
      </Container>
    </Box>
  );
}
