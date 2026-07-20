import React from 'react';
import { useHEMS } from '../context/HEMSContext';
import StatCard from '../components/StatCard';
import { SvgDonutChart, SvgBarChart, SvgTrendChart } from '../components/SvgCharts';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Zap, 
  BarChart2, 
  HeartPulse,
  Building
} from 'lucide-react';

export default function DashboardView({ onNavigate }) {
  const { equipment, tickets, mttr, mtbf, upcomingAlerts } = useHEMS();

  const totalAssets = equipment.length;
  const inUseCount = equipment.filter(e => e.status === 'In-Use').length;
  const availableCount = equipment.filter(e => e.status === 'Available').length;
  const brokenCount = equipment.filter(e => e.status === 'Broken').length;
  const maintenanceCount = equipment.filter(e => e.status === 'Under Maintenance').length;
  const criticalCount = equipment.filter(e => e.isCriticalLifeSupport).length;

  const ppmComplianceRate = Math.round(
    ((totalAssets - upcomingAlerts.length) / totalAssets) * 100
  );

  // Chart Data
  const statusData = [
    { name: 'Available', value: availableCount, color: '#10b981' },
    { name: 'In-Use', value: inUseCount, color: '#06b6d4' },
    { name: 'Under Maintenance', value: maintenanceCount, color: '#f59e0b' },
    { name: 'Broken', value: brokenCount, color: '#f43f5e' }
  ];

  const departmentCounts = equipment.reduce((acc, curr) => {
    acc[curr.department] = (acc[curr.department] || 0) + 1;
    return acc;
  }, {});

  const departmentData = Object.keys(departmentCounts).map(dept => ({
    department: dept,
    count: departmentCounts[dept]
  }));

  const mttrTrendData = [
    { month: 'Mar', mttr: 3.8 },
    { month: 'Apr', mttr: 3.2 },
    { month: 'May', mttr: 2.9 },
    { month: 'Jun', mttr: 2.6 },
    { month: 'Jul', mttr: parseFloat(mttr) }
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 7-Day Calibration Alert Banner (FR-MNT-2 & Operational Excellence) */}
      {upcomingAlerts.length > 0 && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-slate-900 to-amber-950/90 border border-amber-500/50 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg shadow-amber-900/20">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-amber-400 uppercase">FR-MNT-2 AUTOMATED ALERT</span>
                <span className="px-2 py-0.5 text-[10px] font-bold bg-amber-500 text-slate-950 rounded-full font-mono">
                  7-DAY DEADLINE WINDOW
                </span>
              </div>
              <p className="text-sm font-semibold text-white mt-0.5">
                {upcomingAlerts.length} medical devices require immediate calibration or maintenance inspection
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('maintenance')}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition shadow-md whitespace-nowrap active:scale-95"
          >
            Execute Inspection &rarr;
          </button>
        </div>
      )}

      {/* Top Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Mean Time to Repair (MTTR)"
          value={`${mttr} hrs`}
          subtitle="Target SLA: < 2.0 hrs"
          icon={Clock}
          color={parseFloat(mttr) <= 2.5 ? "emerald" : "amber"}
          trend="-0.4 hrs"
        />
        <StatCard
          title="Mean Time Between Failures"
          value={`${mtbf} days`}
          subtitle="System Reliability Index"
          icon={Zap}
          color="cyan"
          trend="+12 days"
        />
        <StatCard
          title="PPM Compliance Rate"
          value={`${ppmComplianceRate}%`}
          subtitle="FR-MNT-1 Calibration Standard"
          icon={ShieldCheck}
          color={ppmComplianceRate >= 90 ? "emerald" : "rose"}
          trend="+4%"
        />
        <StatCard
          title="Critical Life Support Units"
          value={criticalCount}
          subtitle="Ventilators, Defibrillators, etc."
          icon={HeartPulse}
          color="purple"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Asset Operational Status Distribution */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="h-4 w-4 text-cyan-400" />
              Asset Operational Status
            </h3>
            <span className="text-xs font-mono text-slate-400">{totalAssets} Total</span>
          </div>

          <SvgDonutChart data={statusData} total={totalAssets} />

          <div className="grid grid-cols-2 gap-2 text-xs font-mono border-t border-slate-800 pt-3">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="text-slate-400 truncate">{item.name}:</span>
                <span className="text-white font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: MTTR Audit Trend (Operational Excellence) */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <BarChart2 className="h-4 w-4 text-emerald-400" />
              MTTR Audit Performance Trend
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
              Real-time KPI
            </span>
          </div>

          <SvgTrendChart data={mttrTrendData} />

          <p className="text-[11px] text-slate-400 font-mono text-center border-t border-slate-800 pt-3">
            Mean Time To Repair for critical life-support units (Ventilators, Defibrillators).
          </p>
        </div>

        {/* Chart 3: Departmental Equipment Allocation */}
        <div className="glass-card p-5 rounded-2xl border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Building className="h-4 w-4 text-purple-400" />
              Equipment Allocation by Ward
            </h3>
            <span className="text-xs font-mono text-slate-400">{departmentData.length} Wards</span>
          </div>

          <SvgBarChart data={departmentData} />

          <div className="flex justify-between items-center text-[11px] text-slate-400 font-mono border-t border-slate-800 pt-3">
            <span>High Density: ICU</span>
            <button 
              onClick={() => onNavigate('inventory')}
              className="text-cyan-400 hover:underline font-semibold"
            >
              View Catalog &rarr;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
