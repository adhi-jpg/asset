import React from 'react';
import SvgQrCode from './SvgQrCode';
import { X, Printer, Tag } from 'lucide-react';
import { useHEMS } from '../context/HEMSContext';

export default function QrModal({ asset, onClose }) {
  const { logAudit } = useHEMS();

  if (!asset) return null;

  const qrPayload = JSON.stringify({
    system: "HEMS-V1",
    id: asset.id,
    serialNumber: asset.serialNumber,
    brand: asset.brand,
    model: asset.model,
    department: asset.department,
    status: asset.status
  });

  const handlePrint = () => {
    logAudit('PRINT_QR_LABEL', asset.id, `Printed QR tag label for asset ${asset.name}`);
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-cyan-400" />
              <span className="text-xs font-mono font-bold text-cyan-400">FR-INV-1 SCANNABLE QR TAG</span>
            </div>
            <h3 className="text-base font-bold text-white mt-1">{asset.name}</h3>
            <p className="text-xs text-slate-400 font-mono">{asset.id} • {asset.brand} {asset.model}</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content - QR Code Display Card */}
        <div className="my-6 flex flex-col items-center justify-center p-6 bg-slate-900/90 rounded-xl border border-slate-800 shadow-inner">
          <div className="p-3 bg-white rounded-xl shadow-lg border-2 border-cyan-500/50">
            <SvgQrCode value={qrPayload} size={180} />
          </div>
          <p className="text-[11px] text-slate-400 font-mono mt-3 text-center">
            Scan via mobile device to immediately log breakdown or view maintenance history.
          </p>
        </div>

        {/* Metadata Checklist */}
        <div className="grid grid-cols-2 gap-3 text-xs font-mono bg-slate-900/50 p-3 rounded-xl border border-slate-800/80 mb-6">
          <div>
            <span className="text-slate-500 block">Serial Number:</span>
            <span className="text-slate-200 font-semibold">{asset.serialNumber}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Department:</span>
            <span className="text-slate-200 font-semibold">{asset.department}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Current Status:</span>
            <span className={`font-semibold ${
              asset.status === 'Available' ? 'text-emerald-400' :
              asset.status === 'In-Use' ? 'text-cyan-400' :
              asset.status === 'Broken' ? 'text-rose-400' : 'text-amber-400'
            }`}>{asset.status}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Contract:</span>
            <span className="text-slate-200 font-semibold">{asset.contractType}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/20 transition-all active:scale-95"
          >
            <Printer className="h-4 w-4" />
            <span>Print Asset Tag Label</span>
          </button>
          <button
            onClick={onClose}
            className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
