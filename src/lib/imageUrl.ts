import { ENV } from '@/lib/env';

// 정적 파일은 /api/v1 하위가 아니라 서버 루트(/uploads/...)에서 서빙되므로
// apiBaseUrl 에서 /api/v1 접미사를 떼어 origin 을 구한다.
const API_ORIGIN = ENV.apiBaseUrl.replace(/\/api\/v\d+\/?$/, '');

/**
 * BE 가 내려주는 상대 imageUrl(`/uploads/...`)을 표시 가능한 절대 URL 로.
 * 이미 http(s) 면 그대로 통과.
 */
export function resolveAdminImageUrl(
  url: string | null | undefined,
): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith('/')) return `${API_ORIGIN}${url}`;
  return `${API_ORIGIN}/${url}`;
}
