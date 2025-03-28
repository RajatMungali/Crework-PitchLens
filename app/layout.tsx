import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';

const outfit = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'QuickFunds - AI-Powered Pitch Deck Analyzer',
  description: 'Get instant feedback on your pitch deck with our AI-powered analyzer. Improve your pitch and increase your chances of success.'
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={outfit.className}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}