import { LoginContainer } from '@/container/auth/Login/Login.container';

interface LoginPageProps {
  searchParams: { from?: string };
}

const DEFAULT_REDIRECT = '/inquiries';

// `?from=` 으로 외부 URL/프로토콜-상대 URL 이 들어오면 open-redirect 가 되므로
// 같은 오리진 내부 경로(`/...`)만 허용한다.
function sanitizeRedirect(target: string | undefined): string {
  if (!target) return DEFAULT_REDIRECT;
  if (!target.startsWith('/')) return DEFAULT_REDIRECT;
  if (target.startsWith('//') || target.startsWith('/\\')) return DEFAULT_REDIRECT;
  return target;
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = sanitizeRedirect(searchParams.from);
  return <LoginContainer redirectTo={redirectTo} />;
}
