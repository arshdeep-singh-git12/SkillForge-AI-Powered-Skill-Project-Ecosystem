'use client';

/**
 * TeamCard Component
 *
 * Displays a single team with name, status, skills, members, and actions.
 * Used in the Teams browse listing and dashboard summary.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import { useState } from 'react';
import type { Team } from '@/types';
import { formatDate, truncate, getInitials } from '@/lib/utils';
import { teamService } from '@/services/team.service';

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  recruiting: { label: 'RECRUITING', color: 'text-[#0cbde8]', bg: 'bg-[#0cbde8]/10' },
  active: { label: 'ACTIVE', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  completed: { label: 'COMPLETED', color: 'text-[#f5b922]', bg: 'bg-[#f5b922]/10' },
  archived: { label: 'ARCHIVED', color: 'text-[#7a889b]', bg: 'bg-[#7a889b]/10' },
};

const roleColors: Record<string, string> = {
  owner: 'text-[#0cbde8]',
  admin: 'text-[#f5b922]',
  lead: 'text-emerald-400',
  member: 'text-[#7a889b]',
};

interface TeamCardProps {
  team: Team;
  onRefresh?: () => void;
  showActions?: boolean;
}

export default function TeamCard({ team, onRefresh, showActions = true }: TeamCardProps) {
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);

  const status = statusConfig[team.status] || statusConfig.archived;
  const memberCount = team.members?.length || 0;
  const isFull = memberCount >= team.maxMembers;
  const canJoin = team.status === 'recruiting' && !isFull;

  const handleJoin = async () => {
    setError(null);
    setJoining(true);
    try {
      await teamService.joinTeam(team.id || team._id || '');
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to join team';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || msg);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    setError(null);
    setLeaving(true);
    try {
      await teamService.leaveTeam(team.id || team._id || '');
      onRefresh?.();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to leave team';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || msg);
    } finally {
      setLeaving(false);
    }
  };

  return (
    <div className="card border-[#2d333b] hover:border-[#0cbde8] transition-all duration-200 flex flex-col">
      {/* Header: Name + Status */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-sans font-bold text-[#eaedf0] text-base truncate">
            {team.name}
          </h3>
          {team.owner && (
            <p className="font-mono text-[10px] text-[#7a889b] mt-0.5">
              by {team.owner.name}
            </p>
          )}
        </div>
        <span
          className={`font-mono text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-sm ${status.color} ${status.bg} whitespace-nowrap ml-2`}
        >
          {status.label}
        </span>
      </div>

      {/* Description */}
      <p className="text-xs text-[#7a889b] font-sans leading-relaxed mb-3">
        {truncate(team.description, expanded ? 500 : 100)}
        {team.description.length > 100 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-[#0cbde8] ml-1 hover:underline"
          >
            {expanded ? 'less' : 'more'}
          </button>
        )}
      </p>

      {/* Required Skills */}
      {team.requiredSkills?.length > 0 && (
        <div className="mb-3">
          <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5">
            Required Skills
          </span>
          <div className="flex flex-wrap gap-1.5">
            {team.requiredSkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#0cbde8]/10 text-[#0cbde8] border border-[#0cbde8]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tags */}
      {team.tags?.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1.5">
            {team.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#232830] text-[#7a889b] border border-[#2d333b]"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Members */}
      <div className="mb-3 flex items-center gap-2">
        <div className="flex -space-x-2">
          {team.members?.slice(0, 5).map((member, idx) => (
            <div
              key={member.user?.id || member.user?._id || idx}
              className="w-7 h-7 rounded-full bg-[#232830] border-2 border-[#1c2026] flex items-center justify-center"
              title={`${member.user?.name || 'Member'} (${member.role})`}
            >
              <span className={`font-mono text-[9px] font-semibold ${roleColors[member.role] || 'text-[#7a889b]'}`}>
                {member.user?.name ? getInitials(member.user.name) : '??'}
              </span>
            </div>
          ))}
          {memberCount > 5 && (
            <div className="w-7 h-7 rounded-full bg-[#232830] border-2 border-[#1c2026] flex items-center justify-center">
              <span className="font-mono text-[9px] text-[#7a889b]">+{memberCount - 5}</span>
            </div>
          )}
        </div>
        <span className="font-mono text-[11px] text-[#7a889b]">
          {memberCount}/{team.maxMembers} members
        </span>
      </div>

      {/* Footer: Date + Actions */}
      <div className="mt-auto pt-3 border-t border-[#2d333b]">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] text-[#7a889b]">
            {team.createdAt ? formatDate(team.createdAt) : ''}
          </span>
          {showActions && (
            <div className="flex gap-2">
              {canJoin && (
                <button
                  onClick={handleJoin}
                  disabled={joining}
                  className="btn-primary text-[10px] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {joining ? 'Joining...' : 'Join Team'}
                </button>
              )}
              <button
                onClick={handleLeave}
                disabled={leaving}
                className="btn-secondary text-[10px] px-3 py-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {leaving ? 'Leaving...' : 'Leave'}
              </button>
            </div>
          )}
        </div>
        {error && (
          <p className="font-mono text-[10px] text-red-400 mt-2">{error}</p>
        )}
      </div>
    </div>
  );
}
