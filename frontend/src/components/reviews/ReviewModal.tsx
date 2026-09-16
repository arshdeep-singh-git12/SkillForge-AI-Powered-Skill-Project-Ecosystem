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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-machined-900/80 backdrop-blur-md p-4">
      <div className="bg-machined-800 border border-machined-600 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-machined-400 hover:text-cyan transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-machined-100 mb-6">Write a Review</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Select Project to Review</label>
            <select 
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none appearance-none"
            >
              {projects.map(p => (
                <option key={p._id} value={p._id}>{p.title} (by {p.owner?.name})</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400 flex justify-between">
              <span>Rating</span>
              <span className="text-yellow-500 font-bold">{rating} Stars</span>
            </label>
            <input 
              type="range" 
              min="1" max="5" 
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full accent-yellow-500 h-2 bg-machined-900 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Review Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. Amazing UI and clean code!"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Review Comments</label>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={3}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none resize-none"
              placeholder="What did you like about this project?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Skill Endorsements (comma separated)</label>
            <input 
              type="text" 
              value={skillEndorsements}
              onChange={(e) => setSkillEndorsements(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. Great in React!, Clean Architecture"
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
              disabled={loading || !projectId || !title || !content}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Post Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
