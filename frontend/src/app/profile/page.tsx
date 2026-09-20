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
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      <h1 className="text-3xl interior-heading mb-1 text-center md:text-left">
        User Profile
      </h1>

      <div className="interior-panel p-8 bg-white shadow-sm border border-gray-100">
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm font-sans flex items-center">
            <span>{error}</span>
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 text-sm font-sans flex items-center">
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
                <span className="text-4xl font-bold text-gray-400">{name.charAt(0).toUpperCase()}</span>
              )}
              {isEditing && (
                <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs font-bold font-sans text-white">Edit URL</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Section */}
          <div className="flex-grow w-full">
            {!isEditing ? (
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 font-sans">{user.name}</h2>
                  <p className="text-sm font-sans text-gray-500 font-medium mt-1">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-[11px] font-bold font-sans text-gray-400 uppercase tracking-wider mb-2">Biography</h3>
                  <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-5 rounded-[16px] border border-gray-100 min-h-[100px] font-sans">
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
                  className="interior-pill bg-white shadow-sm border border-gray-200"
                >
                  Edit Profile
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold font-sans text-gray-500 block uppercase tracking-wide" htmlFor="avatar">
                    Avatar URL
                  </label>
                  <input
                    id="avatar"
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors shadow-sm font-sans"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold font-sans text-gray-500 block uppercase tracking-wide" htmlFor="name">
                    Display Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors shadow-sm font-sans"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold font-sans text-gray-500 block uppercase tracking-wide" htmlFor="bio">
                    Biography
                  </label>
                  <textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={4}
                    className="w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors resize-none shadow-sm font-sans"
                    placeholder="Tell us about your skills and experience..."
                  />
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="interior-pill interior-pill-active shadow-md disabled:opacity-70"
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
                    className="interior-pill bg-white border border-gray-200 text-gray-500 hover:text-gray-900 shadow-sm"
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
  );
}
