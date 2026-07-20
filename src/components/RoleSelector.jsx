import React from 'react';
import { useHEMS } from '../context/HEMSContext';
import { Shield, Wrench, UserCheck, Stethoscope, ChevronDown } from 'lucide-react';

export default function RoleSelector() {
  const { currentRole, setCurrentRole, logAudit } = useHEMS();

  const roles = [
    {
      id: 'admin',
      name: 'System Administrator',
      short: 'Sys Admin',
      icon: Shield,
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30'
    },
    {
      id: 'biomed',
      name: 'Biomedical Engineer',
      short: 'Biomed Lead',
      icon: Wrench,
      color: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30'
    },
    {
      id: 'hod',
      name: 'Hospital Admin / HOD',
      short: 'Hospital Admin',
      icon: UserCheck,
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
    },
    {
      id: 'floor',
      name: 'Floor Staff (Doctor/Nurse)',
      short: 'Floor Staff',
      icon: Stethoscope,
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
    }
  ];

  const currentRoleObj = roles.find(r => r.id === currentRole) || roles[1];
  const Icon = currentRoleObj.icon;

  const handleRoleChange = (e) => {
    const newRole = e.target.value;
    setCurrentRole(newRole);
    logAudit('ROLE_SWITCH', 'RBAC_SESSION', `Switched active RBAC context to ${newRole}`);
  };

  return (
    <div className="relative flex items-center">
      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold ${currentRoleObj.color}`}>
        <Icon className="h-4 w-4 shrink-0" />
        <select
          value={currentRole}
          onChange={handleRoleChange}
          className="bg-transparent border-none focus:outline-none focus:ring-0 font-medium cursor-pointer text-xs pr-2"
        >
          {roles.map(role => (
            <option key={role.id} value={role.id} className="bg-slate-900 text-slate-100">
              Role: {role.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
