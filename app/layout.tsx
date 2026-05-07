import type { Metadata } from 'next';
import { AppProviders } from '@/lib/providers/AppProviders';
import './globals.css';

export const metadata: Metadata = {
  title: 'GachaMap Admin',
  description: 'GachaMap 운영자 백오피스',
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="ko">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
