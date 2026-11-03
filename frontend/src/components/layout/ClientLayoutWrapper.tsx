'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import NavigationSidebar from './NavigationSidebar';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import GlobalSearch from './GlobalSearch';

const BOTTOM_NAV = [
  { name: 'Home', href: '/dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { name: 'Arena', href: '/assessments', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
  { name: 'Projects', href: '/projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
  { name: 'Teams', href: '/teams', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
  { name: 'Profile', href: '/profile', icon: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
];

export default function ClientLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isPublic = pathname === '/' || pathname === '/login' || pathname === '/signup' || pathname === '/onboarding';
  const isLanding = pathname === '/';

  React.useEffect(() => {
    const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('skillforge_token');
    if (!authLoading && !isPublic && !user && !hasToken) {
      window.location.href = '/login';
    }
  }, [authLoading, isPublic, user]);

  // Close sidebar on route change
  React.useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const hasToken = typeof window !== 'undefined' && !!localStorage.getItem('skillforge_token');
  const showSpinner = !isPublic && (authLoading || (!user && hasToken));

  if (isLanding) return <>{children}</>;

  if (isPublic) {
    return <div className="min-h-screen bg-[#f8fafc] text-gray-900">{children}</div>;
  }

  if (showSpinner) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-[#0cbde8]/20 border-t-[#0cbde8] rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium text-sm animate-pulse">Authenticating session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col md:flex-row w-full max-w-full overflow-x-hidden">
      {/* ─── Desktop Sidebar ─── */}
      <aside className="fixed left-4 top-4 bottom-4 w-64 z-40 hidden md:block">
        <NavigationSidebar />
      </aside>

      {/* ─── Mobile Sidebar Overlay ─── */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          {/* Drawer */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-white shadow-2xl z-10 overflow-y-auto">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-bold text-gray-900 text-lg">Menu</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <NavigationSidebar />
          </aside>
        </div>
      )}

      {/* ─── Main Content ─── */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen w-full max-w-full min-w-0 overflow-x-hidden">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-[#f8fafc]/95 backdrop-blur-md flex items-center gap-3 px-3 sm:px-4 md:px-6 border-b border-gray-200/60 w-full max-w-full">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          {/* Search */}
          <div className="flex-1 min-w-0">
            <GlobalSearch />
          </div>

          {/* Theme Toggle */}
          <div className="flex-shrink-0">
            <ThemeToggle />
          </div>
        </header>

        {/* Page Content — extra bottom padding on mobile for bottom nav */}
        <main className="flex-1 p-3 sm:p-5 md:p-8 pb-28 md:pb-8 w-full max-w-full min-w-0 overflow-x-hidden">
          {children}
        </main>
      </div>

      {/* ─── Mobile Bottom Tab Bar ─── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-200 flex items-stretch h-16 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
        {BOTTOM_NAV.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#0cbde8]' : 'text-gray-400 hover:text-gray-700'
              }`}
            >
              <svg className={`w-5 h-5 ${isActive ? 'stroke-[#0cbde8]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={isActive ? 2.5 : 2} d={item.icon} />
              </svg>
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
