import React, { useState } from 'react';
import { useHEMS } from '../context/HEMSContext';
import { Camera, X, QrCode, AlertOctagon, CheckCircle2, Search, ArrowRight, Activity } from 'lucide-react';

export default function QrScannerModal({ onClose, onSelectAssetForBreakdown }) {
  const { equipment, setQrModalAsset, logAudit } = useHEMS();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const filteredAssets = equipment.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSimulatedScan = (asset) => {
    setSelectedAsset(asset);
    logAudit('QR_SCANNED', asset.id, `Simulated mobile QR scan performed for ${asset.name}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-slate-700/80 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Camera className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Mobile QR Scanner Simulator</h3>
              <p className="text-xs text-slate-400 font-mono">FR-BRK-1: Scan asset tag for breakdown or audit</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Camera Feed Simulator Area */}
        {!selectedAsset ? (
          <div className="my-5">
            <div className="relative h-48 w-full bg-slate-900 rounded-xl border-2 border-dashed border-cyan-500/40 flex flex-col items-center justify-center overflow-hidden group">
              {/* Animated Scan Line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_15px_#06b6d4] animate-[bounce_2s_infinite]"></div>
              
              <QrCode className="h-14 w-14 text-cyan-400/60 group-hover:scale-110 transition-transform duration-300" />
              <p className="text-xs font-mono text-cyan-300 mt-2">Point mobile camera at equipment QR label</p>
              <p className="text-[11px] text-slate-500">Or select an active asset from the list below</p>
            </div>

            {/* Quick Search */}
            <div className="mt-4 relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by equipment ID, brand, model or department..."
                className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {/* Asset List Selector */}
            <div className="mt-3 max-h-48 overflow-y-auto space-y-2 pr-1">
              {filteredAssets.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleSimulatedScan(item)}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-800/80 cursor-pointer transition"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-cyan-400 font-bold">{item.id}</span>
                      <span className="text-xs font-semibold text-slate-200">{item.name}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{item.department} • {item.location}</p>
                  </div>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                    item.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border-emerald-800' :
                    item.status === 'Broken' ? 'bg-rose-950 text-rose-400 border-rose-800' : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Scanned Asset Confirmation View */
          <div className="my-5 p-4 rounded-xl bg-slate-900/90 border border-cyan-500/30 space-y-4 animate-fadeIn">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-400 uppercase font-bold">QR Tag Match Verified</span>
                <h4 className="text-sm font-bold text-white">{selectedAsset.name}</h4>
                <p className="text-xs text-slate-400 font-mono">{selectedAsset.id} • {selectedAsset.department}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-950/60 p-3 rounded-lg border border-slate-800">
              <div><span className="text-slate-500">Brand/Model:</span> {selectedAsset.brand} {selectedAsset.model}</div>
              <div><span className="text-slate-500">Serial #:</span> {selectedAsset.serialNumber}</div>
              <div><span className="text-slate-500">Status:</span> <span className="text-cyan-400 font-bold">{selectedAsset.status}</span></div>
              <div><span className="text-slate-500">Next PPM:</span> {selectedAsset.nextMaintenanceDate}</div>
            </div>

            {/* Quick Action Buttons */}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => {
                  onSelectAssetForBreakdown(selectedAsset);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs shadow-lg shadow-rose-600/20 transition active:scale-95"
              >
                <AlertOctagon className="h-4 w-4" />
                <span>Report Failure / Ticket</span>
              </button>

              <button
                onClick={() => {
                  setQrModalAsset(selectedAsset);
                  onClose();
                }}
                className="flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs border border-slate-700 transition"
              >
                <QrCode className="h-4 w-4 text-cyan-400" />
                <span>View Full Profile</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
