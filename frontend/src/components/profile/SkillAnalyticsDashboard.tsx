import React, { useEffect, useState } from 'react';
import { getSkillAnalysis } from '../../services/profile.service';
import SkillRadarChart, { RadarMetric } from './SkillRadarChart';

interface CategoryBreakdown {
  category: string;
  score: number;
  skillsCount: number;
  status: string;
}

interface StrengthItem {
  title: string;
  description: string;
}

interface SkillGapItem {
  area: string;
  gap: string;
  recommendation: string;
}

interface HighImpactSkill {
  name: string;
  category: string;
  impact: string;
  reason: string;
  difficulty: string;
}

interface SkillAnalysisData {
  hasSkills: boolean;
  message?: string;
  skillsCount?: number;
  analyzedAt?: string;
  archetype?: string;
  summary?: string;
  marketReadinessScore?: number;
  marketTier?: string;
  radarMetrics?: RadarMetric[];
  categoryBreakdown?: CategoryBreakdown[];
  strengths?: StrengthItem[];
  skillGaps?: SkillGapItem[];
  nextHighImpactSkills?: HighImpactSkill[];
  practicalAdvice?: string;
}

interface SkillAnalyticsDashboardProps {
  userId: string;
  skillsCount: number;
}

export default function SkillAnalyticsDashboard({ userId, skillsCount }: SkillAnalyticsDashboardProps) {
  const [analysis, setAnalysis] = useState<SkillAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalysis = async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      const data = await getSkillAnalysis(userId, refresh);
      setAnalysis(data);
    } catch (err: any) {
      console.error('Failed to load skill analysis:', err);
      setError('Failed to generate skill analysis. Please try refreshing.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (userId && skillsCount > 0) {
      fetchAnalysis(false);
    } else {
      setLoading(false);
    }
  }, [userId, skillsCount]);

  if (skillsCount === 0) {
    return null;
  }

  if (loading) {
    return (
      <div className="mt-8 interior-panel p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex flex-col items-center justify-center py-12 gap-4">
          <div className="w-10 h-10 border-4 border-cyan/20 border-t-cyan rounded-full animate-spin"></div>
          <div className="text-center">
            <h4 className="font-bold text-gray-800 text-base">Generating AI Skill Intelligence...</h4>
            <p className="text-gray-500 text-sm mt-1">Gemini AI is analyzing your competency distribution, market readiness, and skill gaps.</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !analysis || !analysis.hasSkills) {
    return (
      <div className="mt-8 interior-panel p-8 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">{analysis?.message || error || 'Unable to generate analysis at this moment.'}</p>
          <button
            onClick={() => fetchAnalysis(true)}
            className="mt-4 px-4 py-2 bg-cyan/10 hover:bg-cyan/20 text-cyan font-bold text-xs rounded-xl transition-colors"
          >
            Retry Analysis
          </button>
        </div>
      </div>
    );
  }

  const score = analysis.marketReadinessScore || 70;
  // Circumference for 44px radius: 2 * Math.PI * 44 ≈ 276.46
  const strokeDashoffset = 276.46 - (276.46 * score) / 100;

  return (
    <div className="mt-8 interior-panel p-6 md:p-8 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="p-2 bg-gradient-to-tr from-cyan/20 to-blue-500/10 text-cyan rounded-xl border border-cyan/20">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold text-gray-900 font-sans">AI Skill Competency & Market Intelligence</h3>
                <span className="px-2.5 py-0.5 text-[11px] font-bold bg-cyan/10 text-cyan rounded-full border border-cyan/20">
                  ✨ Gemini 3.5 AI
                </span>
              </div>
              <p className="text-gray-500 text-xs mt-0.5">
                Multi-dimensional technical benchmark, gap detection, and practical roadmap based on your current proficiencies
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => fetchAnalysis(true)}
          disabled={refreshing}
          className="self-start md:self-auto px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-all flex items-center gap-2 shadow-sm disabled:opacity-60"
        >
          <svg className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {refreshing ? 'Analyzing...' : 'Refresh AI Analysis'}
        </button>
      </div>

      {/* Top Highlights: Readiness Gauge & Archetype Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Market Readiness Gauge */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="relative w-32 h-32 flex items-center justify-center my-2">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="#e2e8f0"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="44"
                stroke="url(#gaugeGradient)"
                strokeWidth="8"
                strokeDasharray="276.46"
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="none"
                className="transition-all duration-1000 ease-out"
              />
              <defs>
                <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0cbde8" />
                  <stop offset="100%" stopColor="#10b981" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-extrabold text-gray-900 tracking-tight">{score}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Readiness</span>
            </div>
          </div>

          <div className="mt-2">
            <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
              {analysis.marketTier || 'Mid-Level Full-Stack Ready'}
            </span>
            <p className="text-xs text-gray-500 mt-2">
              Composite alignment benchmarked against active industry hiring standards
            </p>
          </div>
        </div>

        {/* Card 2 & 3: Archetype & Executive Summary */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-gradient-to-br from-cyan/5 via-white to-gray-50 border border-cyan/15 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-extrabold text-cyan uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyan animate-pulse"></span>
                Identified Developer Archetype
              </span>
              <span className="text-[11px] text-gray-400 font-medium">
                {analysis.skillsCount} skills tracked
              </span>
            </div>
            <h4 className="text-2xl font-bold text-gray-900 font-sans tracking-tight">
              {analysis.archetype || 'Full-Stack Software Engineer'}
            </h4>
            <p className="text-sm text-gray-700 mt-3 leading-relaxed">
              {analysis.summary}
            </p>
          </div>

          <div className="mt-5 pt-4 border-t border-gray-100/80 flex flex-wrap items-center gap-4 text-xs text-gray-600">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span><strong>Primary Depth:</strong> Frontend & TypeScript</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span><strong>Stack Profile:</strong> Polyglot Application Development</span>
            </div>
          </div>
        </div>
      </div>

      {/* Graphical Charts Section: Radar Chart + Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-gray-50/70 p-6 rounded-2xl border border-gray-100">
        {/* Left: 6-Axis Competency Radar Chart */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-2 px-2">
            <div>
              <h4 className="text-base font-bold text-gray-900 font-sans">Full-Stack Competency Radar</h4>
              <p className="text-xs text-gray-500">Multi-axis proficiency mapping against industry standard profiles</p>
            </div>
            <span className="text-xs font-semibold text-gray-400 hidden sm:inline">Hover nodes for exact stats</span>
          </div>

          <div className="w-full flex justify-center py-2">
            {analysis.radarMetrics && <SkillRadarChart metrics={analysis.radarMetrics} />}
          </div>
        </div>

        {/* Right: Domain Distribution & Mastery Matrix */}
        <div className="lg:col-span-5 space-y-4">
          <div className="mb-2">
            <h4 className="text-base font-bold text-gray-900 font-sans">Domain Competency Distribution</h4>
            <p className="text-xs text-gray-500">Categorical density and proficiency breakdown</p>
          </div>

          <div className="space-y-3.5">
            {analysis.categoryBreakdown?.map((cat, idx) => (
              <div key={idx} className="p-4 bg-white rounded-xl border border-gray-200/80 shadow-xs hover:border-cyan/30 transition-all">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-bold text-gray-800">{cat.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-gray-400">({cat.skillsCount} skills)</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      cat.status === 'Strong' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : cat.status === 'Developing' || cat.status === 'Balanced'
                        ? 'bg-cyan/10 text-cyan border border-cyan/20'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {cat.status}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden relative">
                  <div 
                    className={`h-full rounded-full transition-all duration-700 ${
                      cat.score >= 70 ? 'bg-gradient-to-r from-cyan to-blue-500' :
                      cat.score >= 50 ? 'bg-gradient-to-r from-cyan to-emerald-400' :
                      'bg-gradient-to-r from-amber-400 to-amber-500'
                    }`}
                    style={{ width: `${Math.min(100, Math.max(8, cat.score))}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                  <span>Proficiency Index</span>
                  <span className="font-bold text-gray-700">{cat.score}/100</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practical AI Analysis: Strengths vs Gaps */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Core Strengths */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </span>
            <h4 className="font-bold text-base text-gray-900 font-sans">Core Verified Strengths</h4>
          </div>

          <div className="space-y-3">
            {analysis.strengths?.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-emerald-50/40 rounded-xl border border-emerald-100/60">
                <h5 className="font-bold text-xs text-emerald-900">{item.title}</h5>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Identified Gaps */}
        <div className="p-6 rounded-2xl bg-white border border-gray-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100">
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-lg">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </span>
            <h4 className="font-bold text-base text-gray-900 font-sans">Identified Architecture & Stack Gaps</h4>
          </div>

          <div className="space-y-3">
            {analysis.skillGaps?.map((item, idx) => (
              <div key={idx} className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-100/60">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-xs text-amber-900">{item.area}</h5>
                  <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">Priority Gap</span>
                </div>
                <p className="text-xs text-gray-700 mt-1 font-medium">{item.gap}</p>
                <p className="text-[11px] text-gray-500 mt-1.5 flex items-start gap-1">
                  <span className="text-cyan font-bold">💡 Fix:</span> {item.recommendation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practical Action Matrix: High Impact Next Skills */}
      {analysis.nextHighImpactSkills && analysis.nextHighImpactSkills.length > 0 && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 border-b border-gray-800 pb-4">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan flex items-center gap-1.5">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                AI Synergy Roadmap
              </span>
              <h4 className="text-lg font-bold text-white font-sans mt-0.5">Top Recommended Next Skills</h4>
            </div>
            <span className="text-xs text-gray-400">
              Ranked by maximum career & hiring appeal leverage
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {analysis.nextHighImpactSkills.map((item, idx) => (
              <div 
                key={idx}
                className="p-5 rounded-xl bg-gray-800/80 border border-gray-700/80 backdrop-blur-sm flex flex-col justify-between hover:border-cyan/50 hover:bg-gray-800 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">{item.category}</span>
                    <span className="px-2 py-0.5 bg-cyan/20 text-cyan text-[11px] font-extrabold rounded-md border border-cyan/30">
                      {item.impact}
                    </span>
                  </div>
                  <h5 className="text-base font-bold text-white group-hover:text-cyan transition-colors">{item.name}</h5>
                  <p className="text-xs text-gray-300 mt-2 leading-relaxed">{item.reason}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-gray-700/60 flex items-center justify-between text-[11px]">
                  <span className="text-gray-400">Learning Curve</span>
                  <span className="font-semibold text-gray-200">{item.difficulty}</span>
                </div>
              </div>
            ))}
          </div>

          {/* 30-Day Directive Banner */}
          {analysis.practicalAdvice && (
            <div className="mt-6 p-4 rounded-xl bg-cyan/10 border border-cyan/30 flex items-start gap-3">
              <span className="text-xl">🚀</span>
              <div>
                <span className="text-xs font-bold text-cyan uppercase tracking-wider block">30-Day Practical Engineering Directive</span>
                <p className="text-xs text-gray-200 mt-0.5 leading-relaxed">{analysis.practicalAdvice}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
