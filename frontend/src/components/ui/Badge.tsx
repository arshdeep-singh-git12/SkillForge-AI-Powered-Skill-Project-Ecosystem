import React from 'react';

interface BadgeProps {
  text: string;
  className?: string;
  id?: string;
}

export default function Badge({ text, className = '', id }: BadgeProps) {
  return (
    <div className={`v-badge ${className}`}>
      <i className="v-badge-icon absolute top-[4px] left-[4px] w-[29px] h-[29px]">
        <svg viewBox="5 1 14 22" preserveAspectRatio="none" fill="rgba(16,112,152,.72)" stroke="rgba(190,236,255,.6)" strokeWidth="1.6" strokeLinejoin="round" className="w-[14px] h-[16px] relative -top-[1px] left-[0px]">
          <path d="M13.9 1.6 5.5 13.6a.7.7 0 0 0 .6 1.1h4.2l-1 7.7a.7.7 0 0 0 1.25.55l8.3-12.1a.7.7 0 0 0-.6-1.1h-4.2l1-7.7a.7.7 0 0 0-1.25-.55Z" />
        </svg>
      </i>
      <b id={id} className="v-badge-text absolute left-[45px] top-0 h-[39px] flex items-center origin-left">
        {text}
      </b>
    </div>
  );
}
