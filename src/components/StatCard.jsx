import React from 'react';

export default function StatCard({ title, value, subtitle, icon: Icon, trend, color = 'cyan' }) {
  const colorMap = {
    cyan: 'from-cyan-500/20 to-blue-500/10 text-cyan-400 border-cyan-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/10 text-emerald-400 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-400 border-amber-500/30',
    rose: 'from-rose-500/20 to-red-500/10 text-rose-400 border-rose-500/30',
    purple: 'from-purple-500/20 to-indigo-500/10 text-purple-400 border-purple-500/30'
  };

  const themeClass = colorMap[color] || colorMap.cyan;

  return (
    <div className={`p-5 rounded-2xl glass-card border bg-gradient-to-br ${themeClass} transition-all duration-300 hover:scale-[1.02]`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</span>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-2xl font-extrabold text-white tracking-tight font-mono">{value}</span>
        {trend && (
          <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded font-mono ${
            trend.startsWith('+') ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
          }`}>
            {trend}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="text-xs text-slate-400 font-mono mt-1">{subtitle}</p>
      )}
    </div>
  );
}
