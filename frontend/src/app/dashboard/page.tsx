'use client';

/**
 * Dashboard Page
 *
 * Main overview page for authenticated users.
 * Aggregates summary cards from all modules with graceful empty states
 * for modules that are not yet implemented.
 *
 * Features:
 *   - Stats overview with key metrics
 *   - Quick action shortcut buttons
 *   - Skill summary card (pending Skills module)
 *   - Teams summary card (live)
 *   - Recent projects card (pending Projects module)
 *   - Assessment scores card (pending Assessments module)
 *   - Activity feed
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

import StatsOverview from '@/components/dashboard/StatsOverview';
import QuickActions from '@/components/dashboard/QuickActions';
import SkillSummaryCard from '@/components/dashboard/SkillSummaryCard';
import RecentProjectsCard from '@/components/dashboard/RecentProjectsCard';
import AssessmentScoreCard from '@/components/dashboard/AssessmentScoreCard';
import TeamsSummaryCard from '@/components/dashboard/TeamsSummaryCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-[#15181d] p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <p className="eyebrow mb-2">
            Dashboard · Command Center
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#eaedf0]">
            Welcome Back
          </h1>
          <p className="text-sm text-[#7a889b] mt-1 font-sans">
            Your SkillForge overview — skills, projects, teams, and activity at a glance.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="mb-6">
          <StatsOverview />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b]">
              Quick Actions
            </span>
          </div>
          <QuickActions />
        </div>

        {/* Main Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <SkillSummaryCard />
          <TeamsSummaryCard />
          <RecentProjectsCard />
          <AssessmentScoreCard />
        </div>

        {/* Activity Feed — Full Width */}
        <ActivityFeed />
      </div>
    </div>
  );
}
