'use client';

/**
 * QuickActions Component
 *
 * Panel of shortcut buttons for quick navigation to key features.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import Link from 'next/link';

const actions = [
  {
    label: 'Find Team',
    icon: '👥',
    href: '/teams',
    description: 'Browse & join teams',
  },
  {
    label: 'Take Assessment',
    icon: '💻',
    href: '/assessments',
    description: 'Coding challenges',
  },
  {
    label: 'View Projects',
    icon: '💼',
    href: '/projects',
    description: 'Project portfolio',
  },
  {
    label: 'My Profile',
    icon: '👤',
    href: '/profile',
    description: 'Skills & profile',
  },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {actions.map((action) => (
        <Link
          key={action.href}
          href={action.href}
          className="card p-4 border-[#2d333b] hover:border-[#0cbde8] hover:-translate-y-1 hover:shadow-[0_4px_20px_rgba(12,189,232,0.15)] transition-all duration-300 group text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-[#0cbde8]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
          <div className="text-2xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{action.icon}</div>
          <div className="font-sans font-semibold text-sm text-[#eaedf0] group-hover:text-[#0cbde8] transition-colors duration-300 relative z-10">
            {action.label}
          </div>
          <div className="font-mono text-[10px] text-[#7a889b] mt-0.5 relative z-10">
            {action.description}
          </div>
        </Link>
      ))}
    </div>
  );
}
