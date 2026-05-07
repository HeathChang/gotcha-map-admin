'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { AdminSession } from '@/types/admin.types';
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
} from '@/lib/auth/sessionStorage';
import { setActiveSession } from '@/lib/auth/sessionToken';

interface SessionContextValue {
  session: AdminSession | null;
  isReady: boolean;
  setSession: (next: AdminSession) => void;
  clearSession: () => void;
}

const SessionContext = createContext<SessionContextValue | null>(null);

interface SessionProviderProps {
  children: ReactNode;
}

export function SessionProvider({ children }: SessionProviderProps) {
  const [session, setSessionState] = useState<AdminSession | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = loadStoredSession();
    if (stored) {
      setSessionState(stored);
      setActiveSession(stored);
    }
    setIsReady(true);
  }, []);

  const setSession = useCallback((next: AdminSession) => {
    setSessionState(next);
    setActiveSession(next);
    persistSession(next);
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setActiveSession(null);
    clearStoredSession();
  }, []);

  const value = useMemo(
    () => ({ session, isReady, setSession, clearSession }),
    [session, isReady, setSession, clearSession],
  );

  return (
    <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used inside <SessionProvider>');
  }
  return ctx;
}
