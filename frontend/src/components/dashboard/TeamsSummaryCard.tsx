'use client';

/**
 * TeamsSummaryCard Component
 *
 * Dashboard widget showing teams from the live Teams API.
 * Displays up to 3 recent teams with links to the full Teams page.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { Team } from '@/types';
import { teamService } from '@/services/team.service';
import { truncate } from '@/lib/utils';

const statusDot: Record<string, string> = {
  recruiting: 'bg-[#0cbde8]',
  active: 'bg-emerald-400',
  completed: 'bg-[#f5b922]',
  archived: 'bg-[#7a889b]',
};

export default function TeamsSummaryCard() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await teamService.getAllTeams({ limit: 3 });
        setTeams(response.data || []);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchTeams();
  }, []);

  return (
    <div className="card border-[#2d333b]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans font-bold text-[#eaedf0] text-sm">👥 Teams</h2>
        <Link
          href="/teams"
          className="font-mono text-[10px] text-[#0cbde8] hover:underline uppercase tracking-wider"
        >
          View All →
        </Link>
      </div>

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[#232830] rounded-sm animate-pulse" />
          ))}
        </div>
      )}

      {!loading && error && (
        <p className="font-mono text-xs text-[#7a889b] text-center py-4">
          Unable to load teams
        </p>
      )}

      {!loading && !error && teams.length === 0 && (
        <div className="text-center py-6">
          <p className="font-mono text-xs text-[#7a889b] mb-2">No teams yet</p>
          <Link href="/teams" className="btn-primary text-[10px] px-3 py-1.5">
            Find a Team
          </Link>
        </div>
      )}

      {!loading && !error && teams.length > 0 && (
        <div className="space-y-2">
          {teams.map((team) => (
            <div
              key={team.id || team._id}
              className="flex items-center gap-3 p-2.5 rounded-sm bg-[#15181d] border border-[#2d333b] hover:border-[#475363] transition-colors"
            >
              <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot[team.status] || 'bg-[#7a889b]'}`} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-sans font-semibold text-[#eaedf0] truncate">
                  {team.name}
                </p>
                <p className="font-mono text-[10px] text-[#7a889b] truncate">
                  {truncate(team.description, 50)}
                </p>
              </div>
              <span className="font-mono text-[10px] text-[#7a889b] whitespace-nowrap">
                {team.members?.length || 0}/{team.maxMembers}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
