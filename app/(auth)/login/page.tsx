import { LoginContainer } from '@/container/auth/Login/Login.container';

interface LoginPageProps {
  searchParams: { from?: string };
}

export default function LoginPage({ searchParams }: LoginPageProps) {
  const redirectTo = searchParams.from ?? '/inquiries';
  return <LoginContainer redirectTo={redirectTo} />;
}
