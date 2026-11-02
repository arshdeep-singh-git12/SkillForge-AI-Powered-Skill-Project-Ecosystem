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
        {!isPublic && <GlobalSearch />}
        <NavigationSidebar />
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
