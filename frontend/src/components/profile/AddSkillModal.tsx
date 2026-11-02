import React, { useState } from 'react';

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (_skill: { name: string; proficiency: number; category: string }) => Promise<void>;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative border border-gray-100 animate-fadeIn">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Add Technical Skill</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., React, TypeScript, Docker"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan text-gray-900 bg-white"
            >
              <option value="Language">Programming Language</option>
              <option value="Framework">Framework / Library</option>
              <option value="Cloud Computing">Cloud & DevOps</option>
              <option value="Database">Database & Storage</option>
              <option value="Technology">Tools & Technology</option>
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Proficiency Level</label>
              <span className="text-sm font-bold text-cyan">{proficiency}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={proficiency}
              onChange={(e) => setProficiency(Number(e.target.value))}
              className="w-full accent-cyan"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Advanced</span>
              <span>Expert</span>
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
