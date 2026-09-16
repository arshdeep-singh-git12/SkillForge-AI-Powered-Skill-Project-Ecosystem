'use client';

import React, { useEffect, useState } from 'react';
import { getCertifications, addExternalCertification } from '../../services/certification.service';
import CertificationModal from '../../components/certifications/CertificationModal';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchCerts = async () => {
      try {
        const data = await getCertifications();
        setCertifications(data);
      } catch (error) {
        console.error('Failed to load certifications', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCerts();
  }, []);

  const handleAddCert = async (certData: any) => {
    try {
      const newCert = await addExternalCertification(certData);
      setCertifications([newCert, ...certifications]);
    } catch (error) {
      console.error('Failed to add certification', error);
      alert('Failed to add certification. Try again.');
    }
  };

  const internalTrophies = certifications.filter(c => c.type === 'assessment');
  const externalCerts = certifications.filter(c => c.type === 'external');

  return (
    <div className="min-h-screen bg-machined-900 text-machined-100 p-6 md:p-12 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-0 w-[50%] h-[50%] rounded-full bg-cyan-dim blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-16">
        
        {/* Header & Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-machined-100 to-machined-400 mb-2">
              My Certifications & Badges
            </h1>
            <p className="text-machined-400 font-mono">Showcase your achievements, trophies, and external credentials.</p>
          </div>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-cyan hover:bg-cyan-hover text-machined-900 font-bold py-3 px-8 rounded-xl transition-all shadow-[0_0_15px_rgba(12,189,232,0.3)] hover:shadow-[0_0_20px_rgba(12,189,232,0.5)] whitespace-nowrap flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add External Certificate
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="text-cyan font-mono animate-pulse">Loading achievements...</div>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* Section 1: Internal Trophies */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-machined-100">SkillForge Trophies</h2>
                <div className="h-px bg-machined-700 flex-grow"></div>
              </div>

              {internalTrophies.length === 0 ? (
                <div className="text-center py-12 bg-machined-800/30 rounded-2xl border border-dashed border-machined-600">
                  <p className="text-machined-400 font-mono mb-4">You haven't earned any trophies yet.</p>
                  <a href="/assessments" className="text-cyan hover:underline">Complete a Coding Challenge to earn one!</a>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {internalTrophies.map((trophy) => (
                    <div key={trophy._id} className="bg-machined-800 border border-machined-600 hover:border-yellow-500/50 transition-colors rounded-2xl p-6 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.2)] flex flex-col items-center text-center group cursor-default relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]">
                        {trophy.badgeImage || '🏆'}
                      </div>
                      <h3 className="font-bold text-machined-100 text-sm mb-1 leading-tight">{trophy.title}</h3>
                      <p className="text-[10px] font-mono text-machined-400 uppercase tracking-widest">{new Date(trophy.dateEarned).toLocaleDateString()}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Section 2: External Certificates */}
            <section>
              <div className="flex items-center gap-4 mb-8">
                <h2 className="text-2xl font-bold text-machined-100">External Credentials</h2>
                <div className="h-px bg-machined-700 flex-grow"></div>
              </div>

              {externalCerts.length === 0 ? (
                <div className="text-center py-12 bg-machined-800/30 rounded-2xl border border-dashed border-machined-600">
                  <p className="text-machined-400 font-mono">No external certificates added.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {externalCerts.map((cert) => (
                    <div key={cert._id} className="bg-machined-800 border border-machined-600 hover:border-cyan transition-colors rounded-2xl p-6 shadow-lg relative flex flex-col group">
                      
                      <div className="absolute top-0 right-0 p-4">
                        <svg className="w-8 h-8 text-machined-600 group-hover:text-cyan transition-colors opacity-50" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                      </div>

                      <div className="mb-6 z-10">
                        <span className="text-xs font-mono text-cyan uppercase tracking-widest block mb-1">{cert.issuer}</span>
                        <h3 className="font-bold text-xl text-machined-100 leading-tight">{cert.title}</h3>
                        <p className="text-xs font-mono text-machined-400 mt-2">Earned: {new Date(cert.dateEarned).toLocaleDateString()}</p>
                      </div>
                      
                      {cert.description && (
                        <p className="text-sm text-machined-300 mb-6 flex-grow">{cert.description}</p>
                      )}
                      
                      {cert.credentialUrl && (
                        <div className="mt-auto pt-4 border-t border-machined-700">
                          <a 
                            href={cert.credentialUrl} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-cyan hover:text-cyan-hover font-mono text-sm flex items-center gap-2 transition-colors"
                          >
                            Verify Credential
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </section>

          </div>
        )}
      </div>

      <CertificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddCert} 
      />
    </div>
  );
}
