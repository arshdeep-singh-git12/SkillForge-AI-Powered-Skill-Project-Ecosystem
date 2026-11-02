import React, { useState } from 'react';

export interface RadarMetric {
  domain: string;
  score: number;
  benchmark: number;
}

interface SkillRadarChartProps {
  metrics: RadarMetric[];
}

export default function SkillRadarChart({ metrics }: SkillRadarChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!metrics || metrics.length < 3) {
    return (
      <div className="text-gray-400 text-sm text-center py-12">
        At least 3 skill domains required to draw radar graph.
      </div>
    );
  }

  const size = 380;
  const center = size / 2;
  const radius = 130;
  const totalAxes = metrics.length;
  const angleSlice = (Math.PI * 2) / totalAxes;

  // Grid levels (20%, 40%, 60%, 80%, 100%)
  const levels = [0.2, 0.4, 0.6, 0.8, 1.0];

  // Helper to convert polar to cartesian
  const getCoordinates = (value: number, index: number, maxRadius = radius) => {
    const angle = index * angleSlice - Math.PI / 2;
    const r = (value / 100) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // User polygon path
  const userPoints = metrics.map((m, i) => {
    const { x, y } = getCoordinates(m.score, i);
    return `${x},${y}`;
  }).join(' ');

  // Benchmark polygon path
  const benchmarkPoints = metrics.map((m, i) => {
    const { x, y } = getCoordinates(m.benchmark, i);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="flex flex-col items-center select-none relative">
      <svg 
        viewBox={`0 0 ${size} ${size}`} 
        className="w-full max-w-[400px] h-auto overflow-visible"
      >
        <defs>
          <radialGradient id="radarUserGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#0cbde8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0aa6cc" stopOpacity="0.12" />
          </radialGradient>
          <filter id="radarGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#0cbde8" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Concentric Polygons Background Grid */}
        {levels.map((level, lvlIdx) => {
          const ringPoints = Array.from({ length: totalAxes }).map((_, i) => {
            const angle = i * angleSlice - Math.PI / 2;
            const r = level * radius;
            return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
          }).join(' ');

          return (
            <g key={lvlIdx}>
              <polygon
                points={ringPoints}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth={lvlIdx === levels.length - 1 ? "1.5" : "1"}
                strokeDasharray={lvlIdx < levels.length - 1 ? "2,2" : undefined}
              />
              <text
                x={center + 6}
                y={center - level * radius + 10}
                fill="#94a3b8"
                fontSize="9"
                fontWeight="500"
                className="select-none font-sans"
              >
                {Math.round(level * 100)}%
              </text>
            </g>
          );
        })}

        {/* Axis Spokes */}
        {metrics.map((_, i) => {
          const { x, y } = getCoordinates(100, i);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {/* Industry Benchmark Polygon */}
        <polygon
          points={benchmarkPoints}
          fill="none"
          stroke="#94a3b8"
          strokeWidth="1.5"
          strokeDasharray="4,4"
          className="transition-all duration-500"
        />

        {/* User Skills Polygon */}
        <polygon
          points={userPoints}
          fill="url(#radarUserGradient)"
          stroke="#0cbde8"
          strokeWidth="2.5"
          filter="url(#radarGlow)"
          className="transition-all duration-700 ease-out"
        />

        {/* User Vertex Points */}
        {metrics.map((m, i) => {
          const { x, y } = getCoordinates(m.score, i);
          const isHovered = hoveredIndex === i;

          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={isHovered ? 7 : 4.5}
                fill="#ffffff"
                stroke="#0cbde8"
                strokeWidth={isHovered ? 3 : 2}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            </g>
          );
        })}

        {/* Axis Labels (Domain Titles & Badges) */}
        {metrics.map((m, i) => {
          const angle = i * angleSlice - Math.PI / 2;
          const labelDist = radius + 32;
          const lx = center + labelDist * Math.cos(angle);
          const ly = center + labelDist * Math.sin(angle);
          const isHovered = hoveredIndex === i;

          let textAnchor: "middle" | "start" | "end" = "middle";
          if (Math.cos(angle) > 0.3) textAnchor = "start";
          if (Math.cos(angle) < -0.3) textAnchor = "end";

          return (
            <g 
              key={`label-${i}`} 
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <text
                x={lx}
                y={ly - 4}
                textAnchor={textAnchor}
                fontSize="11"
                fontWeight={isHovered ? "700" : "600"}
                fill={isHovered ? "#0891b2" : "#1e293b"}
                className="font-sans"
              >
                {m.domain}
              </text>
              <text
                x={lx}
                y={ly + 10}
                textAnchor={textAnchor}
                fontSize="10"
                fontWeight="700"
                fill={m.score >= m.benchmark ? "#059669" : "#0284c7"}
                className="font-sans"
              >
                {m.score}% <tspan fill="#94a3b8" fontWeight="400">({m.benchmark}% avg)</tspan>
              </text>
            </g>
          );
        })}
      </svg>

      {/* Floating Tooltip when vertex hovered */}
      {hoveredIndex !== null && (
        <div className="absolute bottom-2 bg-gray-900/90 backdrop-blur-md text-white text-xs px-4 py-2 rounded-xl shadow-xl border border-gray-700 pointer-events-none transition-all flex items-center gap-4">
          <div>
            <span className="font-bold text-[#38bdf8] block text-[13px]">{metrics[hoveredIndex].domain}</span>
            <span className="text-gray-300">Your Competency: <strong className="text-white">{metrics[hoveredIndex].score}%</strong></span>
          </div>
          <div className="border-l border-gray-700 pl-3">
            <span className="text-gray-400 block text-[11px]">Benchmark</span>
            <span className="text-gray-300">{metrics[hoveredIndex].benchmark}%</span>
          </div>
          <div className="border-l border-gray-700 pl-3">
            <span className="text-gray-400 block text-[11px]">Gap</span>
            <span className={metrics[hoveredIndex].score >= metrics[hoveredIndex].benchmark ? 'text-emerald-400 font-bold' : 'text-amber-400 font-bold'}>
              {metrics[hoveredIndex].score >= metrics[hoveredIndex].benchmark ? `+${metrics[hoveredIndex].score - metrics[hoveredIndex].benchmark}%` : `${metrics[hoveredIndex].score - metrics[hoveredIndex].benchmark}%`}
            </span>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs font-medium text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-3.5 h-3.5 rounded bg-[#0cbde8]/30 border-2 border-[#0cbde8]"></div>
          <span>Your Skills Profile</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-0 border-t-2 border-dashed border-gray-400"></div>
          <span>Industry Benchmark</span>
        </div>
      </div>
    </div>
  );
}
