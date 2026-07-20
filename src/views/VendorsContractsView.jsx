import React from 'react';
import { useHEMS } from '../context/HEMSContext';
import { FileText, Building2, Phone, Mail, Award, CheckCircle, ShieldCheck } from 'lucide-react';

export default function VendorsContractsView() {
  const { vendors } = useHEMS();

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" />
            Vendor & Contract Management Repository
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Maintain warranties, Annual Maintenance Contracts (AMC), and Comprehensive Maintenance Contracts (CMC)
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-slate-300">
          <Building2 className="h-4 w-4 text-cyan-400" />
          <span>{vendors.length} Verified Hospital Vendors</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {vendors.map(vendor => (
          <div key={vendor.id} className="p-5 rounded-2xl glass-card border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold">{vendor.id}</span>
                <h3 className="text-base font-bold text-white mt-0.5">{vendor.name}</h3>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded bg-amber-950/80 text-amber-300 border border-amber-800 font-mono text-xs">
                <Award className="h-3.5 w-3.5" />
                <span>{vendor.rating} ★</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-xs font-mono space-y-1.5">
              <div className="flex items-center gap-2 text-slate-300">
                <Building2 className="h-3.5 w-3.5 text-slate-500" />
                <span>{vendor.contactPerson}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Mail className="h-3.5 w-3.5 text-slate-500" />
                <span>{vendor.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Phone className="h-3.5 w-3.5 text-slate-500" />
                <span>{vendor.phone}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-2 border-t border-slate-800">
              <div>
                <span className="text-slate-500 block">Active AMC/CMC:</span>
                <span className="text-cyan-400 font-bold">{vendor.activeContracts} Contracts</span>
              </div>
              <div>
                <span className="text-slate-500 block">Avg SLA Response:</span>
                <span className="text-emerald-400 font-bold">{vendor.avgResponseHours} hrs</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
