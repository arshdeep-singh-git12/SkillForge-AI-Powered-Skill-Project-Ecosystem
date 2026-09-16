import React, { useState } from 'react';

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (cert: any) => Promise<void>;
}

export default function CertificationModal({ isOpen, onClose, onSubmit }: CertificationModalProps) {
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [description, setDescription] = useState('');
  const [dateEarned, setDateEarned] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ 
      title, 
      issuer,
      description,
      dateEarned,
      credentialUrl
    });
    setLoading(false);
    
    // Reset form
    setTitle('');
    setIssuer('');
    setDescription('');
    setDateEarned('');
    setCredentialUrl('');
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
        
        <h2 className="text-2xl font-bold text-machined-100 mb-6">Add External Certification</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Certification Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. AWS Certified Developer"
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Issuer</label>
            <input 
              type="text" 
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="e.g. Coursera, Amazon, Google"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Date Earned</label>
            <input 
              type="date" 
              value={dateEarned}
              onChange={(e) => setDateEarned(e.target.value)}
              required
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Credential / Verification URL</label>
            <input 
              type="url" 
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none"
              placeholder="https://coursera.org/verify/..."
            />
          </div>
          
          <div className="space-y-1">
            <label className="text-sm font-mono text-machined-400">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-machined-900 border border-machined-600 rounded-lg px-4 py-3 text-machined-100 focus:border-cyan focus:outline-none resize-none"
              placeholder="What skills did this cover?"
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
              disabled={loading || !title || !issuer || !dateEarned}
              className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold px-8 py-3 rounded-lg transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
