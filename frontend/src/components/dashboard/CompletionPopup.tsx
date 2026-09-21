'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getProfileCompletion } from '../../services/profile.service';

interface MissingStep {
  name: string;
  link: string;
}

interface CompletionData {
  percentage: number;
  missingSteps: MissingStep[];
  isComplete: boolean;
}

export default function CompletionPopup() {
  const [data, setData] = useState<CompletionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState(false); // Only hides it for current session

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getProfileCompletion();
        setData(result);
      } catch (error) {
        console.error('Failed to fetch completion stats:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data || data.isComplete || dismissed) {
    return null; // Don't show if loading, complete, or dismissed
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 w-full max-w-sm">
      <div className="bg-white border border-gray-100 rounded-[24px] shadow-[0_12px_40px_rgb(0,0,0,0.12)] p-6 relative overflow-hidden animate-[slideIn_0.4s_ease-out]">
        
        {/* Progress Bar background decoration */}
        <div 
          className="absolute top-0 left-0 h-1 bg-cyan transition-all duration-1000 ease-out" 
          style={{ width: `${data.percentage}%` }}
        />

        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-bold text-gray-900 font-serif">Setup your Profile</h3>
            <p className="text-sm font-sans text-gray-500 font-medium">{data.percentage}% Completed</p>
          </div>
          <div className="w-12 h-12 rounded-full border-[3px] border-gray-100 flex items-center justify-center relative">
            {/* Circular Progress (simplified) */}
            <span className="text-xs font-bold font-mono text-cyan">{data.percentage}%</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 mb-4 font-sans leading-relaxed">
          Complete these steps to stand out to teams and recruiters in the SkillForge community.
        </p>

        <ul className="space-y-3 mb-6">
          {data.missingSteps.map((step, idx) => (
            <li key={idx}>
              <Link 
                href={step.link}
                className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-cyan hover:bg-cyan/5 transition-all group"
              >
                <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center flex-shrink-0 group-hover:border-cyan">
                  <span className="w-2 h-2 rounded-full bg-gray-200 group-hover:bg-cyan transition-colors" />
                </div>
                <span className="text-sm font-medium text-gray-700 font-sans group-hover:text-cyan transition-colors">{step.name}</span>
                <svg className="w-4 h-4 ml-auto text-gray-400 group-hover:text-cyan transition-colors transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex gap-3">
          <Link 
            href={data.missingSteps[0]?.link || '/profile'} 
            className="flex-1 bg-gray-900 hover:bg-gray-800 text-white text-sm font-bold py-2.5 px-4 rounded-xl text-center transition-colors shadow-sm"
          >
            Complete Now
          </Link>
          <button 
            onClick={() => setDismissed(true)}
            className="px-4 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-900 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
