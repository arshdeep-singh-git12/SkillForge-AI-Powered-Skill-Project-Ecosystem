import React, { useState } from 'react';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (skill: { name: string; proficiency: number; category: string }) => Promise<void>;
}

export default function AddSkillModal({ isOpen, onClose, onAdd }: AddSkillModalProps) {
  const [name, setName] = useState('');
  const [proficiency, setProficiency] = useState(50);
  const [category, setCategory] = useState('Language');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onAdd({ name, proficiency, category });
    setLoading(false);
    setName('');
    setProficiency(50);
    setCategory('Language');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-machined-900/80 backdrop-blur-sm p-4">
      <div className="bg-machined-800 border border-machined-600 rounded-2xl p-6 w-full max-w-md shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-machined-400 hover:text-cyan transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-xl font-bold text-machined-100 mb-6">Add New Skill</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Skill Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-2 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. Python, React"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-2 text-machined-100 focus:border-cyan focus:outline-none"
            >
              <option value="Language">Language</option>
              <option value="Framework">Framework</option>
              <option value="Tool">Tool</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-mono text-machined-400">Proficiency</label>
              <span className="text-cyan font-bold">{proficiency}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-cyan h-2 bg-machined-900 rounded-lg appearance-none cursor-pointer"
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-machined-400 hover:text-machined-100 font-mono text-sm transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading || !name}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold px-6 py-2 rounded-lg transition-all shadow-[0_0_10px_rgba(12,189,232,0.3)] disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
