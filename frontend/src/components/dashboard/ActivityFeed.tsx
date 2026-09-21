'use client';

/**
 * ActivityFeed Component
 *
 * Dashboard widget showing a timeline of recent activity.
 * Currently shows placeholder since most modules are stubs.
 * Will aggregate activity from all modules when they are implemented.
 *
 * @owner Team Member 7 — Teams & Dashboard
 */

export default function ActivityFeed() {
  // Activity feed will aggregate events from all modules once they are active.
  // For now, show an informative placeholder.

  const placeholderActivities = [
    {
      icon: '🏗️',
      text: 'SkillForge platform initialized',
      detail: 'System ready for team collaboration',
      time: 'System',
    },
    {
      icon: '👥',
      text: 'Teams module is live',
      detail: 'Create and join teams, find skill-based matches',
      time: 'Active',
    },
    {
      icon: '⏳',
      text: 'More modules coming soon',
      detail: 'Skills, Projects, Assessments, Certifications, Reviews',
      time: 'Pending',
    },
  ];

  return (
    <div className="card border-[#2d333b]">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-sans font-bold text-[#eaedf0] text-sm">📈 Activity</h2>
        <span className="font-mono text-[10px] text-[#7a889b] uppercase tracking-wider">
          Recent
        </span>
      </div>

      <div className="space-y-3">
        {placeholderActivities.map((activity, idx) => (
          <div
            key={idx}
            className="flex items-start gap-3 p-3 rounded-sm bg-[#15181d] border border-[#2d333b] hover:border-[#475363] transition-colors duration-200 cursor-default"
          >
            <span className="text-lg flex-shrink-0 mt-0.5">{activity.icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-sans font-semibold text-[#eaedf0]">
                {activity.text}
              </p>
              <p className="font-mono text-[10px] text-[#7a889b] mt-0.5">
                {activity.detail}
              </p>
            </div>
            <span className="font-mono text-[10px] text-[#7a889b] whitespace-nowrap bg-[#232830] px-2 py-0.5 rounded-sm border border-[#2d333b]">
              {activity.time}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-3 border-t border-[#2d333b]">
        <p className="font-mono text-[10px] text-[#7a889b] text-center">
          Full activity feed will populate as you use SkillForge modules
        </p>
      </div>
    </div>
  );
}
