import React, { useEffect } from 'react';
import { useHEMS } from '../context/HEMSContext';
import { AlertTriangle, CheckCircle, Bell, X, Volume2 } from 'lucide-react';

export default function NotificationToast() {
  const { activeNotification, setActiveNotification } = useHEMS();

  useEffect(() => {
    if (activeNotification && activeNotification.type !== 'urgent') {
      const timer = setTimeout(() => {
        setActiveNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [activeNotification, setActiveNotification]);

  if (!activeNotification) return null;

  const isUrgent = activeNotification.type === 'urgent';
  const isSuccess = activeNotification.type === 'success';

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-bounce">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl flex items-start gap-3 ${
        isUrgent
          ? 'bg-rose-950/95 border-rose-500/80 text-rose-100 ring-2 ring-rose-500/50 shadow-rose-900/50'
          : isSuccess
          ? 'bg-emerald-950/95 border-emerald-500/80 text-emerald-100 shadow-emerald-900/50'
          : 'bg-slate-900/95 border-cyan-500/80 text-slate-100 shadow-cyan-900/50'
      }`}>
        <div className={`p-2.5 rounded-xl ${
          isUrgent ? 'bg-rose-600 text-white animate-pulse' :
          isSuccess ? 'bg-emerald-600 text-white' : 'bg-cyan-600 text-white'
        }`}>
          {isUrgent ? <AlertTriangle className="h-6 w-6" /> : isSuccess ? <CheckCircle className="h-6 w-6" /> : <Bell className="h-6 w-6" />}
        </div>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h4 className="text-xs font-extrabold uppercase tracking-wider">{activeNotification.title}</h4>
            {isUrgent && (
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-rose-500 text-white rounded">
                FR-BRK-2 BROADCAST
              </span>
            )}
          </div>
          <p className="text-xs mt-1 font-medium leading-relaxed">{activeNotification.message}</p>
        </div>

        <button
          onClick={() => setActiveNotification(null)}
          className="p-1 rounded-lg hover:bg-white/10 transition"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
