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
    <div className="relative w-full max-w-md" ref={searchRef}>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-gray-400 group-focus-within:text-[#0cbde8] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 focus:border-[#0cbde8] focus:ring-1 focus:ring-[#0cbde8] rounded-full text-sm text-gray-900 placeholder-gray-400 focus:outline-none transition-all shadow-sm"
          placeholder="Search profiles, skills, projects..."
        />
        {loading && (
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none">
            <div className="w-3.5 h-3.5 border-2 border-[#0cbde8] border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
      </div>

      {isOpen && (results.users.length > 0 || results.projects.length > 0) && (
        <div className="absolute top-full mt-2 w-full bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-[100] max-h-[70vh] overflow-y-auto animate-fade-in">
          
          {results.users.length > 0 && (
            <div className="p-2">
              <span className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1 block">People</span>
              {results.users.map((u: any) => (
                <button
                  key={u._id}
                  onClick={() => handleUserClick(u._id)}
                  className="w-full flex items-center gap-3 p-2.5 hover:bg-gray-50 rounded-xl transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-full bg-cyan/10 text-cyan font-bold flex items-center justify-center text-xs overflow-hidden">
                    {u.avatar ? <img src={u.avatar} alt="" className="w-full h-full object-cover" /> : u.name[0]}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 leading-none">{u.name}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{u.bio || 'SkillForge Developer'}</p>
                  </div>
                </button>
              ))}
            </div>
          )}

          {results.projects.length > 0 && (
            <div className="p-2 border-t border-gray-50">
              <span className="text-[10px] uppercase font-bold text-gray-400 px-3 py-1 block">Projects</span>
              {results.projects.map((p: any) => (
                <button
                  key={p._id}
                  onClick={() => handleProjectClick(p.liveUrl || p.githubUrl)}
                  className="w-full flex items-center justify-between p-2.5 hover:bg-gray-50 rounded-xl transition-colors text-left group"
                >
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 group-hover:text-cyan transition-colors">{p.title}</h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{p.description}</p>
                  </div>
                  <svg className="w-4 h-4 text-gray-300 group-hover:text-cyan -rotate-45 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              ))}
            </div>
          )}

        </div>
      )}
    </div>
  );
}
