'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { likeProject } from '../../../services/project.service';

export default function PublicProfilePage() {
  const params = useParams();
  const { user: currentUser } = useAuth();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('NONE'); // NONE, PENDING, CONNECTED
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get(`/users/public/${params.id}`);
        setProfileUser(data.user);
        setProjects(data.projects);

        // Determine connection status
        if (currentUser) {
          if (data.user.connections?.includes(currentUser._id)) {
            setConnectionStatus('CONNECTED');
          } else if (data.user.connectionRequests?.includes(currentUser._id)) {
            setConnectionStatus('PENDING');
          } else {
            setConnectionStatus('NONE');
          }
        }
      } catch (error) {
        console.error('Failed to load profile', error);
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchProfile();
  }, [params.id, currentUser]);

  const handleConnect = async () => {
    setConnecting(true);
    try {
      await api.post(`/users/${params.id}/connect`);
      setConnectionStatus('PENDING');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send request');
    } finally {
      setConnecting(false);
    }
  };

  const handleLike = async (projectId: string) => {
    if (!currentUser) return;
    try {
      const res = await likeProject(projectId);
      setProjects(projects.map(p => 
        p._id === projectId ? { ...p, likes: res.likes } : p
      ));
    } catch (error) {
      console.error('Failed to like project', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-[#0cbde8] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="p-8 text-center text-gray-500">
        User not found.
      </div>
    );
  }

  const isMe = currentUser?._id === profileUser._id;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto">
      {/* Profile Header */}
      <div className="interior-panel overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-[#0cbde8] to-[#1e212b] relative"></div>
        <div className="px-8 pb-8 relative">
          <div className="absolute -top-16 left-8">
            <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center overflow-hidden shadow-xl">
              {profileUser.avatar ? (
                <img src={profileUser.avatar} className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-400">{profileUser.name.charAt(0)}</span>
              )}
            </div>
          </div>
          
          <div className="pt-24 flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{profileUser.name}</h1>
              <p className="text-gray-500 mt-2 max-w-2xl">{profileUser.bio || 'No bio provided.'}</p>
              
              <div className="mt-3 flex flex-wrap gap-2">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-700 bg-gray-50/80 border border-gray-100 rounded-lg px-3 py-1.5 w-fit shadow-sm">
                  <svg className="w-4 h-4 text-[#0cbde8]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                  {profileUser.connections?.length || 0} Forge Mate{profileUser.connections?.length !== 1 ? 's' : ''}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-100 rounded-lg text-sm font-bold text-red-600 shadow-sm cursor-default transition-colors w-fit">
                  <svg className="w-4 h-4 text-red-500 fill-current" viewBox="0 0 24 24"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L12 8.343l3.172-3.171a4 4 0 115.656 5.656L12 21.343l-8.828-8.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                  {profileUser.totalLikes || 0} Total Likes
                </div>
              </div>
              
              <div className="flex gap-3 mt-5">
                {profileUser.githubUrl && (
                  <a href={profileUser.githubUrl} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium text-sm rounded-xl transition-all shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                    GitHub
                  </a>
                )}
                {profileUser.linkedinUrl && (
                  <a href={profileUser.linkedinUrl} target="_blank" rel="noopener noreferrer" 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-sm rounded-xl transition-all border border-blue-100 shadow-sm">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                    LinkedIn
                  </a>
                )}
              </div>
            </div>
            
            {!isMe && (
              <div>
                {connectionStatus === 'NONE' && (
                  <button 
                    onClick={handleConnect}
                    disabled={connecting}
                    className="px-6 py-2 bg-[#0cbde8] hover:bg-[#0aa6cc] text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2"
                  >
                    {connecting ? 'Sending...' : 'Forge'}
                  </button>
                )}
                {connectionStatus === 'PENDING' && (
                  <button disabled className="px-6 py-2 bg-gray-100 text-gray-500 font-bold rounded-xl cursor-not-allowed">
                    Pending
                  </button>
                )}
                {connectionStatus === 'CONNECTED' && (
                  <div className="flex gap-2">
                    <button disabled className="px-6 py-2 bg-green-50 text-green-700 font-bold rounded-xl border border-green-200">
                      Forged
                    </button>
                    <a href="/messages" className="px-6 py-2 bg-[#0cbde8] hover:bg-[#0aa6cc] text-white font-bold rounded-xl shadow-lg transition-colors flex items-center gap-2">
                      Message
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Skills */}
      {profileUser.skills?.length > 0 && (
        <div>
          <h2 className="text-xl interior-heading mb-4 px-2">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {profileUser.skills.map((skill: any) => (
              <div key={skill._id} className="px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm flex items-center gap-2">
                {skill.iconUrl && <img src={skill.iconUrl} className="w-5 h-5" />}
                <span className="font-bold text-gray-700 text-sm">{skill.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      <div>
        <h2 className="text-xl interior-heading mb-4 px-2">Portfolio Projects</h2>
        {projects.length === 0 ? (
          <div className="interior-panel p-8 text-center">
            <p className="text-gray-500">No projects uploaded yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((p: any) => (
              <div key={p._id} className="interior-panel p-6">
                <h3 className="font-bold text-lg text-gray-900 mb-2">{p.title}</h3>
                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-2 mb-6">
                  {p.techStack.slice(0, 3).map((tech: string, i: number) => (
                    <span key={i} className="text-xs px-2 py-1 bg-gray-100 text-gray-600 rounded-lg">{tech}</span>
                  ))}
                  {p.techStack.length > 3 && <span className="text-xs px-2 py-1 text-gray-400">+{p.techStack.length - 3} more</span>}
                </div>
                <div className="flex justify-between items-center mt-auto border-t border-gray-100 pt-3">
                  {p.githubUrl ? (
                    <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-bold text-gray-900 hover:underline flex items-center gap-1">
                      View Source
                    </a>
                  ) : <div></div>}
                  
                  <button 
                    onClick={() => handleLike(p._id)}
                    className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg transition-colors hover:bg-red-50 text-gray-600 -mr-2"
                    title="Like this project"
                  >
                    <svg 
                      className={`w-5 h-5 transition-colors ${p.likes?.includes(currentUser?._id) ? 'fill-red-500 text-red-500' : 'fill-transparent text-gray-400 hover:text-red-400'}`} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <span className="text-sm font-bold">{p.likes?.length || 0}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
