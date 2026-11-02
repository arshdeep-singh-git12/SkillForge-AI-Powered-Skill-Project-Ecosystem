'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { updateProfile } from '../../../services/profile.service';

export default function SettingsPage() {
  const { user, setUser } = useAuth();
  
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarStr, setAvatarStr] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setBio(user.bio || '');
      setAvatarStr(user.avatar || '');
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (limit to 5MB to be safe for JSON payload)
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image is too large. Please select an image under 5MB.' });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setAvatarStr(event.target.result as string);
        setMessage(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);
    
    try {
      const updatedUser = await updateProfile({ name, bio, avatar: avatarStr });
      setUser(updatedUser);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Failed to update profile', error);
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="interior-card bg-white shadow-sm border border-gray-100 p-8 rounded-[24px]">
        <h1 className="text-3xl interior-heading mb-2">Account Settings</h1>
        <p className="interior-text font-sans text-sm text-gray-500">Update your personal details and how others see you on SkillForge.</p>
      </div>

      <div className="interior-card bg-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 rounded-[24px] overflow-hidden">
        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
          {message && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 text-sm font-medium ${
              message.type === 'success' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
            }`}>
              {message.type === 'success' ? (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              )}
              {message.text}
            </div>
          )}

          {/* Profile Picture Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Profile Picture</h3>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 relative shadow-sm">
                {avatarStr ? (
                  <img src={avatarStr} alt="Profile preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-cyan text-white text-3xl font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                >
                  Upload New Photo
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/png, image/jpeg, image/webp" 
                  className="hidden" 
                />
                <p className="text-xs text-gray-500 font-sans">
                  Recommended: Square image (JPG, PNG, or WebP), max 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Personal Info Section */}
          <div className="space-y-5 pt-4">
            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2">Personal Information</h3>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block" htmlFor="name">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full max-w-lg bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 block" htmlFor="bio">
                Bio / About Me
              </label>
              <textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={5}
                maxLength={500}
                className="w-full max-w-2xl bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors resize-none"
                placeholder="Tell the community about yourself..."
              ></textarea>
              <div className="text-right text-xs text-gray-400 max-w-2xl">
                {bio.length} / 500 characters
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-8 rounded-xl flex items-center transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving Changes...
                </span>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
          
        </form>
      </div>
    </div>
  );
}
