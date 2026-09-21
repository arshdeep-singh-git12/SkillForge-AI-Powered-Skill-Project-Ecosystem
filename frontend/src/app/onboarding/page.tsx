'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/profile.service';
import Logo from '../../components/ui/Logo';

const PRESET_AVATARS = [
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Leo',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Zoe',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Nala',
  'https://api.dicebear.com/7.x/avataaars/svg?seed=Max',
];

export default function OnboardingPage() {
  const { user, loading: authLoading, setUser } = useAuth();
  const router = useRouter();
  
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [bio, setBio] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If auth is loaded and there is no user, redirect to login
    if (!authLoading && !user) {
      router.push('/login');
    }
    // If user already has an avatar and bio, they don't need onboarding
    if (!authLoading && user && user.avatar && user.bio) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const updatedUser = await updateProfile({ avatar: selectedAvatar, bio, githubUrl, linkedinUrl });
      // Update local auth context
      setUser(updatedUser);
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Failed to update profile during onboarding', error);
      const errorMsg = error.response?.data?.message || error.message || 'Failed to save profile. Please try again.';
      alert('Error: ' + errorMsg);
      setIsSubmitting(false);
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-cyan rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500 font-sans">Loading your account...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-gray-900 flex flex-col items-center py-12 px-4 relative font-sans">
      <div className="relative z-10 w-full max-w-2xl my-4">
        {/* Brand Header */}
        <div className="text-center mb-8 flex justify-center">
          <Logo darkText={true} />
        </div>

        <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_8px_30px_rgb(0,0,0,0.04)] overflow-hidden">
          <div className="p-8 sm:p-12">
            <div className="text-center mb-10">
              <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
                Welcome, {user.name.split(' ')[0]}!
              </h1>
              <p className="text-gray-500 text-sm">
                Let's finish setting up your profile so you can stand out in the community.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* Avatar Selection */}
              <div>
                <label className="text-sm font-medium text-gray-900 block mb-4 text-center">
                  Choose your Avatar
                </label>
                <div className="flex flex-wrap justify-center gap-4">
                  {PRESET_AVATARS.map((avatarUrl, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedAvatar(avatarUrl)}
                      className={`relative w-20 h-20 rounded-full overflow-hidden border-[3px] transition-all duration-200 ${
                        selectedAvatar === avatarUrl 
                          ? 'border-cyan shadow-[0_0_15px_rgba(63,227,255,0.4)] scale-110' 
                          : 'border-transparent hover:border-gray-200 hover:scale-105'
                      }`}
                    >
                      <img src={avatarUrl} alt={`Avatar ${index}`} className="w-full h-full object-cover bg-gray-50" />
                      {selectedAvatar === avatarUrl && (
                        <div className="absolute inset-0 bg-cyan/10 rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Bio Textarea */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block" htmlFor="bio">
                  Tell us a bit about yourself
                </label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  rows={4}
                  maxLength={500}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors shadow-sm resize-none"
                  placeholder="I am a passionate software engineer focused on building robust scalable backends and beautiful frontend interfaces..."
                ></textarea>
                <div className="text-right text-xs text-gray-400">
                  {bio.length} / 500 characters
                </div>
              </div>

              {/* GitHub Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block" htmlFor="githubUrl">
                  GitHub Profile URL
                </label>
                <div className="relative">
                  <input
                    id="githubUrl"
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors shadow-sm"
                    placeholder="https://github.com/username"
                  />
                </div>
              </div>

              {/* LinkedIn Link */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 block" htmlFor="linkedinUrl">
                  LinkedIn Profile URL
                </label>
                <div className="relative">
                  <input
                    id="linkedinUrl"
                    type="url"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors shadow-sm"
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !bio}
                className="w-full mt-4 bg-gray-900 hover:bg-gray-800 text-white font-medium py-4 px-4 rounded-xl flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg text-lg"
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </span>
                ) : (
                  'Complete Profile & Enter Dashboard →'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
