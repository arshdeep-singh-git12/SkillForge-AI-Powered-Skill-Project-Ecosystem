'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import NavigationSidebar from './NavigationSidebar';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();

  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/onboarding';
  const isLanding = pathname === '/';

  React.useEffect(() => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('skillforge_token');
    if (!authLoading && !isPublic && !user && !hasToken) {
      window.location.href = '/login';
    }
  }, [authLoading, isPublic, user]);

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('skillforge_token');
  // Show spinner only on private routes while loading
  const showSpinner = !isPublic && (authLoading || (!user && hasToken));

  return (
    <>
      {!isLanding && <ThemeToggle />}
      <div style={{ display: showSpinner ? 'none' : 'block', width: '100%' }}>
        {!isPublic && <GlobalSearch />}
        {!isPublic && <NavigationSidebar />}
        <main className={`min-h-screen ${!isPublic ? 'pl-64 pt-16' : ''}`}>
          {children}
        </main>
      </div>

      {showSpinner && (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0d1117] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin"></div>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-sm animate-pulse">
              Authenticating session...
            </p>
          </div>
        </div>
      )}
    </>
  );
}
