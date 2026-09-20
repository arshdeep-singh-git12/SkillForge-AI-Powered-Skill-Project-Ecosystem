'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavigationSidebar from './NavigationSidebar';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/signup';
  const isLanding = pathname === '/';

  return (
    <div className={`flex w-full ${!isPublic ? 'min-h-screen interior-bg p-4 gap-4' : isLanding ? 'h-screen overflow-hidden bg-[#020204]' : 'min-h-screen'}`}>
      {!isPublic && <NavigationSidebar />}
      <main className={`flex-1 w-full transition-all duration-300 ${!isPublic ? 'h-[calc(100vh-2rem)] overflow-y-auto interior-panel' : isLanding ? 'h-screen overflow-hidden' : ''}`}>
        {children}
      </main>
    </div>
  );
}
