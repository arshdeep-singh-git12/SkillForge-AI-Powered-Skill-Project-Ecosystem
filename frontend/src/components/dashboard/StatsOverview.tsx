'use client';

/**
 * StatsOverview Component
 *
 * Top metrics bar showing aggregated user stats at a glance.
 * Gracefully handles missing data when dependent modules are still stubs.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import { useState, useEffect } from 'react';
import { teamService } from '@/services/team.service';

interface StatTile {
  label: string;
  value: string;
  sublabel: string;
  loading: boolean;
}

export default function StatsOverview() {
  const [stats, setStats] = useState<StatTile[]>([
    { label: 'Skills', value: '—', sublabel: 'Pending Module', loading: false },
    { label: 'Projects', value: '—', sublabel: 'Pending Module', loading: false },
    { label: 'Teams', value: '...', sublabel: 'Loading', loading: true },
    { label: 'Certifications', value: '—', sublabel: 'Pending Module', loading: false },
  ]);

  useEffect(() => {
    const fetchTeamCount = async () => {
      try {
        const response = await teamService.getAllTeams({ limit: 1 });
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Teams'
              ? { ...stat, value: String(response.total || 0), sublabel: 'Total Teams', loading: false }
              : stat,
          ),
        );
      } catch {
        setStats((prev) =>
          prev.map((stat) =>
            stat.label === 'Teams'
              ? { ...stat, value: '—', sublabel: 'Unavailable', loading: false }
              : stat,
          ),
        );
      }
    };
    fetchTeamCount();
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="card p-4 border-[#2d333b] bg-[#1c2026]">
          <div className="font-mono text-xs uppercase tracking-wider text-[#7a889b]">
            {stat.label}
          </div>
          <div className="text-2xl font-bold text-[#0cbde8] mt-1 tabular-nums">
            {stat.loading ? (
              <span className="inline-block w-8 h-6 bg-[#232830] rounded animate-pulse" />
            ) : (
              stat.value
            )}
          </div>
          <div className="text-[11px] font-mono text-[#7a889b] mt-0.5">
            {stat.sublabel}
          </div>
        </div>
      ))}
    </div>
  );
}
