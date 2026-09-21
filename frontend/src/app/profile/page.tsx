'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profile.service';
import SkillList from '../../components/profile/SkillList';
import { getUserProjects } from '../../services/project.service';
import { getCertifications, uploadLinkedinPdf } from '../../services/certification.service';
import { useRef } from 'react';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [activeTab, setActiveTab] = useState('skills'); // 'skills', 'projects', 'certificates'
  const [projects, setProjects] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setBio(user.bio || '');
      setAvatar(user.avatar || '');
    }
  }, [user]);

  useEffect(() => {
    const loadTabData = async () => {
      if (!user) return;
      setLoadingData(true);
      try {
        if (activeTab === 'projects' && projects.length === 0) {
          const data = await getUserProjects(user._id);
          setProjects(data);
        } else if (activeTab === 'certificates' && certificates.length === 0) {
          const data = await getCertifications();
          setCertificates(data);
        }
      } catch (err) {
        console.error('Failed to load tab data', err);
      } finally {
        setLoadingData(false);
      }
    };
    loadTabData();
  }, [activeTab, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const updatedUser = await updateProfile({ name, bio, avatar });
      setUser(updatedUser);
      setSuccess(true);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);
    setError('');
    setSuccess(false);

    try {
      const data = await uploadLinkedinPdf(file);
      setSuccess(true);
      // Reload certificates
      const newCerts = await getCertifications();
      setCertificates(newCerts);
      alert(data.message);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to parse LinkedIn PDF');
    } finally {
      setIsUploadingPdf(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-5xl mx-auto font-sans">
      <h1 className="text-3xl interior-heading mb-1 text-center md:text-left">
        User Profile
      </h1>

      <div className="interior-panel p-8 bg-white shadow-sm border border-gray-100">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm flex items-center">
            <span>Profile updated successfully!</span>
          </div>
        )}

        <div className="flex flex-col md:flex-row gap-8 items-start">
          {/* Photo Section */}
          <div className="flex-shrink-0 flex flex-col items-center mx-auto md:mx-0">
            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-md bg-gray-100 flex items-center justify-center relative group">
              {avatar ? (
                <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-gray-400">{name?.charAt(0).toUpperCase()}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold text-white">Edit URL</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-grow w-full">
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-sm text-gray-500 font-medium mt-1">{user.email}</p>
                </div>
                
                {/* Social Links Display */}
                {(user.githubUrl || user.linkedinUrl) && (
                  <div className="flex gap-4">
                    {user.githubUrl && (
                      <a href={user.githubUrl} target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1 text-sm font-medium">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>
                        GitHub
                      </a>
                    )}
                    {user.linkedinUrl && (
                      <a href={user.linkedinUrl} target="_blank" rel="noreferrer" className="text-[#0a66c2] hover:text-[#004182] transition-colors flex items-center gap-1 text-sm font-medium">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                        LinkedIn
                      </a>
                    )}
                  </div>
                )}

                <div>
                  <h3 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Biography</h3>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-5 rounded-[16px] border border-gray-100 min-h-[100px]">
                    {user.bio || 'No biography provided yet. Edit your profile to tell us about yourself.'}
                  </p>
                </div>
                <button
                  onClick={() => setIsEditing(true)}
                  className="interior-pill bg-white shadow-sm border border-gray-200"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors shadow-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 block uppercase tracking-wide">
                    Biography
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors resize-none shadow-sm"
                  />
                </div>
                <div className="flex gap-4">
                  <button type="submit" disabled={loading} className="interior-pill interior-pill-active shadow-md disabled:opacity-70">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button type="button" onClick={() => setIsEditing(false)} className="interior-pill bg-white border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm">
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('skills')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm ${
              activeTab === 'skills' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Skills
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm ${
              activeTab === 'projects' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Portfolio Projects
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-sm ${
              activeTab === 'certificates' ? 'border-gray-900 text-gray-900' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Certificates
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="min-h-[300px]">
        {activeTab === 'skills' && <SkillList userId={user._id} />}
        
        {activeTab === 'projects' && (
          <div>
            {loadingData ? (
              <div className="text-center py-10 text-gray-500">Loading projects...</div>
            ) : projects.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No projects added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project._id} className="interior-panel p-6 flex flex-col hover:-translate-y-1 transition-transform">
                    <h3 className="font-bold text-lg text-gray-900">{project.title}</h3>
                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {project.techStack?.map((tech: string, i: number) => (
                        <span key={i} className="px-2 py-1 bg-gray-100 text-xs font-medium rounded-md text-gray-600">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Your Certificates</h2>
              <div>
                <input 
                  type="file" 
                  accept=".pdf" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handlePdfUpload}
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploadingPdf}
                  className="interior-pill bg-[#0a66c2] text-white hover:bg-[#004182] border-transparent text-sm disabled:opacity-70 flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                  {isUploadingPdf ? 'Parsing PDF...' : 'Sync LinkedIn via PDF'}
                </button>
              </div>
            </div>
            {loadingData ? (
              <div className="text-center py-10 text-gray-500">Loading certificates...</div>
            ) : certificates.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">No certificates added yet.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map(cert => (
                  <div key={cert._id} className="interior-panel p-6 flex flex-col hover:-translate-y-1 transition-transform">
                    <h3 className="font-bold text-lg text-gray-900">{cert.title}</h3>
                    <p className="text-gray-500 text-sm">Issued by {cert.issuer}</p>
                    <p className="text-gray-400 text-xs mt-1">Earned: {new Date(cert.dateEarned).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
