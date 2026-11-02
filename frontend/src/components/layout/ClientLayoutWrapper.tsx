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
  const showSpinner = !isPublic && (authLoading || (!user && hasToken));

  if (isLanding) {
    return <>{children}</>;
  }

  if (isPublic) {
    return <div className="min-h-screen bg-[#f8fafc] text-gray-900">{children}</div>;
  }

  if (showSpinner) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0cbde8]/20 border-t-[#0cbde8] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            Authenticating session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex">
      {/* Fixed Left Sidebar */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 z-40 hidden md:block">
        <NavigationSidebar />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#f8fafc]/90 backdrop-blur-md flex items-center justify-between px-6 border-b border-gray-200/60">
          <div className="flex-1 max-w-xl">
            <GlobalSearch />
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
