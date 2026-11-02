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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-100 rounded-[24px] p-8 w-full max-w-md shadow-[0_12px_40px_rgb(0,0,0,0.12)] relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Add New Skill</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Skill Name</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. Python, React"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Category</label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
            >
              <option value="Language">Language</option>
              <option value="Framework">Framework</option>
              <option value="Tool">Tool</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          <div className="space-y-2 pt-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium text-gray-700 block">Proficiency</label>
              <span className="text-cyan font-bold">{proficiency}%</span>
            </div>
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-cyan h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
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
              disabled={loading || !name}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
