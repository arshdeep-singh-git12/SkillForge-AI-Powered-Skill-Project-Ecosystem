import React, { useState } from 'react';

interface CreateTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (team: any) => Promise<void>;
}

export default function CreateTeamModal({ isOpen, onClose, onSubmit }: CreateTeamModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [requiredSkills, setRequiredSkills] = useState('');
  const [maxMembers, setMaxMembers] = useState(4);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ 
      name, 
      description, 
      requiredSkills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
      maxMembers 
    });
    setLoading(false);
    
    // Reset form
    setName('');
    setDescription('');
    setRequiredSkills('');
    setMaxMembers(4);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-100 rounded-[24px] p-8 w-full max-w-lg shadow-[0_12px_40px_rgb(0,0,0,0.12)] relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Create a New Team</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Team Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. Frontend Wizards"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Team Description & Goals</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors resize-none"
              placeholder="What are you building? Who are you looking for?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Required Skills (comma separated)</label>
            <input 
              type="text" 
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="React, Python, UI/UX"
            />
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-sm font-medium text-gray-700 block">Max Members</label>
            <div className="flex items-center gap-4">
              <input 
                type="range" 
                min="2" 
                max="10" 
                value={maxMembers}
                onChange={(e) => setMaxMembers(Number(e.target.value))}
                className="flex-1 accent-cyan h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="w-12 h-10 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200 text-[#0cbde8] font-bold shadow-sm">
                {maxMembers}
              </div>
            </div>
          </div>
          
          <div className="pt-6 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 text-gray-500 hover:text-gray-900 font-bold text-sm transition-colors bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !name || !description}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Launch Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
