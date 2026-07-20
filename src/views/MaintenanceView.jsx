import React, { useState } from 'react';
import { useHEMS } from '../context/HEMSContext';
import { 
  Wrench, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Calculator, 
  Clock, 
  FileCheck, 
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function MaintenanceView() {
  const { equipment, executePreventiveMaintenance, upcomingAlerts, currentRole } = useHEMS();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [inspectionNotes, setInspectionNotes] = useState('');
  const [customIntervalDays, setCustomIntervalDays] = useState(90);

  const handleExecutePPM = (asset) => {
    setSelectedAsset(asset);
    setCustomIntervalDays(asset.maintenanceFrequencyDays || 90);
    setInspectionNotes(`Standard PPM validation performed for ${asset.name}. Safety check passed.`);
  };

  const handleConfirmPPM = (e) => {
    e.preventDefault();
    if (!selectedAsset) return;

    executePreventiveMaintenance(selectedAsset.id, inspectionNotes, customIntervalDays);
    setSelectedAsset(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Wrench className="h-5 w-5 text-amber-400" />
            Preventive Maintenance & Calibration Engine
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            FR-MNT-1 & FR-MNT-2: Automated frequency calculation (T_next = T_last + &Delta;T_frequency) & 7-day notification alerts
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-cyan-500/30 text-cyan-300">
          <Calculator className="h-4 w-4 text-cyan-400" />
          <span>Formula: T_next = T_last + &Delta;T</span>
        </div>
      </div>

      {/* 7-Day Alert Notification Section (FR-MNT-2) */}
      <div className="glass-panel p-5 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40">
        <div className="flex items-center justify-between border-b border-amber-500/20 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400 animate-bounce" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              FR-MNT-2: 7-Day Calibration & Safety Alerts ({upcomingAlerts.length})
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
            SMS / Email Broadcast Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {upcomingAlerts.map(item => (
            <div key={item.id} className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">{item.id}</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-rose-950 text-rose-400 border border-rose-800">
                    Due: {item.calibrationDueDate}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white mt-1">{item.name}</h4>
                <p className="text-[11px] text-slate-400 font-mono">{item.department} • {item.location}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400">&Delta;T: {item.maintenanceFrequencyDays} days</span>
                {(currentRole === 'biomed' || currentRole === 'admin') && (
                  <button
                    onClick={() => handleExecutePPM(item)}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 transition active:scale-95 shadow"
                  >
                    Complete Inspection &rarr;
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full PPM Schedule Grid */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            Automated PPM Schedule Master Schedule
          </h3>
          <span className="text-xs font-mono text-slate-400">{equipment.length} Tracked Assets</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Equipment ID & Name</th>
                <th className="py-3 px-4">Last Maintenance (T_last)</th>
                <th className="py-3 px-4">Interval (&Delta;T Frequency)</th>
                <th className="py-3 px-4">Calculated Target (T_next)</th>
                <th className="py-3 px-4">Status & Compliance</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {equipment.map(item => {
                const isOverdue = new Date(item.nextMaintenanceDate) < new Date();
                return (
                  <tr key={item.id} className="hover:bg-slate-900/50 transition">
                    <td className="py-3 px-4 font-sans font-bold text-slate-100">
                      <div>{item.name}</div>
                      <span className="text-[11px] font-mono text-cyan-400 font-normal">{item.id} • {item.department}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-300">
                      {item.lastMaintenanceDate}
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded bg-slate-900 border border-slate-800 text-slate-200">
                        {item.maintenanceFrequencyDays} Days
                      </span>
                    </td>

                    <td className="py-3 px-4 font-bold">
                      <span className={isOverdue ? 'text-rose-400' : 'text-emerald-400'}>
                        {item.nextMaintenanceDate}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      {isOverdue ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-950 text-rose-400 border border-rose-800">
                          OVERDUE / NON-COMPLIANT
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                          VALIDATED
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right">
                      {(currentRole === 'biomed' || currentRole === 'admin') && (
                        <button
                          onClick={() => handleExecutePPM(item)}
                          className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 text-cyan-300 border border-cyan-500/40 transition active:scale-95"
                        >
                          Log Inspection
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Execution Modal */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Execute PPM Validation</h3>
                <p className="text-xs text-slate-400 font-mono">FR-MNT-1 Mathematical Formula Engine</p>
              </div>
            </div>

            <form onSubmit={handleConfirmPPM} className="mt-4 space-y-4 text-xs font-mono">
              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
                <span className="text-[10px] text-cyan-400 uppercase font-bold block">Selected Asset</span>
                <h4 className="text-sm font-bold text-white">{selectedAsset.name}</h4>
                <p className="text-[11px] text-slate-400">{selectedAsset.id} • {selectedAsset.department}</p>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Set Operational Interval (&Delta;T Frequency Days)</label>
                <select
                  value={customIntervalDays}
                  onChange={(e) => setCustomIntervalDays(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={30}>30 Days (High Sensitivity / Critical)</option>
                  <option value={60}>60 Days (Bi-Monthly Check)</option>
                  <option value={90}>90 Days (Quarterly Calibration)</option>
                  <option value={180}>180 Days (Semi-Annual Inspection)</option>
                  <option value={365}>365 Days (Annual Overhaul)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Inspection & Safety Test Log Notes</label>
                <textarea
                  rows={3}
                  value={inspectionNotes}
                  onChange={(e) => setInspectionNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-cyan-500"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-cyan-950/50 border border-cyan-500/30 text-cyan-300 text-[11px]">
                Calculated target date: <strong className="text-white font-mono">T_next = Today + {customIntervalDays} days</strong>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedAsset(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Validate & Recalculate T_next
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
