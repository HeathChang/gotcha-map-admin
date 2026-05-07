'use client';

import { useState, type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from 'null_ong2-design-system';
import { SessionProvider } from '@/lib/auth/SessionProvider';
import { createQueryClient } from '@/lib/query/queryClient';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider position="top-right">
        <SessionProvider>{children}</SessionProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}
