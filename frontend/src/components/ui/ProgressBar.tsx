import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
}

export default function ProgressBar({ label, percentage }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-bold text-gray-900 font-sans">{label}</span>
        <span className="text-xs font-bold text-cyan font-sans">{percentage}%</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden border border-gray-200">
        <div 
          className="bg-cyan h-2.5 rounded-full transition-all duration-1000 ease-out shadow-sm" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
