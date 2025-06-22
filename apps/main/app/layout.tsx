import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@itemseek2/api-client';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ItemSeek2',
  description: 'Industry-agnostic inventory management system',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
  themeColor: '#2563eb',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${inter.className} bg-gray-50 overscroll-none`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}