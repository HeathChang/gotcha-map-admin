import type { AdminSession } from '@/types/admin.types';

/**
 * SessionProvider 가 React 트리 안에서만 작동하는 데 비해, axios 인터셉터는 트리 밖에서 돈다.
 * 둘 사이의 다리 역할로 모듈 단위 ref + updater 콜백을 둔다.
 *
 *   SessionProvider mount → registerSessionUpdater(setSession)
 *   axios 401 → /admin/refresh 호출 후 notifySessionUpdate(newSession)
 *   SessionProvider 가 콜백을 받아 React state + sessionStorage + sessionRef 모두 갱신.
 */
let sessionRef: AdminSession | null = null;
let sessionUpdater: ((session: AdminSession | null) => void) | null = null;

export function setActiveSession(session: AdminSession | null): void {
  sessionRef = session;
}

export function getActiveAccessToken(): string | null {
  return sessionRef?.accessToken ?? null;
}

export function getActiveRefreshToken(): string | null {
  return sessionRef?.refreshToken ?? null;
}

export function getActiveSession(): AdminSession | null {
  return sessionRef;
}

export function registerSessionUpdater(
  updater: ((session: AdminSession | null) => void) | null,
): void {
  sessionUpdater = updater;
}

export function notifySessionUpdate(next: AdminSession | null): void {
  sessionUpdater?.(next);
}
