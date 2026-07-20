import React, { useState } from 'react';
import { HEMSProvider, useHEMS } from './context/HEMSContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import QrModal from './components/QrModal';
import QrScannerModal from './components/QrScannerModal';
import NotificationToast from './components/NotificationToast';

import DashboardView from './views/DashboardView';
import AssetInventoryView from './views/AssetInventoryView';
import MaintenanceView from './views/MaintenanceView';
import BreakdownWorkOrdersView from './views/BreakdownWorkOrdersView';
import VendorsContractsView from './views/VendorsContractsView';
import AuditLogsView from './views/AuditLogsView';

function HEMSAppContent() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { qrModalAsset, setQrModalAsset, isQrScannerOpen, setIsQrScannerOpen } = useHEMS();
  const [assetForBreakdown, setAssetForBreakdown] = useState(null);

  const handleSelectAssetForBreakdown = (asset) => {
    setAssetForBreakdown(asset);
    setActiveTab('breakdown');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-white">
      {/* Sticky Top Navbar */}
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Container */}
      <div className="flex-1 flex flex-col lg:flex-row w-full max-w-7xl mx-auto p-4 lg:p-6 gap-6">
        {/* Navigation Sidebar */}
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Workspace Area */}
        <main className="flex-1 min-w-0">
          {activeTab === 'dashboard' && <DashboardView onNavigate={setActiveTab} />}
          {activeTab === 'inventory' && <AssetInventoryView />}
          {activeTab === 'maintenance' && <MaintenanceView />}
          {activeTab === 'breakdown' && (
            <BreakdownWorkOrdersView 
              assetForBreakdown={assetForBreakdown} 
              clearAssetForBreakdown={() => setAssetForBreakdown(null)} 
            />
          )}
          {activeTab === 'vendors' && <VendorsContractsView />}
          {activeTab === 'audit' && <AuditLogsView />}
        </main>
      </div>

      {/* QR Code Dynamic Generator/Print Modal */}
      {qrModalAsset && (
        <QrModal 
          asset={qrModalAsset} 
          onClose={() => setQrModalAsset(null)} 
        />
      )}

      {/* Mobile QR Scanner Simulator Modal */}
      {isQrScannerOpen && (
        <QrScannerModal 
          onClose={() => setIsQrScannerOpen(false)}
          onSelectAssetForBreakdown={handleSelectAssetForBreakdown}
        />
      )}

      {/* Alert Banner / Toast Notification System */}
      <NotificationToast />
    </div>
  );
}

export default function App() {
  return (
    <HEMSProvider>
      <HEMSAppContent />
    </HEMSProvider>
  );
}
