'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useToast } from 'null_ong2-design-system';
import type { AdminSession } from '@/types/admin.types';
import {
  clearStoredSession,
  loadStoredSession,
  persistSession,
} from '@/lib/auth/sessionStorage';
import { setActiveSession } from '@/lib/auth/sessionToken';

/**
 * 무활동 자동 로그아웃 임계값.
 * vision §7 (admin) "세션 30분 무활동 시 자동 로그아웃".
 * 검사 주기는 1분 (분 단위 정확도면 충분, 이벤트 부담 적음).
 */
const IDLE_TIMEOUT_MS = 30 * 60 * 1000;
const IDLE_CHECK_INTERVAL_MS = 60 * 1000;

const ACTIVITY_EVENTS: ReadonlyArray<keyof DocumentEventMap> = [
  'mousedown',
  'keydown',
  'touchstart',
  'scroll',
];

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
  const toast = useToast();

  // ref 로 두어 활동 이벤트마다 re-render 가 발생하지 않게 한다.
  const lastActivityRef = useRef<number>(Date.now());

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
    lastActivityRef.current = Date.now();
  }, []);

  const clearSession = useCallback(() => {
    setSessionState(null);
    setActiveSession(null);
    clearStoredSession();
  }, []);

  // 활동 이벤트 리스너: 세션이 살아있을 때만 부착한다.
  useEffect(() => {
    if (!session) return;

    const markActive = () => {
      lastActivityRef.current = Date.now();
    };
    for (const ev of ACTIVITY_EVENTS) {
      document.addEventListener(ev, markActive, { passive: true });
    }
    return () => {
      for (const ev of ACTIVITY_EVENTS) {
        document.removeEventListener(ev, markActive);
      }
    };
  }, [session]);

  // 무활동 검사 타이머.
  useEffect(() => {
    if (!session) return;

    const intervalId = window.setInterval(() => {
      const idleMs = Date.now() - lastActivityRef.current;
      if (idleMs >= IDLE_TIMEOUT_MS) {
        clearSession();
        toast.warning('30분 동안 활동이 없어 자동 로그아웃되었습니다.');
      }
    }, IDLE_CHECK_INTERVAL_MS);

    return () => window.clearInterval(intervalId);
  }, [session, clearSession, toast]);

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
