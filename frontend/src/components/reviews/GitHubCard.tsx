'use client';

import React, { useEffect, useState } from 'react';
import { getRepoStats } from '../../services/github.service';

interface GitHubCardProps {
  repoUrl: string;
}

export default function GitHubCard({ repoUrl }: GitHubCardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!repoUrl) return;

    const fetchStats = async () => {
      try {
        const data = await getRepoStats(repoUrl);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch GitHub stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [repoUrl]);

  if (!repoUrl) return null;

  if (loading) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center animate-pulse h-20">
        <span className="text-gray-500 font-medium text-sm">Loading GitHub stats...</span>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center h-20">
        <span className="text-gray-500 font-medium text-sm">Failed to load repository data.</span>
      </div>
    );
  }

  return (
    <a 
      href={stats.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:shadow-md transition-all rounded-xl p-4 flex items-center justify-between group"
    >
      <div className="flex items-center gap-3">
        <div className="bg-gray-100 p-2 rounded-lg group-hover:bg-cyan/10 transition-colors">
          <svg className="w-6 h-6 text-gray-500 group-hover:text-cyan-600" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path></svg>
        </div>
        <div>
          <h4 className="text-gray-900 font-bold text-sm leading-none mb-1">{stats.name}</h4>
          <p className="text-gray-500 font-medium text-xs">{stats.owner}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 text-gray-500 group-hover:text-yellow-600 transition-colors">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
          <span className="text-xs font-bold">{stats.stars}</span>
        </div>
        <div className="flex items-center gap-1 text-gray-500 group-hover:text-cyan-600 transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path></svg>
          <span className="text-xs font-bold">{stats.forks}</span>
        </div>
      </div>
    </a>
  );
}
