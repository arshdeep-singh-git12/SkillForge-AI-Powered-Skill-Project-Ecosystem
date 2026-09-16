'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavigationSidebar from './NavigationSidebar';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <div className="flex min-h-screen w-full">
      {!isPublic && <NavigationSidebar />}
      <main className={`flex-1 w-full transition-all duration-300 ${!isPublic ? 'lg:pl-64' : ''}`}>
        {children}
      </main>
    </div>
  );
}
