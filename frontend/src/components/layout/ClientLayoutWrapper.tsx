'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import NavigationSidebar from './NavigationSidebar';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/signup';
  const isLanding = pathname === '/';

  React.useEffect(() => {
    if (!authLoading && !isPublic && !user) {
      window.location.href = '/login';
    }
  }, [authLoading, isPublic, user]);

  // Show spinner if we are redirecting OR if we are still checking auth on a private route
  const showSpinner = (!isPublic && authLoading) || (!authLoading && !isPublic && !user);

  return (
    <>
      {!isLanding && <ThemeToggle />}
      <div style={{ display: showSpinner ? 'none' : 'block', width: '100%' }}>
        <div className={`flex w-full ${!isPublic ? 'min-h-screen interior-bg p-4 gap-4' : isLanding ? 'h-screen overflow-hidden bg-[#020204]' : 'min-h-screen'}`}>
          {!isPublic && <NavigationSidebar />}
          <main className={`flex-1 w-full transition-all duration-300 ${!isPublic ? 'h-[calc(100vh-2rem)] overflow-y-auto interior-panel' : isLanding ? 'h-screen overflow-hidden' : ''}`}>
            {children}
          </main>
        </div>
      </div>
      
      {showSpinner && (
        <div className="flex min-h-screen w-full items-center justify-center bg-[#f3f4f6]">
          <div className="animate-pulse w-10 h-10 rounded-full border-4 border-gray-200 border-t-[#0cbde8]"></div>
        </div>
      )}
    </>
  );
}
