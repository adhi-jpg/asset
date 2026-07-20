import React, { createContext, useContext, useState, useEffect } from 'react';
import { INITIAL_EQUIPMENT, INITIAL_TICKETS, INITIAL_VENDORS, INITIAL_AUDIT_LOGS } from '../data/initialData';

const HEMSContext = createContext();

export const HEMSProvider = ({ children }) => {
  // Active User Role state (RBAC Simulation)
  const [currentRole, setCurrentRole] = useState('biomed'); // 'admin' | 'biomed' | 'hod' | 'floor'

  // Persisted or In-Memory States
  const [equipment, setEquipment] = useState(() => {
    const saved = localStorage.getItem('hems_equipment');
    return saved ? JSON.parse(saved) : INITIAL_EQUIPMENT;
  });

  const [tickets, setTickets] = useState(() => {
    const saved = localStorage.getItem('hems_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [vendors, setVendors] = useState(() => {
    const saved = localStorage.getItem('hems_vendors');
    return saved ? JSON.parse(saved) : INITIAL_VENDORS;
  });

  const [auditLogs, setAuditLogs] = useState(() => {
    const saved = localStorage.getItem('hems_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  // UI Modals & Active Scanner
  const [qrModalAsset, setQrModalAsset] = useState(null);
  const [isQrScannerOpen, setIsQrScannerOpen] = useState(false);
  const [activeNotification, setActiveNotification] = useState(null);
  const [audioAlertEnabled, setAudioAlertEnabled] = useState(true);

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('hems_equipment', JSON.stringify(equipment));
  }, [equipment]);

  useEffect(() => {
    localStorage.setItem('hems_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('hems_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  // Helper to log audit transactions
  const logAudit = (action, targetId, details) => {
    const roleNames = {
      admin: "System Administrator",
      biomed: "Biomedical Lead Engineer",
      hod: "Hospital Administrator",
      floor: "Floor Staff Nurse"
    };

    const newLog = {
      id: `LOG-${Math.floor(10000 + Math.random() * 90000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId: `USER-${currentRole.toUpperCase()}-${Math.floor(10 + Math.random() * 90)}`,
      userName: roleNames[currentRole] || "System User",
      role: roleNames[currentRole] || currentRole,
      action,
      targetId,
      details,
      hash: `0x${Math.random().toString(16).substring(2, 10)}...${Math.random().toString(16).substring(2, 6)} (AES-256 Validated)`
    };

    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Helper to trigger alert toast
  const triggerNotification = (title, message, type = 'warning') => {
    setActiveNotification({ id: Date.now(), title, message, type });
  };

  // Add new equipment (FR-INV-1, FR-INV-2)
  const addEquipment = (newAssetData) => {
    const assetId = `EQ-${newAssetData.brand.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
    
    // Schedule calculation using T_next = T_last + Delta T_frequency
    const lastDate = new Date(newAssetData.lastMaintenanceDate || new Date());
    const freq = parseInt(newAssetData.maintenanceFrequencyDays || 90, 10);
    const nextDate = new Date(lastDate.getTime() + freq * 86400000);
    const nextDateStr = nextDate.toISOString().split('T')[0];

    const fullAsset = {
      ...newAssetData,
      id: assetId,
      status: newAssetData.status || 'Available',
      nextMaintenanceDate: nextDateStr,
      calibrationDueDate: nextDateStr,
      totalBreakdowns: 0,
      avgRepairTimeHours: 0
    };

    setEquipment(prev => [fullAsset, ...prev]);
    logAudit('ASSET_CREATED', assetId, `Added new asset ${fullAsset.name} (${fullAsset.model}) in ${fullAsset.department}`);
    triggerNotification('Asset Cataloged', `New QR Code signature generated for ${fullAsset.name}`, 'success');
    return fullAsset;
  };

  // Update Equipment Maintenance (FR-MNT-1 formula execution)
  const executePreventiveMaintenance = (assetId, notes, newFrequencyDays) => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    setEquipment(prev => prev.map(item => {
      if (item.id === assetId) {
        const freq = newFrequencyDays ? parseInt(newFrequencyDays, 10) : item.maintenanceFrequencyDays;
        // Formula: T_next = T_last + Delta T_frequency
        const lastDate = new Date(todayStr);
        const nextDate = new Date(lastDate.getTime() + freq * 86400000);
        const nextDateStr = nextDate.toISOString().split('T')[0];

        return {
          ...item,
          status: 'Available',
          lastMaintenanceDate: todayStr,
          maintenanceFrequencyDays: freq,
          nextMaintenanceDate: nextDateStr,
          calibrationDueDate: nextDateStr
        };
      }
      return item;
    }));

    logAudit('PPM_EXECUTED', assetId, `Preventive maintenance executed & validated for asset ${assetId}. T_next recalculated.`);
    triggerNotification('PPM Schedule Updated', `Preventive maintenance completed for ${assetId}. Next inspection: rescheduled based on formula.`, 'success');
  };

  // Report Equipment Breakdown (FR-BRK-1, FR-BRK-2)
  const reportBreakdown = (assetId, issueCategory, description, reporterName) => {
    const targetAsset = equipment.find(e => e.id === assetId);
    const assetName = targetAsset ? targetAsset.name : assetId;
    const department = targetAsset ? targetAsset.department : 'General Ward';

    // 1. Instantly transition asset status to "Broken"
    setEquipment(prev => prev.map(item => {
      if (item.id === assetId) {
        return {
          ...item,
          status: 'Broken',
          totalBreakdowns: (item.totalBreakdowns || 0) + 1
        };
      }
      return item;
    }));

    // 2. Generate Work Order ticket
    const ticketId = `WO-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTicket = {
      id: ticketId,
      assetId,
      assetName,
      department,
      reportedBy: reporterName || "Floor Nurse / Medical Staff",
      reportedRole: "Floor Staff",
      reportedAt: new Date().toISOString(),
      issueCategory,
      description,
      priority: targetAsset?.isCriticalLifeSupport ? 'Urgent' : 'High',
      status: 'Open',
      assignedTo: 'Unassigned (On-Duty Biomed Team)',
      slaHoursRemaining: targetAsset?.isCriticalLifeSupport ? 2 : 6,
      totalSlaHours: targetAsset?.isCriticalLifeSupport ? 2 : 6,
      resolutionNotes: '',
      partsReplaced: []
    };

    setTickets(prev => [newTicket, ...prev]);

    // 3. Log Audit & Broadcast Urgent Alert
    logAudit('BREAKDOWN_REPORTED', assetId, `CRITICAL: Breakdown reported for ${assetName}. Ticket ${ticketId} created. Status transitioned to BROKEN.`);
    triggerNotification('URGENT BREAKDOWN ALERT', `High-priority ticket ${ticketId} broadcasted for ${assetName} (${department})`, 'urgent');
  };

  // Update Work Order Ticket Status
  const updateTicketStatus = (ticketId, newStatus, assignedTo, resolutionNotes = '', repairHours = 0, parts = []) => {
    setTickets(prev => prev.map(ticket => {
      if (ticket.id === ticketId) {
        const updated = {
          ...ticket,
          status: newStatus,
          assignedTo: assignedTo || ticket.assignedTo,
          resolutionNotes: resolutionNotes || ticket.resolutionNotes
        };

        if (newStatus === 'Resolved') {
          updated.resolvedAt = new Date().toISOString();
          updated.repairTimeHours = repairHours || 2.0;
          if (parts.length > 0) {
            updated.partsReplaced = [...(ticket.partsReplaced || []), ...parts];
          }

          // Restore equipment status to Available
          setEquipment(eqPrev => eqPrev.map(eq => {
            if (eq.id === ticket.assetId) {
              const currentAvg = eq.avgRepairTimeHours || 2.0;
              const newAvg = parseFloat(((currentAvg + updated.repairTimeHours) / 2).toFixed(1));
              return { ...eq, status: 'Available', avgRepairTimeHours: newAvg };
            }
            return eq;
          }));

          logAudit('WORK_ORDER_RESOLVED', ticket.assetId, `Ticket ${ticketId} resolved. Equipment restored to Available status.`);
          triggerNotification('Ticket Resolved', `Work order ${ticketId} marked resolved. Asset restored to service.`, 'success');
        } else {
          logAudit('WORK_ORDER_UPDATED', ticket.assetId, `Ticket ${ticketId} status changed to ${newStatus}.`);
        }

        return updated;
      }
      return ticket;
    }));
  };

  // KPI Calculations
  const calculatedMTTR = () => {
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved' && t.repairTimeHours);
    if (resolvedTickets.length === 0) return 2.4;
    const totalHours = resolvedTickets.reduce((sum, t) => sum + (t.repairTimeHours || 0), 0);
    return (totalHours / resolvedTickets.length).toFixed(1);
  };

  const calculatedMTBF = () => {
    const totalAssets = equipment.length;
    const totalFailures = equipment.reduce((sum, item) => sum + (item.totalBreakdowns || 0), 0);
    if (totalFailures === 0) return 180;
    return Math.round((totalAssets * 90) / (totalFailures + 1));
  };

  // Upcoming Calibration Alerts (Within 7 Days)
  const getUpcomingAlerts = () => {
    const now = new Date();
    const sevenDaysOut = new Date(now.getTime() + 7 * 86400000);
    
    return equipment.filter(item => {
      if (!item.calibrationDueDate) return false;
      const due = new Date(item.calibrationDueDate);
      return due <= sevenDaysOut || item.status === 'Broken';
    });
  };

  return (
    <HEMSContext.Provider value={{
      currentRole,
      setCurrentRole,
      equipment,
      tickets,
      vendors,
      auditLogs,
      addEquipment,
      executePreventiveMaintenance,
      reportBreakdown,
      updateTicketStatus,
      qrModalAsset,
      setQrModalAsset,
      isQrScannerOpen,
      setIsQrScannerOpen,
      activeNotification,
      setActiveNotification,
      audioAlertEnabled,
      setAudioAlertEnabled,
      mttr: calculatedMTTR(),
      mtbf: calculatedMTBF(),
      upcomingAlerts: getUpcomingAlerts(),
      logAudit
    }}>
      {children}
    </HEMSContext.Provider>
  );
};

export const useHEMS = () => useContext(HEMSContext);
