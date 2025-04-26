import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import Navigation from '@/components/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ThreadDAO - Decentralized Social Platform',
  description: 'A decentralized, AI-enhanced social platform built with Next.js, Express.js, Solana, and Supabase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-white dark:bg-gray-900">
            <Navigation />
            <main className="py-10">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 