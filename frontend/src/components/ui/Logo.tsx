import React from 'react';

interface LogoProps {
  darkText?: boolean;
}

export default function Logo({ darkText = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2">
      <svg 
        className="w-8 h-8 shrink-0" 
        viewBox="0 0 48 48" 
        style={{ 
          filter: darkText ? 'drop-shadow(0 2px 4px rgba(14, 165, 233, 0.3))' : 'drop-shadow(0 0 6px rgba(60,224,255,.75))' 
        }}
      >
        <defs>
          <linearGradient id={`sw-${darkText ? 'light' : 'dark'}`} x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor={darkText ? "#38bdf8" : "#8ef4ff"} />
            <stop offset="0.5" stopColor={darkText ? "#0284c7" : "#35d8ff"} />
            <stop offset="1" stopColor={darkText ? "#0369a1" : "#0a86d8"} />
          </linearGradient>
          <linearGradient id={`sw2-${darkText ? 'light' : 'dark'}`} x1="40" y1="10" x2="10" y2="40">
            <stop offset="0" stopColor={darkText ? "#7dd3fc" : "#a6f7ff"} stopOpacity={darkText ? "0.6" : "0.25"} />
            <stop offset="1" stopColor={darkText ? "#0284c7" : "#0f9ae0"} stopOpacity={darkText ? "0.6" : "0.25"} />
          </linearGradient>
        </defs>
        <g transform="rotate(-32 24 24)">
          <ellipse cx="24" cy="24" rx="18.5" ry="9.6" stroke={`url(#sw2-${darkText ? 'light' : 'dark'})`} strokeWidth="3.1" strokeLinecap="round" strokeDasharray="58 30" strokeDashoffset="14" fill="none" />
          <circle cx="41.4" cy="20.6" r="3.1" fill={darkText ? "#0ea5e9" : "#bff6ff"} />
        </g>
        <circle cx="24" cy="24" r="6.6" fill={`url(#sw-${darkText ? 'light' : 'dark'})`} />
        <circle cx="24" cy="24" r="2.6" fill="#fff" />
      </svg>
      <div className="flex flex-col justify-center leading-none h-8">
        <span className={`text-[7.5px] font-bold tracking-[0.14em] leading-[1] mb-[1px] ml-[2px] font-sans ${darkText ? 'text-[#0284c7]' : 'text-[#3fe3ff]'}`}>
          AI-POWERED ECOSYSTEM
        </span>
        <span className={`font-black text-[22px] leading-[1] tracking-[-0.01em] font-sans ${darkText ? 'text-gray-900' : 'text-white'}`}>
          SKILLFORGE
        </span>
      </div>
    </div>
  );
}
