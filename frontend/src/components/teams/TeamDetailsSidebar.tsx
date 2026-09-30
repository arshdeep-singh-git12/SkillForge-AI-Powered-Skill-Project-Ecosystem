'use client';

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface TeamDetailsSidebarProps {
  team: any;
  isOpen: boolean;
  onClose: () => void;
  onJoinRequest: (teamId: string, formData: any) => Promise<void>;
  isMember: boolean;
  isFull: boolean;
  isOwner?: boolean;
  isClosed?: boolean;
  onCloseTeam?: (teamId: string) => void;
}

export default function TeamDetailsSidebar({ team, isOpen, onClose, onJoinRequest, isMember, isFull, isOwner, isClosed, onCloseTeam }: TeamDetailsSidebarProps) {
  const { user } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ mobile: '' });
  const [loading, setLoading] = useState(false);

  if (!isOpen || !team) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onJoinRequest(team._id, { 
        mobile: formData.mobile, 
        name: user?.name || 'Unknown', 
        email: user?.email || 'Unknown' 
      });
      setShowForm(false);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Sidebar - 40% width */}
      <div className="fixed inset-y-0 right-0 w-full sm:w-[40%] bg-white dark:bg-gray-900 shadow-2xl z-[60] flex flex-col transform transition-transform duration-300 border-l border-gray-100 dark:border-gray-800 overflow-y-auto">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-gray-900 sticky top-0 z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Team Requirements</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-900 dark:hover:text-white rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="p-8 flex-1">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{team.name}</h1>
            <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{team.description}</p>
          </div>

          <div className="mb-10 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800/30">
            <h3 className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-wider mb-4 font-sans">Required Skills & Expectations</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {team.requiredSkills?.map((skill: string, idx: number) => (
                <span key={idx} className="px-4 py-2 bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 text-sm font-medium rounded-xl shadow-sm">
                  {skill}
                </span>
              ))}
              {(!team.requiredSkills || team.requiredSkills.length === 0) && (
                <span className="text-gray-500 dark:text-gray-400 text-sm italic bg-white dark:bg-gray-800 px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700">Any skills welcome</span>
              )}
            </div>
            <p className="text-sm text-blue-800/80 dark:text-blue-200/80 mt-4 leading-relaxed">
              Please read these requirements carefully. The team creator is looking for dedicated individuals who can contribute effectively to the project. Ensure you match the required skillset before applying.
            </p>
          </div>

          <div className="mb-8 flex items-center justify-between border-t border-b border-gray-100 dark:border-gray-800 py-6">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400 font-sans mb-1">Current Capacity</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{team.members.length} <span className="text-lg text-gray-400 font-normal">/ {team.maxMembers}</span></p>
            </div>
            <div className="flex gap-2">
              {isClosed && <div className="bg-gray-500 text-white font-bold px-4 py-2 rounded-lg text-sm">TEAM CLOSED</div>}
              {isFull && !isClosed && <div className="bg-red-100 text-red-700 font-bold px-4 py-2 rounded-lg text-sm">TEAM FULL</div>}
              {isMember && <div className="bg-gray-900 text-white font-bold px-4 py-2 rounded-lg text-sm">MEMBER</div>}
            </div>
          </div>

          {isOwner && !isClosed && (
            <button 
              onClick={() => onCloseTeam && onCloseTeam(team._id)}
              className="w-full py-4 mb-4 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl font-bold text-lg transition-colors"
            >
              Close Team (Stop Recruiting)
            </button>
          )}

          {!showForm && !isMember && !isFull && !isOwner && !isClosed && (
            <button 
              onClick={() => setShowForm(true)}
              className="w-full py-4 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
            >
              I agree to the requirements - Join Team
            </button>
          )}

          {showForm && (
            <div className="mt-8 bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 animate-fade-in">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Application Form</h3>
              
              <div className="mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">Applying As</p>
                <p className="text-gray-900 dark:text-white font-medium">{user?.name}</p>
                <p className="text-gray-500 text-sm">{user?.email}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Mobile Number</label>
                  <input 
                    type="tel" 
                    required 
                    value={formData.mobile}
                    onChange={e => setFormData({ mobile: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-gray-900 dark:focus:ring-white focus:border-transparent outline-none transition-shadow"
                    placeholder="+1 234 567 8900"
                  />
                </div>
                
                <div className="flex gap-3 pt-4">
                  <button 
                    type="button"
                    onClick={() => setShowForm(false)}
                    className="flex-1 py-3 px-4 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    disabled={loading}
                    className="flex-[2] py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-xl transition-all disabled:opacity-70 flex justify-center items-center"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Submit Request'
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
