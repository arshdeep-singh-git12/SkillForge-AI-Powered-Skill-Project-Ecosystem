'use client';

import React, { useEffect, useState, useRef } from 'react';
import { getCertifications, addExternalCertification, uploadLinkedinPdf } from '../../services/certification.service';
import CertificationModal from '../../components/certifications/CertificationModal';

export default function CertificationsPage() {
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingPdf(true);

    try {
      const data = await uploadLinkedinPdf(file);
      // Reload certificates
      const newCerts = await getCertifications();
      setCertifications(newCerts);
      alert(data.message);
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to parse LinkedIn PDF');
    } finally {
      setIsUploadingPdf(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const internalTrophies = certifications.filter(c => c.type === 'assessment');
  const externalCerts = certifications.filter(c => c.type === 'external');

  return (
    <div className="p-6 md:p-8 space-y-8">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 interior-card bg-white shadow-sm">
        <div>
          <h1 className="text-3xl interior-heading mb-1">
            My Certifications & Badges
          </h1>
          <p className="interior-text font-sans text-sm">Showcase your achievements, trophies, and external credentials.</p>
        </div>
        
        <div className="flex gap-4">
          <input 
            type="file" 
            accept=".pdf" 
            className="hidden" 
            ref={fileInputRef}
            onChange={handlePdfUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploadingPdf}
            className="interior-pill bg-[#0a66c2] text-white hover:bg-[#004182] border-transparent shadow-md flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-70"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
            {isUploadingPdf ? 'Parsing PDF...' : 'Sync LinkedIn via PDF'}
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="interior-pill interior-pill-active shadow-md flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add External Certificate
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="text-gray-400 font-sans font-medium animate-pulse">Loading achievements...</div>
        </div>
      ) : (
        <div className="space-y-12">
          
          {/* Section 1: Internal Trophies */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl interior-heading">SkillForge Trophies</h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>

            {internalTrophies.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-[24px] border border-dashed border-gray-300">
                <p className="interior-text font-sans mb-4">You haven&apos;t earned any trophies yet.</p>
                <a href="/assessments" className="text-gray-900 font-bold hover:underline">Complete a Coding Challenge to earn one!</a>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {internalTrophies.map((trophy) => (
                  <div key={trophy._id} className="interior-panel hover:-translate-y-1 transition-all duration-300 p-6 flex flex-col items-center text-center group cursor-default relative overflow-hidden bg-white">
                    <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-sm">
                      {trophy.badgeImage || '🏆'}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm mb-1 leading-tight font-sans">{trophy.title}</h3>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest font-sans">{new Date(trophy.dateEarned).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Section 2: External Certificates */}
          <section>
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-xl interior-heading">External Credentials</h2>
              <div className="h-px bg-gray-200 flex-grow"></div>
            </div>

            {externalCerts.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-[24px] border border-dashed border-gray-300">
                <p className="interior-text font-sans">No external certificates added.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {externalCerts.map((cert) => (
                  <div key={cert._id} className="interior-panel p-6 relative flex flex-col group transition-all hover:border-gray-300">
                    
                    <div className="absolute top-0 right-0 p-4">
                      <svg className="w-8 h-8 text-gray-200 group-hover:text-gray-300 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                    </div>

                    <div className="mb-6 z-10">
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1 font-sans">{cert.issuer}</span>
                      <h3 className="font-bold text-xl text-gray-900 leading-tight">{cert.title}</h3>
                      <p className="text-xs font-sans text-gray-500 mt-2 font-medium">Earned: {new Date(cert.dateEarned).toLocaleDateString()}</p>
                    </div>
                    
                    {cert.description && (
                      <p className="text-sm text-gray-600 mb-6 flex-grow">{cert.description}</p>
                    )}
                    
                    {cert.credentialUrl && (
                      <div className="mt-auto pt-4 border-t border-gray-100">
                        <a 
                          href={cert.credentialUrl} 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-gray-600 hover:text-gray-900 font-sans font-bold text-sm flex items-center gap-2 transition-colors"
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

      <CertificationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddCert} 
      />
    </div>
  );
}
