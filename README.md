# 🏥 Hospital Equipment Management System (HEMS)

> **Version:** 1.0.0 SRS Compliant • **Status:** Final Release • **License:** MIT

HEMS is a modern, high-performance web application designed to digitize, monitor, streamline, and optimize the lifecycle management of medical equipment within healthcare facilities. It provides clinical engineers, hospital administrators, procurement teams, and floor medical staff with real-time status tracking, automated preventive maintenance, rapid breakdown ticketing, vendor management, and unalterable compliance audit logging.

---

## ⚡ Key Highlights & Architecture

- **High-Efficiency Zero-Dependency SVG Engine**: Custom inline SVG charts (Donut, Trend Line, Bar) and dynamic QR tag generators reduce production bundle size to **~239 KB** (~67 KB gzipped).
- **SRS v1.0.0 Compliance**: Built strictly adhering to all functional and non-functional requirements specified in the SRS.
- **Clinical Tech Aesthetic**: Dark-mode glassmorphism interface tailored for high-contrast visibility in healthcare control centers.

---

## 🚀 Operational Modules & Functional Requirements

### 1. Asset Discovery & Lifecycle Inventory (`FR-INV-1`, `FR-INV-2`)
- **Dynamic Scannable QR Codes (`FR-INV-1`)**: Instant QR tag generation for every cataloged asset profile with printable tag labels.
- **Mobile QR Scanner Simulator**: Enables floor staff or biomedical engineers to simulate mobile QR code scans for instant failure reporting or auditing.
- **Comprehensive Metadata Cataloging (`FR-INV-2`)**: Tracks Brand, Model, Serial Number, Department, Location, Purchase Cost, Procurement Date, Maintenance Frequency, and Life-Support classification.

### 2. Preventive & Corrective Maintenance Engine (`FR-MNT-1`, `FR-MNT-2`)
- **Automated Formula Calculation (`FR-MNT-1`)**: Automatically schedules subsequent maintenance actions using:
  $$T_{\text{next}} = T_{\text{last}} + \Delta T_{\text{frequency}}$$
- **7-Day Compliance Window (`FR-MNT-2`)**: Automatically pushes alerts for equipment reaching calibration or safety inspection deadlines within 7 days.

### 3. Breakdown & Work Order Ticketing Workflow (`FR-BRK-1`, `FR-BRK-2`)
- **Rapid Failure Reporting (`FR-BRK-1`)**: Floor staff can report device failures via QR scan or fast UI breakdown forms.
- **Instant Status Transition & Broadcast (`FR-BRK-2`)**: Instantly transitions asset status to `"Broken"` and broadcasts high-priority alerts to on-duty Biomedical Engineers.
- **SLA & Spare Parts Tracking**: Monitor SLA hours remaining, technician assignments, repair logs, and spare parts replacement costs.

### 4. Executive Analytics & MTTR/MTBF Dashboard
- **Real-Time KPIs**: Live monitoring of Mean Time To Repair (MTTR in hours) and Mean Time Between Failures (MTBF in days).
- **Pure SVG Analytics**: Donut chart for operational status, MTTR trend line chart, and departmental ward equipment allocation bar chart.

### 5. Vendor & Contract Management
- **Maintenance Repository**: Repository for Warranties, Annual Maintenance Contracts (AMC), and Comprehensive Maintenance Contracts (CMC).
- **SLA Performance Tracking**: Monitor vendor response times and active contract terms.

### 6. Security Audit Trail & Compliance Ledger (Section 4.1)
- **Unalterable Transaction History**: Read/write transaction log mapping User IDs to state changes with AES-256 cryptographic signatures.
- **Regulatory Export**: Export full audit logs as CSV files for JCI and NABH compliance verification.

---

## 👥 Role-Based Access Control (RBAC Simulation)

Switch context dynamically in the top navigation bar to test role-specific interfaces:
1. **System Administrator**: Full access, RBAC management, global system lookups, audit logs.
2. **Biomedical Engineer**: Executes preventive maintenance, responds to breakdown tickets, logs spare parts replacement.
3. **Hospital Administrator / HOD**: High-level utilization dashboards, MTTR/MTBF compliance, contract authorizations.
4. **Floor Staff (Doctors/Nurses)**: Rapid breakdown reporting via UI/QR scan, equipment allocation tracking.

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18.0.0 or higher)
- npm or yarn

### Installation & Execution

```bash
# 1. Clone the repository
git clone https://github.com/adhi-jpg/asset.git
cd asset

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Build production bundle
npx vite build
```

Open `http://localhost:3000` in your browser to view the application.

---

## 📁 Repository Structure

```
asset/
├── index.html               # Main HTML entrypoint
├── package.json             # Dependencies and build scripts
├── vite.config.js           # Vite build configuration
├── tailwind.config.js       # Tailwind CSS design system tokens
├── src/
│   ├── main.jsx             # React root mount
│   ├── App.jsx              # Main shell layout and modal router
│   ├── index.css            # Custom glassmorphism utilities & animations
│   ├── context/
│   │   └── HEMSContext.jsx  # Global state manager & audit logger
│   ├── data/
│   │   └── initialData.js   # Rich mock hospital dataset
│   ├── components/
│   │   ├── Navbar.jsx       # Header with Role Switcher & status badges
│   │   ├── Sidebar.jsx      # Tab navigation sidebar
│   │   ├── RoleSelector.jsx # RBAC selector component
│   │   ├── QrModal.jsx      # Scannable dynamic QR code tag modal
│   │   ├── QrScannerModal.jsx # Mobile QR scanner simulator
│   │   ├── NotificationToast.jsx # High-priority broadcast alerts
│   │   ├── StatCard.jsx     # Executive KPI cards
│   │   ├── SvgCharts.jsx    # Pure SVG Donut, Bar & Trend Line charts
│   │   └── SvgQrCode.jsx    # Pure SVG QR code generator
│   └── views/
│       ├── DashboardView.jsx        # MTTR/MTBF analytics & charts
│       ├── AssetInventoryView.jsx   # Equipment catalog & QR tags
│       ├── MaintenanceView.jsx      # PPM calculator & 7-day alerts
│       ├── BreakdownWorkOrdersView.jsx # Breakdown tickets & SLA workflow
│       ├── VendorsContractsView.jsx # AMC/CMC vendor repository
│       └── AuditLogsView.jsx        # AES-256 compliance log ledger
```

---

## 📜 License

Distributed under the MIT License. See `LICENSE` for more information.