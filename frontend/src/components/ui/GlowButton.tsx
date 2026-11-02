import React from 'react';

interface GlowButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  children: React.ReactNode;
  hero?: boolean;
}

export default function GlowButton({ children, hero, className = '', ...props }: GlowButtonProps) {
  return (
    <a className={`v-btn ${hero ? 'v-btn-hero cta2' : 'btn'} ${className}`} {...props}>
      <span className="font-medium text-white">{children}</span>
    </a>
  );
}
