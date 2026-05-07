function readEnv(key: string, fallback?: string): string {
  const raw = process.env[key];
  if (raw === undefined || raw === '') {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required env var: ${key}`);
  }
  return raw;
}

export const ENV = {
  apiBaseUrl: readEnv(
    'NEXT_PUBLIC_API_BASE_URL',
    'http://localhost:3001/api/v1',
  ),
  useMockApi: readEnv('NEXT_PUBLIC_USE_MOCK_API', 'true') === 'true',
} as const;
