'use client';

/**
 * MatchResults Component
 *
 * Skill-based team matching interface.
 * User enters their skills, finds matching teams sorted by score.
 * Calls POST /api/teams/match via teamService.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import React, { useState } from 'react';
import type { TeamMatchResult } from '@/types';
import { teamService } from '@/services/team.service';
import TeamCard from './TeamCard';
import SkillMatcher from './SkillMatcher';

interface MatchResultsProps {
  onRefresh?: () => void;
}

export default function MatchResults({ onRefresh }: MatchResultsProps) {
  const [skillInput, setSkillInput] = useState('');
  const [results, setResults] = useState<TeamMatchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const skills = skillInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    if (skills.length === 0) {
      setError('Enter at least one skill to find matches');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await teamService.findMatches(skills);
      setResults(response.data || []);
      setSearched(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to find matches';
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setError(axiosErr?.response?.data?.message || msg);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div>
      {/* Skill Input */}
      <div className="card border-[#2d333b] mb-6">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#0cbde8] block mb-3">
          Algorithmic Skill Matching
        </span>
        <p className="text-xs text-[#7a889b] mb-4">
          Enter your skills (comma-separated) to find teams that match your expertise.
          Results are ranked by match score.
        </p>
        <div className="flex gap-3">
          <input
            type="text"
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. React, Node.js, Python, MongoDB..."
            className="input-field flex-1"
            id="skill-match-input"
          />
          <button
            onClick={handleSearch}
            disabled={loading}
            className="btn-primary whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Matching...' : 'Find Matches'}
          </button>
        </div>
        {error && (
          <p className="font-mono text-[10px] text-red-400 mt-2">{error}</p>
        )}
      </div>

      {/* Results */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin h-5 w-5 border-2 border-[#0cbde8] border-t-transparent rounded-full mr-3" />
          <span className="font-mono text-xs text-[#7a889b]">Calculating match scores...</span>
        </div>
      )}

      {!loading && searched && results.length === 0 && (
        <div className="card border-[#2d333b] text-center py-12">
          <p className="font-mono text-xs text-[#7a889b]">
            No matching teams found for your skills.
          </p>
          <p className="text-[10px] text-[#7a889b] mt-1">
            Try different skills or check back later for new teams.
          </p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b]">
              {results.length} team{results.length !== 1 ? 's' : ''} found
            </span>
            <span className="font-mono text-[10px] text-[#7a889b]">
              Sorted by match score
            </span>
          </div>
          {results.map((result) => (
            <div key={result.team.id || result.team._id} className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <TeamCard team={result.team} onRefresh={onRefresh} />
              </div>
              <div>
                <SkillMatcher
                  matchScore={result.matchScore}
                  matchedSkills={result.matchedSkills}
                  missingSkills={result.missingSkills}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
