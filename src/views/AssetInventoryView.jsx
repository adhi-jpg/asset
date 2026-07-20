import React, { useState } from 'react';
import { useHEMS } from '../context/HEMSContext';
import { 
  Plus, 
  Search, 
  QrCode, 
  Filter, 
  Tag, 
  Calendar, 
  DollarSign, 
  Building2, 
  AlertOctagon, 
  Wrench, 
  CheckCircle2, 
  X,
  Stethoscope
} from 'lucide-react';

export default function AssetInventoryView() {
  const { equipment, addEquipment, setQrModalAsset, currentRole, reportBreakdown } = useHEMS();

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');

  // Modal State for New Asset Creation (FR-INV-1, FR-INV-2)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAssetData, setNewAssetData] = useState({
    name: '',
    brand: '',
    model: '',
    serialNumber: '',
    department: 'ICU',
    location: '',
    purchaseCost: 15000,
    procurementDate: new Date().toISOString().split('T')[0],
    lastMaintenanceDate: new Date().toISOString().split('T')[0],
    maintenanceFrequencyDays: 90,
    isCriticalLifeSupport: false,
    contractType: 'CMC'
  });

  const departments = ['All', 'ICU', 'Emergency', 'Radiology', 'Operating Theater', 'Pediatrics', 'Nephrology', 'Cardiology'];
  const statuses = ['All', 'Available', 'In-Use', 'Under Maintenance', 'Broken', 'Decommissioned'];

  const filteredAssets = equipment.filter(asset => {
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.brand.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesDept = selectedDept === 'All' || asset.department === selectedDept;
    const matchesStatus = selectedStatus === 'All' || asset.status === selectedStatus;

    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newAssetData.name || !newAssetData.brand || !newAssetData.model || !newAssetData.serialNumber) {
      alert("Please complete all required fields (Name, Brand, Model, Serial #).");
      return;
    }

    const created = addEquipment(newAssetData);
    setIsAddModalOpen(false);
    // Show QR modal for newly created asset profile (FR-INV-1)
    setQrModalAsset(created);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Action & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Tag className="h-5 w-5 text-cyan-400" />
            Asset & Lifecycle Inventory Catalog
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            FR-INV-1 & FR-INV-2: Real-time status monitoring, dynamic QR code tagging, and metadata records
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {(currentRole === 'admin' || currentRole === 'biomed') && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white shadow-lg shadow-cyan-600/20 transition active:scale-95"
            >
              <Plus className="h-4 w-4" />
              <span>Catalog New Asset + Generate QR</span>
            </button>
          )}
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by equipment name, ID, brand, serial..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
        </div>

        {/* Filter Department */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Building2 className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-mono shrink-0">Dept:</span>
          <select
            value={selectedDept}
            onChange={(e) => setSelectedDept(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs text-slate-200 font-medium w-full"
          >
            {departments.map(d => (
              <option key={d} value={d} className="bg-slate-900">{d}</option>
            ))}
          </select>
        </div>

        {/* Filter Status */}
        <div className="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800">
          <Filter className="h-4 w-4 text-slate-400 shrink-0" />
          <span className="text-xs text-slate-400 font-mono shrink-0">Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-transparent border-none focus:outline-none text-xs text-slate-200 font-medium w-full"
          >
            {statuses.map(s => (
              <option key={s} value={s} className="bg-slate-900">{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Equipment Grid Table View */}
      <div className="glass-panel rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/90 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Asset ID / Name</th>
                <th className="py-3 px-4">Brand & Model</th>
                <th className="py-3 px-4">Serial Number</th>
                <th className="py-3 px-4">Department & Location</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4">Next PPM Date</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredAssets.map(asset => (
                <tr key={asset.id} className="hover:bg-slate-900/50 transition">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setQrModalAsset(asset)}
                        className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 border border-cyan-500/30 transition"
                        title="View & Print Dynamic QR Code"
                      >
                        <QrCode className="h-4 w-4" />
                      </button>
                      <div>
                        <div className="font-bold text-white font-sans flex items-center gap-1.5">
                          {asset.name}
                          {asset.isCriticalLifeSupport && (
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-950 text-purple-300 border border-purple-800">
                              Life Support
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-cyan-400 font-mono">{asset.id}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{asset.brand}</div>
                    <div className="text-[11px] text-slate-500">{asset.model}</div>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    {asset.serialNumber}
                  </td>

                  <td className="py-3 px-4">
                    <div className="text-slate-200">{asset.department}</div>
                    <div className="text-[11px] text-slate-500">{asset.location}</div>
                  </td>

                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                      asset.status === 'Available' ? 'bg-emerald-950/80 text-emerald-400 border-emerald-800/80' :
                      asset.status === 'In-Use' ? 'bg-cyan-950/80 text-cyan-400 border-cyan-800/80' :
                      asset.status === 'Under Maintenance' ? 'bg-amber-950/80 text-amber-400 border-amber-800/80' :
                      asset.status === 'Broken' ? 'bg-rose-950/80 text-rose-400 border-rose-800/80 animate-pulse' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      <span className="h-1.5 w-1.5 rounded-full fill-current"></span>
                      {asset.status}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-slate-300">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-slate-400" />
                      <span>{asset.nextMaintenanceDate}</span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => setQrModalAsset(asset)}
                        className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                      >
                        QR Tag
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add New Asset Modal (FR-INV-1 & FR-INV-2) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Catalog New Equipment Profile</h3>
                <p className="text-xs text-slate-400 font-mono">FR-INV-1 & FR-INV-2 Metadata Standard</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 text-xs font-mono">
              <div>
                <label className="block text-slate-400 mb-1">Equipment Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hamilton C6 ICU Ventilator"
                  value={newAssetData.name}
                  onChange={(e) => setNewAssetData({...newAssetData, name: e.target.value})}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Brand / Manufacturer *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Hamilton Medical"
                    value={newAssetData.brand}
                    onChange={(e) => setNewAssetData({...newAssetData, brand: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Model Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. C6-S"
                    value={newAssetData.model}
                    onChange={(e) => setNewAssetData({...newAssetData, model: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Serial Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. SN-HMC-8812"
                    value={newAssetData.serialNumber}
                    onChange={(e) => setNewAssetData({...newAssetData, serialNumber: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Department</label>
                  <select
                    value={newAssetData.department}
                    onChange={(e) => setNewAssetData({...newAssetData, department: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  >
                    {departments.filter(d => d !== 'All').map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Location Room / Bed</label>
                  <input
                    type="text"
                    placeholder="e.g. ICU Room 102 - Bed B"
                    value={newAssetData.location}
                    onChange={(e) => setNewAssetData({...newAssetData, location: e.target.value})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Purchase Cost ($)</label>
                  <input
                    type="number"
                    value={newAssetData.purchaseCost}
                    onChange={(e) => setNewAssetData({...newAssetData, purchaseCost: parseFloat(e.target.value) || 0})}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="criticalLife"
                  checked={newAssetData.isCriticalLifeSupport}
                  onChange={(e) => setNewAssetData({...newAssetData, isCriticalLifeSupport: e.target.checked})}
                  className="rounded bg-slate-900 border-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <label htmlFor="criticalLife" className="text-slate-200 font-semibold cursor-pointer">
                  Critical Life-Support Item (Requires MTTR Auditing)
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs shadow-lg shadow-cyan-600/20"
                >
                  Generate QR & Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
