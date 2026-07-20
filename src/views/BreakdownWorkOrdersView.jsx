import React, { useState } from 'react';
import { useHEMS } from '../context/HEMSContext';
import { 
  AlertOctagon, 
  Clock, 
  UserCheck, 
  CheckCircle2, 
  Plus, 
  X, 
  Wrench, 
  ShieldAlert, 
  QrCode,
  PackageCheck
} from 'lucide-react';

export default function BreakdownWorkOrdersView({ assetForBreakdown, clearAssetForBreakdown }) {
  const { 
    tickets, 
    equipment, 
    reportBreakdown, 
    updateTicketStatus, 
    currentRole, 
    setIsQrScannerOpen 
  } = useHEMS();

  // Create Breakdown Ticket State (FR-BRK-1)
  const [isReportModalOpen, setIsReportModalOpen] = useState(!!assetForBreakdown);
  const [selectedAssetId, setSelectedAssetId] = useState(assetForBreakdown ? assetForBreakdown.id : (equipment[0]?.id || ''));
  const [issueCategory, setIssueCategory] = useState('Hardware / Mechanical Failure');
  const [description, setDescription] = useState('');
  const [reporterName, setReporterName] = useState('Dr. Sarah Jenkins');

  // Resolve Ticket Modal State
  const [selectedTicketToResolve, setSelectedTicketToResolve] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [repairHours, setRepairHours] = useState(2.0);
  const [partName, setPartName] = useState('');
  const [partCost, setPartCost] = useState(150);

  const categories = [
    'Hardware / Mechanical Failure',
    'Gas Flow / Sensor Calibration Error',
    'Power Supply & Battery Fault',
    'Display / Touch Screen Unresponsive',
    'Fluid Leakage / Tubing Rupture',
    'Software / Firmware Freeze'
  ];

  const handleCreateTicketSubmit = (e) => {
    e.preventDefault();
    if (!description) {
      alert("Please provide a brief description of the failure.");
      return;
    }

    reportBreakdown(selectedAssetId, issueCategory, description, reporterName);
    setIsReportModalOpen(false);
    if (clearAssetForBreakdown) clearAssetForBreakdown();
    setDescription('');
  };

  const handleResolveSubmit = (e) => {
    e.preventDefault();
    if (!selectedTicketToResolve) return;

    const partsArr = partName ? [{ partName, cost: parseFloat(partCost) || 0, date: new Date().toISOString().split('T')[0] }] : [];
    
    updateTicketStatus(
      selectedTicketToResolve.id,
      'Resolved',
      selectedTicketToResolve.assignedTo,
      resolutionNotes || 'Repaired and recalibrated to clinical safety specs.',
      parseFloat(repairHours) || 2.0,
      partsArr
    );

    setSelectedTicketToResolve(null);
    setResolutionNotes('');
    setPartName('');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Rapid Ticket Trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <AlertOctagon className="h-5 w-5 text-rose-400" />
            Breakdown & Work Order Management
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            FR-BRK-1 & FR-BRK-2: Instant status transition to "Broken", high-priority broadcast & SLA tracking
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsQrScannerOpen(true)}
            className="flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <QrCode className="h-4 w-4 text-cyan-400" />
            <span>Scan Tag</span>
          </button>

          <button
            onClick={() => setIsReportModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/20 transition active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span>Report Equipment Breakdown</span>
          </button>
        </div>
      </div>

      {/* Ticket List View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {tickets.map(ticket => {
          const isOpen = ticket.status !== 'Resolved';
          const isUrgent = ticket.priority === 'Urgent';

          return (
            <div 
              key={ticket.id}
              className={`p-5 rounded-2xl glass-card border transition-all duration-200 ${
                isUrgent && isOpen 
                  ? 'border-rose-500/60 bg-gradient-to-br from-rose-950/40 via-slate-900 to-slate-900'
                  : 'border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-rose-400">{ticket.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                      isUrgent ? 'bg-rose-600 text-white animate-pulse' : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}>
                      Priority: {ticket.priority}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-300">
                      {ticket.status}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1.5">{ticket.assetName}</h3>
                  <p className="text-xs text-slate-400 font-mono">{ticket.assetId} • {ticket.department}</p>
                </div>

                <div className="text-right font-mono">
                  <div className="text-[11px] text-slate-400">Target SLA</div>
                  <div className="text-xs font-bold text-cyan-400">{ticket.slaHoursRemaining}h remaining</div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1 font-mono">
                <div><span className="text-slate-500">Category:</span> {ticket.issueCategory}</div>
                <div><span className="text-slate-500">Reported By:</span> {ticket.reportedBy} ({ticket.reportedRole})</div>
                <div><span className="text-slate-500">Details:</span> <span className="text-slate-200 font-sans">{ticket.description}</span></div>
              </div>

              {ticket.partsReplaced && ticket.partsReplaced.length > 0 && (
                <div className="mt-2 px-3 py-2 rounded-lg bg-cyan-950/30 border border-cyan-500/20 text-[11px] font-mono text-cyan-300">
                  Parts Replaced: {ticket.partsReplaced.map(p => `${p.partName} ($${p.cost})`).join(', ')}
                </div>
              )}

              {/* Actions for Biomed Engineer / Admin */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-mono">Assigned: {ticket.assignedTo}</span>

                {isOpen && (currentRole === 'biomed' || currentRole === 'admin') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => updateTicketStatus(ticket.id, 'In Progress', 'Eng. Mark Davis')}
                      className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => setSelectedTicketToResolve(ticket)}
                      className="px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition"
                    >
                      Resolve Ticket
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Report Breakdown Modal (FR-BRK-1) */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-rose-500/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <AlertOctagon className="h-5 w-5 text-rose-400" />
                  Flag Equipment Failure (FR-BRK-1)
                </h3>
                <p className="text-xs text-slate-400 font-mono">Immediate transition to BROKEN status & alert broadcast</p>
              </div>
              <button onClick={() => setIsReportModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicketSubmit} className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Select Affected Equipment Profile</label>
                <select
                  value={selectedAssetId}
                  onChange={(e) => setSelectedAssetId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {equipment.map(item => (
                    <option key={item.id} value={item.id}>
                      {item.id} - {item.name} ({item.department})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Issue Failure Category</label>
                <select
                  value={issueCategory}
                  onChange={(e) => setIssueCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                >
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Reporter Name & Role</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Detailed Breakdown Symptom Description *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe abnormal noise, error code display, gas leakage, or physical damage..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-rose-500"
                ></textarea>
              </div>

              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-[11px]">
                FR-BRK-2 Notice: Submitting this form will immediately update asset status to <strong className="text-white font-mono">BROKEN</strong> and broadcast high-priority push alert to on-duty Biomedical team.
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-semibold text-xs shadow-lg shadow-rose-600/20"
                >
                  Broadcast Urgent Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Ticket Modal */}
      {selectedTicketToResolve && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-emerald-500/50 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Resolve Work Order & Restore Asset</h3>
                <p className="text-xs text-slate-400 font-mono">Log repair time, resolution, and spare parts</p>
              </div>
              <button onClick={() => setSelectedTicketToResolve(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Resolution Summary & Test Results</label>
                <textarea
                  rows={2}
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Replaced flow sensor cartridge, recalibrated pressure valves..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-slate-200 focus:outline-none focus:border-emerald-500"
                ></textarea>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Actual Repair Time (Hours)</label>
                  <input
                    type="number"
                    step="0.5"
                    value={repairHours}
                    onChange={(e) => setRepairHours(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Part Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. O2 Cell Module"
                    value={partName}
                    onChange={(e) => setPartName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedTicketToResolve(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20"
                >
                  Confirm Resolution & Restore Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
