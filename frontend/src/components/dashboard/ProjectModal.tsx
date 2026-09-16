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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-machined-900/80 backdrop-blur-md p-4">
      <div className="bg-machined-800 border border-machined-600 rounded-2xl p-8 w-full max-w-lg shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-machined-400 hover:text-cyan transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-machined-100 mb-6">Upload Project</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Project Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. AI Portfolio Builder"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={4}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none resize-none"
              placeholder="What does your project do?"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Tech Stack (comma separated)</label>
            <input 
              type="text" 
              value={techStack}
              onChange={(e) => setTechStack(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">GitHub URL</label>
            <input 
              type="url" 
              value={githubUrl}
              onChange={(e) => setGithubUrl(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Live Demo URL</label>
            <input 
              type="url" 
              value={liveUrl}
              onChange={(e) => setLiveUrl(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="https://my-project.vercel.app"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Thumbnail Image URL</label>
            <input 
              type="url" 
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="https://example.com/image.jpg"
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
              disabled={loading || !title || !description}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] disabled:opacity-50"
            >
              {loading ? 'Uploading...' : 'Publish Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
