function readEnv(key: string, fallback?: string): string {
  const raw = process.env[key];
  if (raw === undefined || raw === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
  }
  return raw;
}

const isProd = process.env.NODE_ENV === 'production';

export const ENV = {
  // H4: dev 는 localhost 폴백을 허용하되, production 빌드는 폴백 없이 실제 주입값을 강제한다.
  //     (미주입 시 조용히 localhost/http 가 baked-in 되어 운영 콘솔이 전 요청 실패하는 것을 방지 — 빌드 실패로 조기 검출.)
  apiBaseUrl: readEnv(
    'NEXT_PUBLIC_API_BASE_URL',
    isProd ? undefined : 'http://localhost:8060/api/v1',
  ),
  // H4: 운영 배포에서 이 변수 주입을 깜빡해도 "조용한 mock"(쓰기 유실·빈 데이터)이 되지
  //     않도록 기본값을 false(실 API)로 둔다(fail-safe). 로컬에서 백엔드 없이 UI만 보려면
  //     .env.local 에 NEXT_PUBLIC_USE_MOCK_API=true 를 명시한다.
  useMockApi: readEnv('NEXT_PUBLIC_USE_MOCK_API', 'false') === 'true',
} as const;
