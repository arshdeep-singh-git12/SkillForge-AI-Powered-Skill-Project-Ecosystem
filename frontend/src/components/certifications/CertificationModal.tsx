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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm p-4">
      <div className="bg-white border border-gray-100 rounded-[24px] p-8 w-full max-w-lg shadow-[0_12px_40px_rgb(0,0,0,0.12)] relative">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-6 font-serif">Add External Certification</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Certification Title</label>
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. AWS Certified Developer"
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Issuer</label>
            <input 
              type="text" 
              value={issuer}
              onChange={(e) => setIssuer(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="e.g. Coursera, Amazon, Google"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Date Earned</label>
            <input 
              type="date" 
              value={dateEarned}
              onChange={(e) => setDateEarned(e.target.value)}
              required
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Credential / Verification URL</label>
            <input 
              type="url" 
              value={credentialUrl}
              onChange={(e) => setCredentialUrl(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors"
              placeholder="https://coursera.org/verify/..."
            />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-gray-700 block">Description (Optional)</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-colors resize-none"
              placeholder="What skills did this cover?"
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
              disabled={loading || !title || !issuer || !dateEarned}
              className="bg-gray-900 hover:bg-gray-800 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-md disabled:opacity-50"
            >
              {loading ? 'Adding...' : 'Add Certification'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
