# AI-NOC – Intelligent Network Operations Center

[![Phase](https://img.shields.io/badge/Phase-1%20Complete-2563eb?style=for-the-badge)](https://github.com/varshawebdeveloper/AI-NOC-with-Automation-GNS3)
[![React](https://img.shields.io/badge/React-18-61dafb?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06b6d4?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com)
[![Vite](https://img.shields.io/badge/Vite-8-646cff?style=for-the-badge&logo=vite)](https://vitejs.dev)

An AI-powered, enterprise-grade Network Operations Center (NOC) SaaS platform with real-time monitoring, intelligent alerting, network topology visualization, and GNS3 integration.

---

## 🚀 Phase 1 – Completed Modules

| Module | Status | Description |
|--------|--------|-------------|
| 🔐 Authentication | ✅ Complete | Login, Forgot Password, Session Ready, Protected Routes |
| 📊 Enterprise Dashboard | ✅ Complete | KPI cards, Traffic chart, Device chart, Alerts, AI Health Score |
| 🕸️ Network Topology | ✅ Complete | React Flow canvas, 17 nodes, filters, device detail drawer |

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary Blue | `#2563EB` |
| Teal Accent | `#0D9488` |
| Success | `#16A34A` |
| Warning | `#F59E0B` |
| Critical | `#DC2626` |
| Font | Inter |
| Style | Enterprise SaaS, Clean White, Soft Shadows |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| Routing | React Router v6 |
| Network Topology | React Flow |
| Charts | Recharts |
| Icons | Lucide React |
| HTTP Client | Axios (placeholder) |
| Real-time | Socket.IO (placeholder) |

---

## 📁 Project Structure

```
src/
├── assets/
├── components/
│   ├── common/          # Button, Card, Badge, Modal, Toast, SearchBar, etc.
│   ├── dashboard/       # KpiCards, TrafficChart, DeviceDistributionChart, etc.
│   ├── layout/          # Sidebar, TopNav
│   └── topology/        # TopologyNode, DeviceDetailDrawer
├── constants/           # theme.ts (colors, routes, enums)
├── context/             # AuthContext
├── data/                # dashboardData.ts, topologyData.ts
├── hooks/               # (ready for custom hooks)
├── layouts/             # AppLayout, AuthLayout
├── pages/
│   ├── auth/            # LoginPage, ForgotPasswordPage, SessionReadyPage
│   ├── dashboard/       # DashboardPage
│   └── topology/        # TopologyPage
├── routes/              # AppRoutes, ProtectedRoute
├── services/            # api.ts, authService.ts, networkService.ts, alertService.ts, socketService.ts, gns3Service.ts
├── types/               # index.ts (all TypeScript types)
└── utils/               # cn(), formatters, severity/status helpers
```

---

## ⚡ Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

Dev server runs on `http://localhost:3000`

### Demo Credentials
| Role | Email | Password |
|------|-------|----------|
| Admin | `admin@ainoc.com` | `admin123` |
| Operator | `operator@ainoc.com` | `operator123` |

---

## 🔌 Backend Integration (Ready)

All service placeholders are in `src/services/`. To connect a backend:

1. Set env variables in `.env`:
   ```
   VITE_API_BASE_URL=http://localhost:5000/api
   VITE_SOCKET_URL=http://localhost:5000
   VITE_GNS3_URL=http://localhost:3080/v2
   ```
2. Uncomment the Axios calls in each service file
3. The JWT interceptor in `api.ts` is already configured

### GNS3 Integration
- `src/services/gns3Service.ts` contains the GNS3 REST API stub
- Node IDs in `src/data/topologyData.ts` are designed to map to GNS3 node IDs
- The DeviceDetailDrawer shows GNS3 node ID and API endpoint placeholder

---

## 📍 Phase Roadmap

| Phase | Modules | Status |
|-------|---------|--------|
| Phase 1 | Auth, Dashboard, Network Topology | ✅ Complete |
| Phase 2 | Alert Management, Device Inventory, Analytics | 🔜 Planned |
| Phase 3 | Reports, Settings, User Management, RBAC | 🔜 Planned |
| Phase 4 | GNS3 Live Integration, Python AI Service, Socket.IO | 🔜 Planned |
| Phase 5 | MongoDB, Express API, Production Deployment | 🔜 Planned |

---

## 📄 License

MIT © AI-NOC Team
