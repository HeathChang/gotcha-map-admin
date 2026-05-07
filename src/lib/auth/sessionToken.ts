import type { AdminSession } from '@/types/admin.types';

let sessionRef: AdminSession | null = null;

export function setActiveSession(session: AdminSession | null): void {
  sessionRef = session;
}

export function getActiveAccessToken(): string | null {
  return sessionRef?.accessToken ?? null;
}
