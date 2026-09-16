import React from 'react';
import type { Metadata } from 'next';
import { Barlow, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const barlow = Barlow({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-barlow',
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
});

import ClientLayoutWrapper from '../components/layout/ClientLayoutWrapper';

export const metadata: Metadata = {
  title: 'SkillForge — Engineered Skills & Precision Ecosystem',
  description:
    'Technical contract ecosystem for developers. Rigorous assessments, verifiable portfolios, and algorithmic team formation.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${barlow.variable} ${ibmPlexMono.variable}`}>
      <body className="bg-[#15181d] text-[#eaedf0] min-h-screen antialiased">
        <ClientLayoutWrapper>
          {children}
        </ClientLayoutWrapper>
      </body>
    </html>
  );
}
