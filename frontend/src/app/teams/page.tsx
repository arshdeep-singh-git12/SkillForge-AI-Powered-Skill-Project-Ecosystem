'use client';

/**
 * Teams Page
 *
 * Displays team listings, skill-based matching, and team management.
 *
 * Features:
 *   - Browse teams list with filtering (search, status, skill)
 *   - Paginated team grid
 *   - Find matching teams based on user skills
 *   - Create team via modal form
 *   - Join/leave team actions on team cards
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import { useState, useEffect, useCallback } from 'react';
import type { Team } from '@/types';
import { teamService } from '@/services/team.service';
import TeamCard from '@/components/teams/TeamCard';
import TeamFilters from '@/components/teams/TeamFilters';
import type { FilterValues } from '@/components/teams/TeamFilters';
import CreateTeamForm from '@/components/teams/CreateTeamForm';
import MatchResults from '@/components/teams/MatchResults';

type TabType = 'browse' | 'match';

export default function TeamsPage() {
  const [activeTab, setActiveTab] = useState<TabType>('browse');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Browse state
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<FilterValues>({ search: '', status: '', skill: '' });
  const limit = 12;

  const fetchTeams = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await teamService.getAllTeams({
        ...filters,
        page,
        limit,
      });
      setTeams(response.data || []);
      setTotal(response.total || 0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load teams';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || msg);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    if (activeTab === 'browse') {
      fetchTeams();
    }
  }, [activeTab, fetchTeams]);

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const handleTeamCreated = () => {
    setShowCreateModal(false);
    fetchTeams();
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="min-h-screen bg-[#15181d] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="eyebrow mb-2">
            Team Formation · Algorithmic Matching
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#eaedf0]">
              Teams
            </h1>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              + Create Team
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-[#2d333b]">
          <button
            onClick={() => setActiveTab('browse')}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-colors border-b-2 ${
              activeTab === 'browse'
                ? 'text-[#0cbde8] border-[#0cbde8]'
                : 'text-[#7a889b] border-transparent hover:text-[#eaedf0]'
            }`}
          >
            Browse Teams
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`font-mono text-xs uppercase tracking-wider px-4 py-2.5 transition-colors border-b-2 ${
              activeTab === 'match'
                ? 'text-[#0cbde8] border-[#0cbde8]'
                : 'text-[#7a889b] border-transparent hover:text-[#eaedf0]'
            }`}
          >
            Find Matches
          </button>
        </div>

        {/* Browse Tab */}
        {activeTab === 'browse' && (
          <>
            <TeamFilters
              onFilterChange={handleFilterChange}
              initialFilters={filters}
            />

            {/* Loading */}
            {loading && (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin h-5 w-5 border-2 border-[#0cbde8] border-t-transparent rounded-full mr-3" />
                <span className="font-mono text-xs text-[#7a889b]">Loading teams...</span>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="card border-red-400/20 bg-red-400/5 text-center py-8">
                <p className="font-mono text-xs text-red-400 mb-3">{error}</p>
                <button onClick={fetchTeams} className="btn-secondary text-[10px]">
                  Retry
                </button>
              </div>
            )}

            {/* Empty State */}
            {!loading && !error && teams.length === 0 && (
              <div className="card border-[#2d333b] text-center py-12">
                <div className="text-4xl mb-3">👥</div>
                <p className="font-sans font-semibold text-[#eaedf0] mb-1">No teams found</p>
                <p className="font-mono text-xs text-[#7a889b] mb-4">
                  {filters.search || filters.status || filters.skill
                    ? 'Try adjusting your filters'
                    : 'Be the first to create a team!'}
                </p>
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="btn-primary"
                >
                  + Create Team
                </button>
              </div>
            )}

            {/* Team Grid */}
            {!loading && !error && teams.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b]">
                    {total} team{total !== 1 ? 's' : ''} found
                  </span>
                  <span className="font-mono text-[10px] text-[#7a889b]">
                    Page {page} of {totalPages}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {teams.map((team) => (
                    <TeamCard
                      key={team.id || team._id}
                      team={team}
                      onRefresh={fetchTeams}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={page <= 1}
                      className="btn-secondary text-[10px] px-3 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      ← Prev
                    </button>
                    {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                      const pageNum = i + 1;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPage(pageNum)}
                          className={`font-mono text-[10px] w-8 h-8 rounded-sm transition-colors ${
                            page === pageNum
                              ? 'bg-[#0cbde8] text-[#111418] font-semibold'
                              : 'bg-[#232830] text-[#7a889b] hover:text-[#eaedf0] border border-[#2d333b]'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={page >= totalPages}
                      className="btn-secondary text-[10px] px-3 py-1.5 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Next →
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Match Tab */}
        {activeTab === 'match' && (
          <MatchResults onRefresh={fetchTeams} />
        )}

        {/* Create Team Modal */}
        <CreateTeamForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleTeamCreated}
        />
      </div>
    </div>
  );
}
