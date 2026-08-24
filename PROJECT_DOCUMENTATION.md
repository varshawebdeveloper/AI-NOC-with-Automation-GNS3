# AI-NOC: Intelligent Network Operations Center with Automation & GNS3

---

## **PROJECT REPORT (PHASE 1 COMPLETE)**

* **Project Title:** AI-NOC: Intelligent Network Operations Center with Automation & GNS3
* **Academic Domain:** Computer Networks, Cloud Infrastructure, Artificial Intelligence, Full-Stack Web Development
* **Framework & Technologies:** React 18/19, TypeScript, Vite, Tailwind CSS, React Flow, Recharts, Axios, Socket.IO, GNS3 API
* **Document Type:** Formal Technical Project Documentation & System Design Specification
* **Current Phase:** Phase 1 Completed (Core Frontend Platform, Authentication, Topology Engine, Enterprise NOC Dashboard)

---

## **TABLE OF CONTENTS**
1. [Executive Summary / Abstract](#1-abstract)
2. [Chapter 1: Introduction](#chapter-1-introduction)
   - 1.1 Background & Motivation
   - 1.2 Problem Statement
   - 1.3 Project Objectives
   - 1.4 Scope of the Project
3. [Chapter 2: Literature Survey & System Study](#chapter-2-literature-survey--system-study)
   - 2.1 Existing Systems & Their Limitations
   - 2.2 Proposed AI-NOC Solution
   - 2.3 Feasibility Study
4. [Chapter 3: System Requirements & Technology Stack](#chapter-3-system-requirements--technology-stack)
   - 3.1 Hardware Specifications
   - 3.2 Software Specifications
   - 3.3 Technology Stack & Justification
5. [Chapter 4: System Architecture & Design](#chapter-4-system-architecture--design)
   - 4.1 System Architecture Diagram
   - 4.2 Data Flow Diagram (DFD Level 0 & Level 1)
   - 4.3 Data Model & Entity Specifications
6. [Chapter 5: Detailed Module Implementation (Phase 1 Completed)](#chapter-5-detailed-module-implementation)
   - 5.1 Module 1: Authentication & Role-Based Access Flow
   - 5.2 Module 2: Enterprise NOC Real-Time Dashboard
   - 5.3 Module 3: Interactive Network Topology Visualization (React Flow)
   - 5.4 Module 4: UI/UX Component Library & Design System
   - 5.5 Module 5: API & Simulation Service Architecture (GNS3 Stubs)
7. [Chapter 6: Testing, Verification & Quality Assurance](#chapter-6-testing-verification--quality-assurance)
   - 6.1 Test Cases & Functional Verification
   - 6.2 Code Quality & Static Analysis
8. [Chapter 7: Phased Roadmap & Future Enhancements](#chapter-7-phased-roadmap--future-enhancements)
9. [Chapter 8: Conclusion](#chapter-8-conclusion)
10. [References](#references)

---

# 1. Abstract

Modern enterprise network infrastructures are growing exponentially in scale, heterogeneity, and complexity. Managing multi-vendor routers, switches, firewalls, and servers via disjointed command-line interfaces (CLI) and legacy SNMP polling tools creates severe operational blind spots, delayed mean-time-to-resolution (MTTR), and increased vulnerability to downtime.

The **AI-NOC (Intelligent Network Operations Center with Automation & GNS3)** is an enterprise-grade SaaS platform engineered to deliver centralized, real-time network observability, automated incident management, interactive topology orchestration, and AI-driven telemetry diagnostics. Integrated with the **GNS3 Network Simulation Environment**, AI-NOC allows network administrators and engineers to monitor live physical or simulated network topologies with sub-second responsiveness.

This document presents the comprehensive academic and engineering documentation of the completed **Phase 1** implementation, including the secure multi-role Authentication Engine, the Enterprise NOC Operations Dashboard, the Interactive Node-and-Edge Topology Canvas, and the modular Service Layer prepared for RESTful backend and GNS3 API synchronization.

---

# Chapter 1: Introduction

### 1.1 Background & Motivation
In enterprise environments, the Network Operations Center (NOC) serves as the nerve center for maintaining 24/7 network availability, performance, and security. Traditional network monitoring tools are often passive, disjointed, and resource-heavy. With the advent of Software-Defined Networking (SDN) and Network Automation, modern network engineers require a unified single-pane-of-glass dashboard that visualizes active telemetry, pinpoints anomalies instantly, and bridges web technologies with emulation testbeds such as GNS3.

### 1.2 Problem Statement
Existing network management systems suffer from several critical shortcomings:
1. **Siloed Views:** Fragmented tools for topology mapping, alert tracking, and device diagnostics.
2. **High Latency in Incident Identification:** Excessive reliance on manual command execution (ping, traceroute, show ip bgp summary) to diagnose edge/core failures.
3. **Steep Learning Curve:** Complex, cluttered user interfaces that impede rapid decision-making during high-severity outages.
4. **Lack of Safe Emulation Testing:** Inability to test automation scripts and topology changes in a simulated sandbox (GNS3) before physical deployment.

### 1.3 Project Objectives
* **Objective 1:** Construct a responsive, modern Enterprise NOC Dashboard displaying network key performance indicators (KPIs), dynamic bandwidth utilization graphs, device distributions, and health scores.
* **Objective 2:** Develop an interactive, drag-and-drop Network Topology Canvas using React Flow to visually render 17+ nodes across WAN, Edge, Core, Distribution, Server, and PC layers.
* **Objective 3:** Implement an extensible, modular frontend architecture using React 18/19, TypeScript, and Tailwind CSS.
* **Objective 4:** Provide a secure Authentication & Session Management framework with Role-Based Access Control (Admin, Operator, Viewer).
* **Objective 5:** Establish a decoupled service architecture with API interceptors, Socket.IO placeholders, and GNS3 REST client stubs for seamless backend integration.

### 1.4 Scope of the Project
* **Current Completed Scope (Phase 1):** Complete frontend enterprise interface, authentication workflow, protected routes, interactive React Flow topology, real-time KPI metrics, responsive design system, and integration-ready service abstraction layer.
* **Extended Scope (Phases 2–5):** Complete alert triage engine, live device inventory, automated PDF/CSV reports, Python-based AI anomaly detection microservice, live GNS3 REST synchronization, and Express/MongoDB backend persistence.

---

# Chapter 2: Literature Survey & System Study

### 2.1 Existing Systems & Their Limitations

| Existing Solution | Primary Focus | Major Limitations |
| :--- | :--- | :--- |
| **Cisco Prime / DNA Center** | Enterprise Cisco Infrastructure | Vendor lock-in; proprietary hardware dependency; high cost. |
| **Zabbix / Nagios** | Server & Network Monitoring | Outdated UI/UX; static topology mapping; high configuration complexity. |
| **SolarWinds NPM** | Enterprise Infrastructure | Heavy resource consumption; closed architecture; monolithic licensing. |
| **Standalone GNS3 GUI** | Network Emulation & Testing | Desktop-bound PyQt GUI; lacks web-based multi-user NOC dashboard; no built-in AI analytics. |

### 2.2 Proposed AI-NOC Solution
AI-NOC addresses these limitations by introducing a lightweight, browser-accessible, cloud-native web dashboard that communicates with both live network controllers and GNS3 simulation servers.

```mermaid
graph TD
    A[Network Infrastructure / GNS3 Engine] -->|Telemetry / REST / Syslog| B[AI-NOC Middleware Service]
    B -->|WebSockets / REST API| C[React 18 / TypeScript SaaS Client]
    C --> D[Executive KPI Dashboard]
    C --> E[React Flow Topology Canvas]
    C --> F[AI Predictive Health Engine]
    C --> G[Role-Based Access Control]
```

### 2.3 Feasibility Study
* **Technical Feasibility:** The tech stack (React, TypeScript, Tailwind CSS, Vite, React Flow) is well-established, highly performant, and has strong open-source support.
* **Operational Feasibility:** The user interface follows standard enterprise UI/UX patterns (Inter font, WCAG-compliant color contrasts, instant visual feedback, search/filter bars), requiring minimal operator training.
* **Economic Feasibility:** Built completely on modern open-source web frameworks, eliminating recurring proprietary licensing costs for client visualization.

---

# Chapter 3: System Requirements & Technology Stack

### 3.1 Hardware Specifications

#### Client Side (Web Browser)
* **Processor:** Intel Core i3 / AMD Ryzen 3 or higher (Quad-Core recommended)
* **RAM:** Minimum 4 GB (8 GB recommended for large topologies)
* **Display Resolution:** Minimum 1280x720 (Optimized for 1920x1080 Full HD)
* **Network:** Active broadband / LAN connection

#### Server / Emulation Host (Future Production & GNS3 VM)
* **Processor:** Intel Core i7 / Xeon (8 Cores minimum for multi-router virtualization)
* **RAM:** 16 GB - 32 GB DDR4 (to host Cisco IOS, Dynamips, QEMU nodes in GNS3)
* **Storage:** 100 GB SSD

---

### 3.2 Software Specifications
* **Operating System:** Cross-platform (Windows 10/11, macOS, Ubuntu Linux)
* **Runtime Environment:** Node.js (v18.x or v20.x LTS)
* **Package Manager:** npm (v9.x or v10.x)
* **Build Tool:** Vite v8.x
* **Primary Language:** TypeScript 5.x / ECMAScript 2022
* **Web Browser:** Google Chrome 110+, Mozilla Firefox 110+, Microsoft Edge 110+

---

### 3.3 Technology Stack & Justification

```mermaid
mindmap
  root((AI-NOC Tech Stack))
    Frontend Framework
      React 18/19
      TypeScript 5
      Vite 8 Build Tool
    Styling & UI
      Tailwind CSS 3
      Lucide React Icons
      clsx & tailwind-merge
    Visualization
      React Flow (Topology)
      Recharts (Analytics)
    Routing & State
      React Router DOM v6/v7
      React Context API
    Integration Layer
      Axios HTTP Client
      Socket.IO Client
      GNS3 REST API Stubs
```

| Layer | Technology | Justification |
| :--- | :--- | :--- |
| **UI Framework** | **React 18/19 + TypeScript** | Component reusability, strict compile-time type safety, virtual DOM speed. |
| **Build Tool** | **Vite 8** | Near-instant Hot Module Replacement (HMR) and optimized esbuild bundling. |
| **CSS Architecture** | **Tailwind CSS 3** | Utility-first styling with zero runtime overhead and custom enterprise theme tokens. |
| **Topology Engine** | **React Flow (`reactflow`)** | Interactive draggable node-edge graph canvas with pan, zoom, minimap, and custom node rendering. |
| **Telemetry Charts** | **Recharts** | Declarative SVG-based charting for real-time inbound/outbound bandwidth analysis. |
| **Routing** | **React Router v6/v7** | Declarative client-side routing with lazy-loading and authentication guards. |
| **Network Client** | **Axios + JWT Interceptors** | Robust HTTP request/response pipeline ready for token-based authentication. |

---

# Chapter 4: System Architecture & Design

### 4.1 System Architecture Diagram

```mermaid
graph TB
    subgraph Presentation_Layer ["Presentation Layer (Client Browser)"]
        UI_Nav[TopNav & Sidebar Layout]
        UI_Dash[Dashboard & KPI Widgets]
        UI_Topo[React Flow Topology Canvas]
        UI_Auth[Login / Password Reset Pages]
        UI_Drawer[Device Detail Drawer]
    end

    subgraph State_And_Routing ["State Management & Routing"]
        Router[React Router DOM]
        AuthCtx[Auth Context & State Store]
        ProtRoute[Protected Route Guard]
    end

    subgraph Service_Abstraction_Layer ["Service Abstraction Layer"]
        ApiModule[api.ts - Axios Instance & Interceptors]
        AuthServ[authService.ts - Login / Session]
        NetServ[networkService.ts - Topology & Devices]
        AlertServ[alertService.ts - Incidents & Logs]
        GNS3Serv[gns3Service.ts - GNS3 REST Gateway]
        SockServ[socketService.ts - Real-time Socket.IO]
    end

    subgraph External_And_Backend ["Backend & Simulation (Integration Ready)"]
        REST_API[Node.js / Express REST API]
        DB[(MongoDB Database)]
        GNS3_VM[GNS3 Simulation Engine / Controller]
        AI_Py[Python AI Diagnostics Engine]
    end

    Presentation_Layer --> State_And_Routing
    State_And_Routing --> Service_Abstraction_Layer
    Service_Abstraction_Layer -.-> External_And_Backend
```

---

### 4.2 Data Flow Diagram (DFD)

#### Level 0 DFD (Context Level)
```mermaid
flowchart LR
    User([NOC Operator / Admin]) <-->|1. Credentials & Commands| AINOC[AI-NOC Web Application]
    AINOC <-->|2. Device States & Topology Data| GNS3[GNS3 Server / Network Core]
    AINOC <-->|3. User Profiles & Historical Logs| Database[(Database Server)]
```

#### Level 1 DFD (Decomposed Phase 1 Workflow)
```mermaid
flowchart TD
    User([User]) -->|Submits Credentials| AuthProc[Auth Controller]
    AuthProc -->|Validates User & Token| AuthCtx[(Auth State)]
    AuthCtx -->|Grants Access| Router[App Router]
    
    Router -->|Navigates to /dashboard| DashProc[Dashboard Processor]
    DashProc -->|Fetches Telemetry| KpiStore[(Dashboard Data Store)]
    KpiStore -->|Renders KPI & Charts| DashView[Dashboard View]

    Router -->|Navigates to /topology| TopoProc[Topology Engine]
    TopoProc -->|Calculates Coordinates & Links| NodeStore[(Topology Data Store)]
    NodeStore -->|Renders Graph & Filters| TopoView[React Flow Topology View]
    TopoView -->|Select Node Click| DrawProc[Device Detail Drawer]
```

---

### 4.3 Data Model & Entity Specifications (TypeScript)

The core domain model is formally defined in `src/types/index.ts`:

#### 1. Device Entity Model
```typescript
export interface Device {
  id: string;
  name: string;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'pc';
  status: 'online' | 'offline' | 'warning' | 'unknown';
  ipAddress: string;
  location: string;
  cpu: number;          // Percentage (0 - 100)
  ram: number;          // Percentage (0 - 100)
  uptime: string;
  lastSeen: string;
  model?: string;
  vendor?: string;
  interfaces?: Interface[];
}
```

#### 2. Network Topology Node & Edge Model
```typescript
export interface TopologyNode {
  id: string;
  type: DeviceType;
  label: string;
  ipAddress: string;
  status: DeviceStatus;
  cpu: number;
  ram: number;
  location: string;
  vendor?: string;
  model?: string;
  position: { x: number; y: number };
}

export interface TopologyEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  bandwidth?: string;
}
```

#### 3. Alert & KPI Telemetry Model
```typescript
export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  device: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface KpiData {
  networkHealthScore: number;
  onlineDevices: number;
  offlineDevices: number;
  activeAlerts: number;
  criticalAlerts: number;
  warningAlerts: number;
  cpuAverage: number;
  ramAverage: number;
  bandwidth: string;
  uptime: number;
}
```

---

# Chapter 5: Detailed Module Implementation

## 5.1 Module 1: Authentication & Role-Based Access Control
* **Source Location:** `src/pages/auth/`, `src/context/AuthContext.tsx`, `src/routes/ProtectedRoute.tsx`
* **Features:**
  * Clean enterprise login screen with validation, error toast alerts, and demo credential quick-fill (`admin@ainoc.com`, `operator@ainoc.com`).
  * Forgot Password workflow for credential recovery.
  * Session-Ready intermediate verification step before redirecting to dashboard.
  * Context-driven `AuthProvider` storing user tokens and session states across page refreshes.
  * `ProtectedRoute` wrapper guarding private routes (`/dashboard`, `/topology`, `/alerts`, etc.).

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Network Admin
    participant Login as LoginPage
    participant Ctx as AuthContext
    participant Guard as ProtectedRoute
    participant App as DashboardPage

    Admin->>Login: Enters Email & Password
    Login->>Ctx: Calls login(email, password)
    Ctx->>Ctx: Validates credentials & sets LocalStorage token
    Ctx-->>Login: Authentication Success
    Login->>Guard: Navigates to /dashboard
    Guard->>Ctx: Verifies isAuthenticated === true
    Guard-->>App: Mounts Dashboard View
```

---

## 5.2 Module 2: Enterprise NOC Operations Dashboard
* **Source Location:** `src/pages/dashboard/DashboardPage.tsx`, `src/components/dashboard/`
* **Key Subcomponents:**
  1. **KPI Metric Cards (`KpiCards.tsx`):**
     * Overall Network Health Score (94%)
     * Active & Online Device counts (142 Online, 7 Offline)
     * Alert Severities (3 Critical, 9 Warning)
     * Average Compute Load (CPU 67%, RAM 73%)
     * Total Bandwidth Consumption (2.4 Gbps) and System Uptime (99.8%).
  2. **Real-time Traffic Trend Area Chart (`TrafficChart.tsx`):**
     * 24-hour synchronized Inbound vs. Outbound network traffic visualization using Recharts.
  3. **AI Health Score Indicator (`AIHealthScore.tsx`):**
     * Radial gauge visualizer showing predictive health metrics calculated from current alert levels and hardware loads.
  4. **Device Distribution Breakdown (`DeviceDistributionChart.tsx`):**
     * Visual breakdown across Routers (18), Switches (45), Servers (24), Firewalls (8), and Workstations (54).
  5. **Recent Incident Triage Feed (`RecentAlerts.tsx`):**
     * Tabular stream of unresolved alarms with color-coded severity badges (`critical`, `warning`, `info`).
  6. **Quick Operations Panel (`QuickActions.tsx`) & Activity Audit Log (`ActivityFeed.tsx`):**
     * Shortcuts for topology discovery scans, config backups, and real-time operator audit logs.

---

## 5.3 Module 3: Interactive Network Topology Visualization
* **Source Location:** `src/pages/topology/TopologyPage.tsx`, `src/components/topology/`
* **Architecture:** Powered by **React Flow v11**, mapping a full hierarchical enterprise enterprise topology:

```
[ Internet / WAN ]
       │
┌──────┴──────┐
[ Router-Edge-01 ] [ Router-Edge-02 ]
       │                     │
[ FW-Primary ]         [ FW-Secondary ]
       └──────┬──────────────┘
       [ Core-Router-01 ]
       ┌──────┴──────┐
 [ SW-Core-01 ]  [ SW-Core-02 ]
   ┌───┴───┐       ┌───┴───────────┬──────────────┐
[Floor-1] [Floor-2] [Floor-3] [Server-DB-01/02] [Server-App-01/02]
   │         │
[PCs]     [PCs]
```

* **Interactive Features:**
  * **Custom Node Component (`TopologyNode.tsx`):** Displays real-time device type icons, IP address, CPU & RAM mini-gauges, and live status pulses (Green/Amber/Red).
  * **Device Search Bar:** Instant search filtering by hostname or IP address (dimming non-matching nodes to 15% opacity).
  * **Type & Status Filtering:** Filter by device category (*Routers, Switches, Firewalls, Servers, PCs*) or status (*Online, Warning, Offline*).
  * **Interactive Minimap & Viewport Controls:** Smooth zooming (0.3x to 2x), infinite panning, and auto-fit view.
  * **Device Detail Drawer (`DeviceDetailDrawer.tsx`):** Clicking any node opens a right-side drawer containing hardware specs, port interfaces (`GE0/0`, `GE0/1`), vendor details, uptime, and simulated GNS3 Node IDs.

---

## 5.4 Module 4: UI/UX Component Library & Design System
* **Source Location:** `src/components/common/`, `src/constants/theme.ts`
* **Color System:**
  * Primary Corporate Blue: `#2563EB` (Tailwind `primary-600`)
  * Network Teal Accent: `#0D9488` (Tailwind `teal-600`)
  * Success Status: `#16A34A` (Tailwind `success-600`)
  * Warning Status: `#F59E0B` (Tailwind `warning-500`)
  * Critical Status: `#DC2626` (Tailwind `critical-600`)
* **Reusable Atomic Components:**
  * `Button.tsx`: Variants (`primary`, `secondary`, `outline`, `ghost`, `danger`) with loading spinner state.
  * `Card.tsx`: Standardized elevated white container with soft borders and header slots.
  * `Badge.tsx`: Color-coded pill tags for status and severity rendering.
  * `Modal.tsx`: Accessible dialog overlays with backdrop blur.
  * `Toast.tsx`: Animated notification popups for user feedback.
  * `SearchBar.tsx`: Debounced input field with integrated clear action.
  * `Spinner.tsx` & `Skeleton.tsx`: Modern shimmer loading states.

---

## 5.5 Module 5: API & Simulation Service Architecture
* **Source Location:** `src/services/`
* **Modules:**
  * `api.ts`: Configured Axios client with `baseURL` fallback, timeout management, and automatic JWT Authorization header injection.
  * `authService.ts`: Authentication, session validation, and logout stubs.
  * `networkService.ts`: Endpoints for querying topology nodes, edges, device lists, and interface states.
  * `alertService.ts`: Methods for alert retrieval, acknowledgment, and deletion.
  * `gns3Service.ts`: Dedicated client for connecting to the GNS3 Server REST API (`/v2/projects/{project_id}/nodes`), enabling start/stop node actions and packet capture triggers.
  * `socketService.ts`: WebSocket client stub for bi-directional real-time telemetry streaming.

---

# Chapter 6: Testing, Verification & Quality Assurance

### 6.1 Test Cases & Functional Verification

| Test ID | Module | Test Scenario | Expected Output | Status |
| :--- | :--- | :--- | :--- | :--- |
| **TC-AUTH-01** | Authentication | Valid Login (`admin@ainoc.com`) | Sets auth state, redirects to `/dashboard` | **PASS** |
| **TC-AUTH-02** | Authentication | Invalid Login submission | Displays error toast, denies entry | **PASS** |
| **TC-AUTH-03** | Route Guard | Unauthenticated access to `/topology` | Automatically redirects to `/login` | **PASS** |
| **TC-DASH-01** | Dashboard | KPI Cards rendering | Accurately calculates health score & active alerts | **PASS** |
| **TC-DASH-02** | Dashboard | 24h Traffic chart interaction | Displays tooltip on hover with inbound/outbound Gbps | **PASS** |
| **TC-TOPO-01** | Topology | React Flow Canvas render | Renders 17 nodes and 17 connected edges | **PASS** |
| **TC-TOPO-02** | Topology | Node Search filter by IP ("10.0.0.1") | Highlights Core-Router-01, dims all others | **PASS** |
| **TC-TOPO-03** | Topology | Node Click trigger | Slides out Device Detail Drawer with hardware specs | **PASS** |
| **TC-TOPO-04** | Topology | Type Filter selection ("Firewalls") | Highlights only FW-Primary and FW-Secondary | **PASS** |

### 6.2 Code Quality & Static Analysis
* **TypeScript Compilation:** Fully typed with zero `any` leaks. Compiled using `tsc -b` with strict null checks.
* **Linter & Static Analysis:** Validated using `oxlint` ensuring clean code standards, unused import removal, and strict ECMAScript compliance.
* **Bundle Optimization:** Code split with dynamic `React.lazy()` for all route pages to achieve under 200ms initial load time.

---

# Chapter 7: Phased Roadmap & Future Enhancements

```mermaid
gantt
    title AI-NOC Development Roadmap
    dateFormat  YYYY-MM-DD
    section Phase 1 (Completed)
    Auth, Dashboard & Topology       :done, p1, 2026-08-01, 2026-08-22
    section Phase 2 (Next Step)
    Alert Engine & Device Inventory   :active, p2, 2026-08-23, 2026-09-15
    section Phase 3
    Reports & Multi-tenant RBAC      :p3, 2026-09-16, 2026-10-05
    section Phase 4
    Live GNS3 API & Python AI Engine :p4, 2026-10-06, 2026-10-25
    section Phase 5
    MongoDB Persistence & Cloud Deploy:p5, 2026-10-26, 2026-11-15
```

* **Phase 1 (Complete):** Core Web Platform, Authentication, Dashboard, Interactive Topology, Design System.
* **Phase 2 (Immediate Next):** Complete Alert Management Engine (`/alerts`), Device Inventory Management (`/devices`), and Advanced Historical Analytics (`/analytics`).
* **Phase 3:** Automated Reporting Module (PDF/CSV download), System Settings, and Multi-tenant Role-Based Access Control.
* **Phase 4:** Live GNS3 REST API Gateway, WebSocket real-time push, and Python-based Machine Learning models for predictive failure detection.
* **Phase 5:** Node.js/Express REST API backend, MongoDB cluster persistence, Docker containerization, and production cloud deployment.

---

# Chapter 8: Conclusion

The completion of **Phase 1** of the **AI-NOC (Intelligent Network Operations Center)** project successfully delivers a modern, high-performance, and visually intuitive network management frontend. By uniting declarative component architecture (React 18/TypeScript), responsive styling (Tailwind CSS), and graph-based canvas visualization (React Flow), the platform solves the fragmentation and latency issues prevalent in traditional network operations tools.

The project structure is thoroughly modular, fully documented, and engineered with clean service abstraction layers, providing an ideal foundation for connecting live GNS3 simulation environments and backend AI analytics microservices in subsequent phases.

---

# References
1. **React Documentation:** *React 18 – Concurrent Rendering & Hooks API*, [https://react.dev](https://react.dev)
2. **React Flow Documentation:** *Interactive Node-Based UI Library*, [https://reactflow.dev](https://reactflow.dev)
3. **Tailwind CSS Specification:** *Utility-First CSS Framework for Rapid UI Development*, [https://tailwindcss.com](https://tailwindcss.com)
4. **GNS3 Developer Guide:** *GNS3 Server REST API v2 Specifications*, [https://gns3-server.readthedocs.io](https://gns3-server.readthedocs.io)
5. **Cisco Networking Academy:** *Network Automation and Operations Center Architectures*, Cisco Press.
6. **IETF RFC 7519:** *JSON Web Token (JWT) Architecture and Security Guidelines*.
