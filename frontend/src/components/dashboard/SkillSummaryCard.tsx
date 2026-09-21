'use client';

/**
 * SkillSummaryCard Component
 *
 * Dashboard widget showing user's top skills.
 * Gracefully handles the Skills API not being ready yet.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import Link from 'next/link';

export default function SkillSummaryCard() {
  // Skills API is a stub (Member 2's module).
  // When ready, this will fetch from profileService.getUserSkills() and display ProgressBars.
  // For now, show a meaningful empty state that encourages the user to set up their profile.

  return (
    <div className="card border-[#2d333b]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans font-bold text-[#eaedf0] text-sm">📊 Skill Summary</h2>
        <Link
          href="/profile"
          className="font-mono text-[10px] text-[#0cbde8] hover:underline uppercase tracking-wider"
        >
          View Profile →
        </Link>
      </div>

      <div className="flex flex-col items-center justify-center text-center py-8 px-4 rounded-sm border border-dashed border-[#2d333b] bg-gradient-to-b from-[#15181d] to-[#1a1e24] transition-colors hover:border-[#475363]">
        <div className="w-12 h-12 rounded-full bg-[#232830] border border-[#2d333b] flex items-center justify-center text-xl mb-3 shadow-inner">
          📈
        </div>
        <p className="font-sans font-semibold text-sm text-[#eaedf0] mb-1">Skills Module Pending</p>
        <p className="font-mono text-[10px] text-[#7a889b] mb-4 max-w-[220px]">
          Your skill proficiency bars will appear here once the module is active.
        </p>
        <Link href="/profile" className="btn-secondary text-[10px] px-4 py-1.5 opacity-80 hover:opacity-100 transition-opacity">
          Set Up Profile
        </Link>
      </div>
    </div>
  );
}
