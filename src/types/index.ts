// ============================================================
// TypeScript Types – AI-NOC Enterprise SaaS
// ============================================================

export type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';
export type DeviceStatus = 'online' | 'offline' | 'warning' | 'unknown';
export type DeviceType = 'router' | 'switch' | 'firewall' | 'server' | 'pc';

// ---------- Auth ----------
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'operator' | 'viewer';
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// ---------- Alerts ----------
export interface Alert {
  id: string;
  severity: AlertSeverity;
  device: string;
  message: string;
  timestamp: string;
  acknowledged: boolean;
}

// ---------- Devices ----------
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  status: DeviceStatus;
  ipAddress: string;
  location: string;
  cpu: number;
  ram: number;
  uptime: string;
  lastSeen: string;
  model?: string;
  vendor?: string;
  interfaces?: Interface[];
}

export interface Interface {
  name: string;
  status: 'up' | 'down';
  ipAddress?: string;
  speed?: string;
}

// ---------- Dashboard ----------
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

export interface TrafficDataPoint {
  time: string;
  inbound: number;
  outbound: number;
}

export interface DeviceDistribution {
  type: DeviceType;
  label: string;
  count: number;
  color: string;
}

export interface ActivityItem {
  id: string;
  message: string;
  timestamp: string;
  type: AlertSeverity;
  device?: string;
}

// ---------- Topology ----------
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
