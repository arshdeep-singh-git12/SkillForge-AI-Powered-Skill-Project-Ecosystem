import React from 'react';

interface ProgressBarProps {
  label: string;
  percentage: number;
}

export default function ProgressBar({ label, percentage }: ProgressBarProps) {
  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-sm font-bold text-machined-100">{label}</span>
        <span className="text-xs font-mono text-cyan">{percentage}%</span>
      </div>
      <div className="w-full bg-machined-800 rounded-full h-2.5 overflow-hidden border border-machined-600">
        <div 
          className="bg-cyan h-2.5 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(12,189,232,0.5)]" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
