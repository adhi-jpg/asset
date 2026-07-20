import React from 'react';

// Lightweight Pure SVG Donut Chart
export function SvgDonutChart({ data, total }) {
  let accumulatedAngle = 0;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="relative flex items-center justify-center h-48 w-full">
      <svg className="w-44 h-44 transform -rotate-90" viewBox="0 0 100 100">
        {data.map((item, index) => {
          const percentage = total > 0 ? item.value / total : 0;
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -accumulatedAngle * circumference;
          accumulatedAngle += percentage;

          return (
            <circle
              key={index}
              cx="50"
              cy="50"
              r={radius}
              fill="transparent"
              stroke={item.color}
              strokeWidth="14"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 hover:opacity-80"
            />
          );
        })}
      </svg>
      <div className="absolute text-center">
        <span className="text-xl font-extrabold text-white font-mono">{total}</span>
        <span className="block text-[10px] text-slate-400 font-mono">Total Assets</span>
      </div>
    </div>
  );
}

// Lightweight Pure SVG Bar Chart
export function SvgBarChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div className="h-48 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2">
      {data.map((item, index) => {
        const heightPercent = Math.max((item.count / maxValue) * 100, 10);
        return (
          <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
            <div className="text-[10px] font-mono font-bold text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity">
              {item.count}
            </div>
            <div 
              style={{ height: `${heightPercent}%` }} 
              className="w-full max-w-[28px] bg-gradient-to-t from-purple-600 to-indigo-400 rounded-t-md transition-all duration-300 group-hover:brightness-125"
            ></div>
            <span className="text-[10px] font-mono text-slate-400 truncate max-w-full text-center">
              {item.department.substring(0, 4)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

// Lightweight Pure SVG Trend Line Area Chart
export function SvgTrendChart({ data }) {
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 260 + 20;
    const y = 140 - (d.mttr / 5) * 110;
    return `${x},${y}`;
  }).join(" ");

  const areaPoints = `20,150 ${points} 280,150`;

  return (
    <div className="h-48 w-full flex flex-col justify-between pt-2">
      <svg className="w-full h-36" viewBox="0 0 300 160">
        {/* Grid lines */}
        <line x1="20" y1="30" x2="280" y2="30" stroke="#1e293b" strokeDasharray="3 3" />
        <line x1="20" y1="80" x2="280" y2="80" stroke="#1e293b" strokeDasharray="3 3" />
        <line x1="20" y1="130" x2="280" y2="130" stroke="#1e293b" strokeDasharray="3 3" />

        {/* Gradient fill */}
        <defs>
          <linearGradient id="emeraldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        <polygon points={areaPoints} fill="url(#emeraldGrad)" />
        <polyline points={points} fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" />

        {/* Dots */}
        {data.map((d, i) => {
          const x = (i / (data.length - 1)) * 260 + 20;
          const y = 140 - (d.mttr / 5) * 110;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r="4" fill="#10b981" stroke="#0f172a" strokeWidth="2" />
              <text x={x} y={y - 8} fill="#34d399" fontSize="10" fontFamily="monospace" textAnchor="middle">{d.mttr}h</text>
            </g>
          );
        })}
      </svg>
      <div className="flex justify-between px-4 font-mono text-[10px] text-slate-400 border-t border-slate-800 pt-1">
        {data.map(d => <span key={d.month}>{d.month}</span>)}
      </div>
    </div>
  );
}
