'use client';

/**
 * SkillMatcher Component
 *
 * Visual display of skill match percentage between user skills and a team's required skills.
 * Shows matched vs missing skills with color indicators.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

interface SkillMatcherProps {
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export default function SkillMatcher({ matchScore, matchedSkills, missingSkills }: SkillMatcherProps) {
  const scoreColor =
    matchScore >= 75 ? 'text-emerald-400' :
    matchScore >= 50 ? 'text-[#0cbde8]' :
    matchScore >= 25 ? 'text-[#f5b922]' :
    'text-red-400';

  const barColor =
    matchScore >= 75 ? 'bg-emerald-400' :
    matchScore >= 50 ? 'bg-[#0cbde8]' :
    matchScore >= 25 ? 'bg-[#f5b922]' :
    'bg-red-400';

  return (
    <div className="p-3 rounded-sm bg-[#15181d] border border-[#2d333b]">
      {/* Score */}
      <div className="flex items-center gap-3 mb-3">
        <span className={`font-sans font-bold text-2xl tabular-nums ${scoreColor}`}>
          {matchScore}%
        </span>
        <span className="font-mono text-[10px] uppercase tracking-wider text-[#7a889b]">
          Match Score
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#232830] rounded-full h-1.5 mb-3">
        <div
          className={`h-1.5 rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${matchScore}%` }}
        />
      </div>

      {/* Matched Skills */}
      {matchedSkills.length > 0 && (
        <div className="mb-2">
          <span className="font-mono text-[9px] uppercase tracking-wider text-emerald-400 block mb-1">
            ✓ Matched
          </span>
          <div className="flex flex-wrap gap-1">
            {matchedSkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-emerald-400/10 text-emerald-400 border border-emerald-400/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Missing Skills */}
      {missingSkills.length > 0 && (
        <div>
          <span className="font-mono text-[9px] uppercase tracking-wider text-[#f5b922] block mb-1">
            ✗ Missing
          </span>
          <div className="flex flex-wrap gap-1">
            {missingSkills.map((skill) => (
              <span
                key={skill}
                className="font-mono text-[10px] px-2 py-0.5 rounded-sm bg-[#f5b922]/10 text-[#f5b922] border border-[#f5b922]/20"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
