import React, { useState } from 'react';
import { useHEMS } from '../context/HEMSContext';
import { ShieldAlert, Download, Lock, Search, Filter, Database, FileSpreadsheet } from 'lucide-react';

export default function AuditLogsView() {
  const { auditLogs } = useHEMS();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = auditLogs.filter(log =>
    log.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.targetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.details.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportCSV = () => {
    const headers = "Log ID,Timestamp,User ID,User Name,Role,Action,Target Asset,Details,Hash\n";
    const rows = filteredLogs.map(l => 
      `"${l.id}","${l.timestamp}","${l.userId}","${l.userName}","${l.role}","${l.action}","${l.targetId}","${l.details.replace(/"/g, '""')}","${l.hash}"`
    ).join("\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hems_compliance_audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-purple-400" />
            Security Audit Trail & Compliance Ledger
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Section 4.1: Unalterable transaction logs mapping user IDs to state changes with AES-256 cryptographic hashes
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/20 transition active:scale-95"
          >
            <FileSpreadsheet className="h-4 w-4" />
            <span>Export CSV Audit Report</span>
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex items-center gap-3">
        <Search className="h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter audit entries by User ID, action name, asset ID or detail..."
          className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
        />
      </div>

      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Log ID & Timestamp</th>
                <th className="py-3 px-4">User ID & Role</th>
                <th className="py-3 px-4">Action Event</th>
                <th className="py-3 px-4">Target Asset</th>
                <th className="py-3 px-4">Transaction Details</th>
                <th className="py-3 px-4">Cryptographic Hash Signature</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredLogs.map(log => (
                <tr key={log.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-4">
                    <div className="font-bold text-purple-300">{log.id}</div>
                    <div className="text-[10px] text-slate-500">{log.timestamp}</div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200 font-bold">{log.userName}</div>
                    <div className="text-[10px] text-slate-400">{log.userId} ({log.role})</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      log.action.includes('BREAKDOWN') ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                      log.action.includes('PPM') || log.action.includes('MAINTENANCE') ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      log.action.includes('RESOLVED') ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      'bg-cyan-950 text-cyan-400 border border-cyan-800'
                    }`}>
                      {log.action}
                    </span>
                  </td>

                  <td className="py-3 px-4 font-bold text-cyan-400">
                    {log.targetId}
                  </td>

                  <td className="py-3 px-4 font-sans text-slate-300 max-w-xs truncate" title={log.details}>
                    {log.details}
                  </td>

                  <td className="py-3 px-4 text-[10px] text-slate-400">
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3 text-purple-400" />
                      <span>{log.hash}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
