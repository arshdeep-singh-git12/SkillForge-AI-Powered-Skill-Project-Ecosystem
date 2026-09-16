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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-machined-900/80 backdrop-blur-md p-4">
      <div className="bg-machined-800 border border-machined-600 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-machined-400 hover:text-cyan transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-machined-100 mb-6">Create a New Team</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Team Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. Frontend Wizards"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Team Description & Goals</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none resize-none"
              placeholder="What are you building? Who are you looking for?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Required Skills (comma separated)</label>
            <input 
              type="text" 
              value={requiredSkills}
              onChange={(e) => setRequiredSkills(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="React, Python, UI/UX"
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-machined-400">Max Members</label>
              <span className="text-cyan font-bold">{maxMembers}</span>
            </div>
            <input 
              type="range" 
              min="2" 
              max="10" 
              value={maxMembers}
              onChange={(e) => setMaxMembers(Number(e.target.value))}
              className="w-full accent-cyan h-2 bg-machined-900 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="pt-6 flex justify-end gap-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-3 text-machined-400 hover:text-machined-100 font-mono text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !name || !description}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Launch Team'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
