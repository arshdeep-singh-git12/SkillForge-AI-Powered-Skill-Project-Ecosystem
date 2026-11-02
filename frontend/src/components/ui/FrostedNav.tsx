import React from 'react';

interface FrostedNavProps {
  className?: string;
}

export default function FrostedNav({ className = '' }: FrostedNavProps) {
  return (
    <div className={`v-nav-pill ${className}`}>
      {/* SVG LOGO MARK */}
      <svg className="mark absolute" viewBox="0 0 48 48" style={{ filter: 'drop-shadow(0 0 6px rgba(60,224,255,.75))' }}>
        <defs>
          <linearGradient id="sw" x1="8" y1="8" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#8ef4ff" />
            <stop offset="0.5" stopColor="#35d8ff" />
            <stop offset="1" stopColor="#0a86d8" />
          </linearGradient>
          <linearGradient id="sw2" x1="40" y1="10" x2="10" y2="40">
            <stop offset="0" stopColor="#a6f7ff" stopOpacity="0.25" />
            <stop offset="1" stopColor="#0f9ae0" stopOpacity="0.25" />
          </linearGradient>
        </defs>
        <g transform="rotate(-32 24 24)">
          <ellipse cx="24" cy="24" rx="18.5" ry="9.6" stroke="url(#sw2)" strokeWidth="3.1" strokeLinecap="round" strokeDasharray="58 30" strokeDashoffset="14" fill="none" />
          <circle cx="41.4" cy="20.6" r="3.1" fill="#bff6ff" />
        </g>
        <circle cx="24" cy="24" r="6.6" fill="url(#sw)" />
        <circle cx="24" cy="24" r="2.6" fill="#fff" />
      </svg>
      
      {/* WORDMARK */}
      <div className="wm">
        <span className="kick">SKILLFORGE</span>
        <span id="wmName" className="name tracking-tight font-black">ECOSYSTEM</span>
      </div>
      
      {/* LINKS */}
      <div className="links" id="links">
        <a href="/">Origin</a>
        <a href="/learn">Learn how</a>
        <a href="/core">Core Skills</a>
        <a href="/assessments">Assessments</a>
        <a href="/support">Support</a>
      </div>
    </div>
  );
}
