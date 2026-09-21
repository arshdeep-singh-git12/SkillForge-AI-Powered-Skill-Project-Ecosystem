import React, { useState } from 'react';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: any) => Promise<void>;
}

export default function ProjectModal({ isOpen, onClose, onSubmit }: ProjectModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [techStack, setTechStack] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ 
      title, 
      description, 
      techStack: techStack.split(',').map(s => s.trim()).filter(Boolean),
      githubUrl,
      liveUrl,
      thumbnail
    });
    setLoading(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setTechStack('');
    setGithubUrl('');
    setLiveUrl('');
    setThumbnail('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-100 rounded-[24px] p-8 w-full max-w-lg shadow-[0_12px_40px_rgb(0,0,0,0.12)] relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Upload Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Project Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. AI Portfolio Builder"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors resize-none"
              placeholder="What does your project do?"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Tech Stack (comma separated)</label>
            <input 
              type="text" 
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">GitHub URL</label>
            <input 
              type="url" 
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Live Demo URL</label>
            <input 
              type="url" 
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="https://my-project.vercel.app"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Thumbnail Image URL</label>
            <input 
              type="url" 
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="https://example.com/image.jpg"
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
              disabled={loading || !title || !description}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
