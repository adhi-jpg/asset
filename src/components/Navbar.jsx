import React from 'react';
import { useHEMS } from '../context/HEMSContext';
import { 
  Activity, 
  ShieldCheck, 
  Bell, 
  QrCode, 
  Search, 
  AlertTriangle, 
  Lock, 
  Stethoscope,
  Building2
} from 'lucide-react';
import RoleSelector from './RoleSelector';

export default function Navbar({ activeTab, setActiveTab }) {
  const { 
    currentRole, 
    setIsQrScannerOpen, 
    upcomingAlerts, 
    activeNotification,
    setActiveNotification 
  } = useHEMS();

  const urgentCount = upcomingAlerts.length;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-800 bg-slate-950/90 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="flex items-center justify-between gap-4">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-white/20">
            <Activity className="h-6 w-6 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-cyan-400 bg-clip-text text-transparent">
                HEMS
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-400 border border-cyan-800/50 font-mono">
                v1.0.0 SRS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Hospital Equipment Management System
            </p>
          </div>
        </div>

        {/* Center - Quick System Badges */}
        <div className="hidden lg:flex items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-emerald-500/30 text-emerald-400 shadow-inner">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Uptime: 99.9%</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-cyan-500/30 text-cyan-400">
            <Lock className="h-3.5 w-3.5 text-cyan-400" />
            <span>AES-256 | TLS 1.3</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-purple-500/30 text-purple-400">
            <Building2 className="h-3.5 w-3.5" />
            <span>St. Jude Central Hospital</span>
          </div>
        </div>

        {/* Right Section - Controls & Role Selector */}
        <div className="flex items-center gap-3">
          {/* Quick QR Scanner Launcher */}
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-cyan-600/20 text-cyan-300 hover:bg-cyan-600/30 border border-cyan-500/40 transition-all duration-200 shadow-sm active:scale-95"
            title="Scan Asset QR Code"
          >
            <QrCode className="h-4 w-4 text-cyan-400" />
            <span className="hidden md:inline">Scan QR Code</span>
          </button>

          {/* Alert Bell */}
          <button
            onClick={() => setActiveTab('breakdown')}
            className="relative p-2 rounded-lg bg-slate-900 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 transition-all"
            title={`${urgentCount} active calibration / failure alerts`}
          >
            <Bell className="h-5 w-5" />
            {urgentCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center animate-bounce shadow-md shadow-rose-500/50">
                {urgentCount}
              </span>
            )}
          </button>

          {/* Role Switcher */}
          <RoleSelector />
        </div>
      </div>
    </header>
  );
}
