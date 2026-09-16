'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function NavigationSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide the sidebar on public routes
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return null;
  }

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
    { name: 'Projects', href: '/projects', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
    { name: 'Teams', href: '/teams', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { name: 'Assessments', href: '/assessments', icon: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4' },
    { name: 'Certifications', href: '/certifications', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { name: 'Reviews', href: '/reviews', icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' }
  ];

  const { user } = useAuth();

  const handleLogout = () => {
    document.cookie = 'token=none; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    router.push('/login');
  };

  return (
    <div className="fixed top-0 left-0 h-full w-64 bg-[#111317] border-r border-machined-700 flex flex-col z-50 transition-all shadow-[5px_0_15px_rgba(0,0,0,0.5)]">
      
      {/* Brand Logo */}
      <div className="p-6 border-b border-machined-700">
        <Link href="/dashboard" className="flex items-center gap-3 group">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan to-blue-500 flex items-center justify-center text-machined-900 font-bold group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-bold text-xl text-machined-100 tracking-tight">SkillForge</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                isActive 
                  ? 'bg-cyan/10 text-cyan shadow-[inset_4px_0_0_#0cbde8]' 
                  : 'text-machined-400 hover:text-machined-100 hover:bg-machined-800'
              }`}
            >
              <svg className={`w-5 h-5 ${isActive ? 'text-cyan' : 'text-machined-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              <span className="font-semibold text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile / Logout */}
      <div className="p-4 border-t border-machined-700 bg-[#0c0d10]">
        {user ? (
          <div className="flex items-center gap-3 p-3 rounded-xl border border-machined-700 bg-machined-800/50 shadow-inner group transition-all hover:border-machined-500">
            {/* Avatar */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-dim to-cyan flex items-center justify-center text-machined-900 font-bold shadow-md">
              {user.name.charAt(0).toUpperCase()}
            </div>
            
            {/* User Info */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <p className="text-sm font-bold text-machined-100 truncate">{user.name}</p>
              <p className="text-xs text-machined-400 truncate">{user.email}</p>
            </div>

            {/* Logout Button */}
            <button 
              onClick={handleLogout}
              className="text-machined-500 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-500/10"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        ) : (
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-sm font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        )}
      </div>
    </div>
  );
}
