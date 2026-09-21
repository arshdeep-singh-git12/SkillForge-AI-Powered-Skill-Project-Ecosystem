'use client';

/**
 * MemberList Component
 *
 * Displays a list of team members with roles, avatars, and join dates.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import type { TeamMember } from '@/types';
import { getInitials, formatDate } from '@/lib/utils';

const roleBadge: Record<string, { label: string; color: string; bg: string }> = {
  owner: { label: 'Owner', color: 'text-[#0cbde8]', bg: 'bg-[#0cbde8]/10' },
  admin: { label: 'Admin', color: 'text-[#f5b922]', bg: 'bg-[#f5b922]/10' },
  lead: { label: 'Lead', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  member: { label: 'Member', color: 'text-[#7a889b]', bg: 'bg-[#7a889b]/10' },
};

interface MemberListProps {
  members: TeamMember[];
}

export default function MemberList({ members }: MemberListProps) {
  if (!members || members.length === 0) {
    return (
      <div className="text-center py-4">
        <p className="font-mono text-xs text-[#7a889b]">No members yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {members.map((member, idx) => {
        const badge = roleBadge[member.role] || roleBadge.member;
        const name = member.user?.name || 'Unknown';
        const email = member.user?.email || '';

        return (
          <div
            key={member.user?.id || member.user?._id || idx}
            className="flex items-center gap-3 p-2.5 rounded-sm bg-[#15181d] border border-[#2d333b] hover:border-[#475363] transition-colors"
          >
            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-[#232830] border border-[#2d333b] flex items-center justify-center flex-shrink-0">
              <span className={`font-mono text-[10px] font-semibold ${badge.color}`}>
                {getInitials(name)}
              </span>
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-sans font-semibold text-[#eaedf0] truncate">
                {name}
              </p>
              {email && (
                <p className="font-mono text-[10px] text-[#7a889b] truncate">
                  {email}
                </p>
              )}
            </div>

            {/* Role Badge */}
            <span
              className={`font-mono text-[9px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${badge.color} ${badge.bg} whitespace-nowrap`}
            >
              {badge.label}
            </span>

            {/* Join Date */}
            <span className="font-mono text-[10px] text-[#7a889b] whitespace-nowrap hidden sm:inline">
              {member.joinedAt ? formatDate(member.joinedAt) : ''}
            </span>
          </div>
        );
      })}
    </div>
  );
}
