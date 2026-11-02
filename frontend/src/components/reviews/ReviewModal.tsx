import React, { useState, useEffect } from 'react';
import { getProjects } from '../../services/project.service';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (review: any) => Promise<void>;
}

export default function ReviewModal({ isOpen, onClose, onSubmit }: ReviewModalProps) {
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState('');
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [skillEndorsements, setSkillEndorsements] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      getProjects().then(data => {
        setProjects(data);
        if (data.length > 0 && !projectId) {
          setProjectId(data[0]._id);
        }
      }).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ 
      projectId, 
      rating,
      title,
      content,
      skillEndorsements: skillEndorsements.split(',').map(s => s.trim()).filter(Boolean)
    });
    setLoading(false);
    
    // Reset form
    setTitle('');
    setContent('');
    setSkillEndorsements('');
    setRating(5);
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
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Write a Review</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Select Project to Review</label>
            <select 
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors appearance-none"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.title} (by {p.owner?.name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-sm font-medium text-gray-700 block flex justify-between">
              <span>Rating</span>
              <span className="text-yellow-500 font-bold">{rating} Stars</span>
            </label>
            <input 
              type="range" 
              min="1" max="5" 
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-yellow-500 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Review Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. Amazing UI and clean code!"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Review Comments</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors resize-none"
              placeholder="What did you like about this project?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Skill Endorsements (comma separated)</label>
            <input 
              type="text" 
              value={skillEndorsements}
              onChange={(e) => setSkillEndorsements(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. Great in React!, Clean Architecture"
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
              disabled={loading || !projectId || !title || !content}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
