import React from 'react';
import type { Metadata } from 'next';
import { Poppins, Playfair_Display } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '../context/AuthContext';
import ClientLayoutWrapper from '../components/layout/ClientLayoutWrapper';

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['600'],
  variable: '--font-playfair',
});

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
    <html lang="en" className={`${poppins.variable} ${playfair.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `document.documentElement.classList.add('intro'); setTimeout(function(){document.documentElement.classList.remove('intro');},4000);` }} />
      </head>
      <body className="bg-[#020204] text-[#fff] min-h-screen antialiased font-sans">
        <AuthProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
