import React from 'react';
import { 
  LayoutDashboard, 
  Boxes, 
  Wrench, 
  AlertOctagon, 
  FileText, 
  ShieldAlert,
  Sliders,
  Sparkles
} from 'lucide-react';
import { useHEMS } from '../context/HEMSContext';

export default function Sidebar({ activeTab, setActiveTab }) {
  const { tickets, upcomingAlerts, currentRole } = useHEMS();

  const openTicketsCount = tickets.filter(t => t.status !== 'Resolved').length;
  const alertCount = upcomingAlerts.length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard & MTTR', icon: LayoutDashboard },
    { id: 'inventory', label: 'Asset Inventory', icon: Boxes },
    { id: 'maintenance', label: 'PPM & Calibration', icon: Wrench, badge: alertCount ? alertCount : null, badgeColor: 'bg-amber-500/20 text-amber-400 border border-amber-500/30' },
    { id: 'breakdown', label: 'Breakdown Tickets', icon: AlertOctagon, badge: openTicketsCount ? openTicketsCount : null, badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/30' },
    { id: 'vendors', label: 'Vendors & AMC/CMC', icon: FileText },
    { id: 'audit', label: 'Audit Logs (AES-256)', icon: ShieldAlert }
  ];

  return (
    <aside className="w-full lg:w-64 shrink-0 glass-panel border-b lg:border-b-0 lg:border-r border-slate-800/80 p-4 flex flex-col justify-between">
      <div className="space-y-6">
        {/* Role Quick Notice */}
        <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-[10px] uppercase font-semibold text-slate-400 tracking-wider">Active Workspace</p>
            <p className="text-xs font-bold text-slate-200 capitalize">{currentRole} Portal</p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-600/30 via-slate-800 to-slate-800 text-cyan-300 border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/60 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`h-4 w-4 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* System Footer info */}
      <div className="pt-4 mt-6 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1 font-mono">
        <div className="flex justify-between">
          <span>Formula Engine:</span>
          <span className="text-cyan-400 font-sans">T_next = T_last + ΔT</span>
        </div>
        <div className="flex justify-between">
          <span>Compliance:</span>
          <span className="text-emerald-400">JCI / NABH Standard</span>
        </div>
      </div>
    </aside>
  );
}
