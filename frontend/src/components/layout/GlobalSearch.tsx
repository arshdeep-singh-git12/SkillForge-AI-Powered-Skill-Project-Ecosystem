'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import api from '../../services/api';

export default function GlobalSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ users: [], projects: [] });
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (query.trim().length < 2) {
        setResults({ users: [], projects: [] });
        return;
      }
      setLoading(true);
      try {
        const { data } = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(data);
        setIsOpen(true);
      } catch (error) {
        console.error('Search failed', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleUserClick = (id: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/profile/${id}`);
  };

  const handleProjectClick = (url: string) => {
    setIsOpen(false);
    if (url) window.open(url, '_blank');
  };

  return (
    <div className="relative w-full max-w-md mx-4" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-gray-400 group-focus-within:text-[#0cbde8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            if (e.target.value.length >= 2) setIsOpen(true);
          }}
          onFocus={() => {
            if (query.length >= 2) setIsOpen(true);
          }}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 focus:border-[#0cbde8] focus:ring-1 focus:ring-[#0cbde8] rounded-full text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm"
          placeholder="Search profiles, skills, projects..."
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
            <div className="w-4 h-4 border-2 border-[#0cbde8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isOpen && (results.users.length > 0 || results.projects.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] max-h-[70vh] overflow-y-auto animate-fade-in">
          
          {results.users.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">People</div>
              {results.users.map((u: any) => (
                <button
                  key={u._id}
                  onClick={() => handleUserClick(u._id)}
                  className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden flex items-center justify-center">
                    {u.avatar ? <img src={u.avatar} className="w-full h-full object-cover" /> : <span className="font-bold text-gray-500 font-sans">{u.name.charAt(0)}</span>}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm font-sans">{u.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 font-sans">{u.bio || 'SkillForge User'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.users.length > 0 && results.projects.length > 0 && (
            <div className="h-px bg-gray-100 mx-4 my-1"></div>
          )}

          {results.projects.length > 0 && (
            <div className="p-2">
              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider font-sans">Projects</div>
              {results.projects.map((p: any) => (
                <button
                  key={p._id}
                  onClick={() => handleProjectClick(p.githubUrl)}
                  className="w-full text-left flex items-center gap-3 p-3 hover:bg-gray-50 rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0 flex items-center justify-center border border-blue-100">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path></svg>
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="font-bold text-gray-900 text-sm truncate font-sans">{p.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 font-sans">by {p.owner?.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {isOpen && query.length >= 2 && results.users.length === 0 && results.projects.length === 0 && !loading && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 p-6 text-center z-[100]">
          <p className="text-gray-500 text-sm font-sans">No results found for "{query}"</p>
        </div>
      )}
    </div>
  );
}
