'use client';

/**
 * TeamFilters Component
 *
 * Search and filter bar for the Teams listing page.
 * Provides search, status filter, and skill filter controls.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import { useState, useEffect, useCallback } from 'react';

export interface FilterValues {
  search: string;
  status: string;
  skill: string;
}

interface TeamFiltersProps {
  onFilterChange: (_filters: FilterValues) => void;
  initialFilters?: Partial<FilterValues>;
}

const STATUS_OPTIONS = [
  { value: '', label: 'All Status' },
  { value: 'recruiting', label: 'Recruiting' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
  { value: 'archived', label: 'Archived' },
];

export default function TeamFilters({ onFilterChange, initialFilters }: TeamFiltersProps) {
  const [search, setSearch] = useState(initialFilters?.search || '');
  const [status, setStatus] = useState(initialFilters?.status || '');
  const [skill, setSkill] = useState(initialFilters?.skill || '');

  // Debounced search
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const emitFilters = useCallback(() => {
    onFilterChange({ search: debouncedSearch, status, skill });
  }, [debouncedSearch, status, skill, onFilterChange]);

  useEffect(() => {
    emitFilters();
  }, [emitFilters]);

  const clearFilters = () => {
    setSearch('');
    setStatus('');
    setSkill('');
  };

  const hasFilters = search || status || skill;

  return (
    <div className="card border-[#2d333b] mb-6">
      <div className="flex items-center justify-between mb-4">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#0cbde8]">
          Filter Teams
        </span>
        {hasFilters && (
          <button
            onClick={clearFilters}
            className="font-mono text-[10px] text-[#7a889b] hover:text-[#0cbde8] transition-colors"
          >
            Clear All
          </button>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Search */}
        <div>
          <label
            htmlFor="team-search"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Search
          </label>
          <input
            id="team-search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Team name, description, tags..."
            className="input-field"
          />
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="team-status"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Status
          </label>
          <select
            id="team-status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="input-field appearance-none cursor-pointer"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Skill Filter */}
        <div>
          <label
            htmlFor="team-skill"
            className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b] block mb-1.5"
          >
            Required Skill
          </label>
          <input
            id="team-skill"
            type="text"
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            placeholder="e.g. React, Python..."
            className="input-field"
          />
        </div>
      </div>
    </div>
  );
}
