'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profile.service';
import SkillList from '../../components/profile/SkillList';

export default function ProfilePage() {
  const { user, setUser } = useAuth();
  
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

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

  if (!user) return null; // Middleware handles redirection

  return (
    <div className="min-h-screen bg-machined-900 text-machined-100 p-6 sm:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] rounded-full bg-cyan-dim blur-[120px] pointer-events-none" />
      
      <div className="max-w-4xl mx-auto relative z-10">
        <h1 className="text-4xl font-sans font-bold text-transparent bg-clip-text bg-gradient-to-r from-machined-100 to-machined-400 mb-8">
          User Profile
        </h1>

        <div className="bg-machined-800/80 backdrop-blur-xl border border-machined-600 rounded-2xl shadow-2xl overflow-hidden p-8">
          
          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm font-mono flex items-center">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 px-4 py-3 rounded-lg mb-6 text-sm font-mono flex items-center">
              <span>Profile updated successfully!</span>
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Photo Section */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-32 h-32 rounded-full border-4 border-machined-600 overflow-hidden shadow-lg shadow-cyan/10 bg-machined-700 flex items-center justify-center relative group">
                {avatar ? (
                  <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold text-machined-500">{name.charAt(0).toUpperCase()}</span>
                )}
                {isEditing && (
                  <div className="absolute inset-0 bg-machined-900/60 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-xs font-mono text-cyan">Edit URL</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Section */}
            <div className="flex-grow w-full">
              {!isEditing ? (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-machined-100">{user.name}</h2>
                    <p className="text-sm font-mono text-cyan mt-1">{user.email}</p>
                  </div>
                  <div>
                    <h3 className="text-xs font-mono text-machined-400 uppercase tracking-wider mb-2">Biography</h3>
                    <p className="text-machined-100 text-sm leading-relaxed bg-machined-900/50 p-4 rounded-lg border border-machined-600/50 min-h-[100px]">
                      {user.bio || 'No biography provided yet. Edit your profile to tell us about yourself.'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setName(user.name);
                      setBio(user.bio || '');
                      setAvatar(user.avatar || '');
                    }}
                    className="bg-machined-700 hover:bg-machined-600 text-machined-100 font-mono text-sm py-2 px-6 rounded-lg transition-colors border border-machined-500"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-machined-400 block" htmlFor="avatar">
                      Avatar URL
                    </label>
                    <input
                      id="avatar"
                      type="url"
                      value={avatar}
                      onChange={(e) => setAvatar(e.target.value)}
                      className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-2 text-machined-100 placeholder-machined-500 focus:outline-none focus:border-cyan transition-colors"
                      placeholder="https://example.com/avatar.jpg"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-machined-400 block" htmlFor="name">
                      Display Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-2 text-machined-100 placeholder-machined-500 focus:outline-none focus:border-cyan transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-mono text-machined-400 block" htmlFor="bio">
                      Biography
                    </label>
                    <textarea
                      id="bio"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      rows={4}
                      className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-2 text-machined-100 placeholder-machined-500 focus:outline-none focus:border-cyan transition-colors resize-none"
                      placeholder="Tell us about your skills and experience..."
                    />
                  </div>
                  <div className="flex gap-4">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-2 px-6 rounded-lg transition-all shadow-[0_0_10px_rgba(12,189,232,0.2)] hover:shadow-[0_0_15px_rgba(12,189,232,0.4)] disabled:opacity-70"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setName(user.name);
                        setBio(user.bio || '');
                        setAvatar(user.avatar || '');
                        setError('');
                      }}
                      className="bg-transparent hover:bg-machined-700 text-machined-400 hover:text-machined-100 font-mono py-2 px-6 rounded-lg transition-colors border border-machined-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
        
        <SkillList userId={user._id} />
      </div>
    </div>
  );
}
