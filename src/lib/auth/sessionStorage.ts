import type { AdminSession } from '@/types/admin.types';

// reason: security.md 는 토큰을 httpOnly 쿠키에 두길 권장하나(localStorage/클라이언트 저장 지양),
// 어드민 SPA(:3000)가 별도 출처의 API(:8060)를 호출하는 구조라 교차 출처 httpOnly 쿠키 운영이 복잡하다.
// vision §7 의 의도적 트레이드오프: access 토큰 단명 + refresh 회전 + 30분 idle 로그아웃 + 탭 종료 시 소멸으로
// 노출 면적을 보완한다. localStorage 가 아닌 sessionStorage 를 택한 것도 영속 저장을 피하기 위함.
const STORAGE_KEY = 'gachamap-admin-session';

export function loadStoredSession(): AdminSession | null {
  if (typeof window === 'undefined') return null;
  const raw = window.sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AdminSession;
  } catch {
    window.sessionStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

export function persistSession(session: AdminSession): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearStoredSession(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}
