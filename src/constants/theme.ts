// ============================================================
// Theme Constants – AI-NOC Enterprise SaaS
// ============================================================

export const COLORS = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  teal: {
    100: '#ccfbf1',
    600: '#0d9488',
    700: '#0f766e',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    600: '#16a34a',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
  },
  critical: {
    50: '#fef2f2',
    100: '#fee2e2',
    600: '#dc2626',
  },
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    muted: '#94a3b8',
  },
  border: '#e2e8f0',
  surface: {
    DEFAULT: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
  },
} as const;

export const ROUTES = {
  LOGIN: '/login',
  FORGOT_PASSWORD: '/forgot-password',
  SESSION_READY: '/session-ready',
  DASHBOARD: '/dashboard',
  TOPOLOGY: '/topology',
  ALERTS: '/alerts',
  DEVICES: '/devices',
  ANALYTICS: '/analytics',
  REPORTS: '/reports',
  SETTINGS: '/settings',
} as const;

export const APP_NAME = 'AI-NOC';
export const APP_TAGLINE = 'Intelligent Network Operations Center';

export const DEVICE_TYPES = {
  ROUTER: 'router',
  SWITCH: 'switch',
  FIREWALL: 'firewall',
  SERVER: 'server',
  PC: 'pc',
} as const;

export const ALERT_SEVERITY = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
  SUCCESS: 'success',
} as const;

export const DEVICE_STATUS = {
  ONLINE: 'online',
  OFFLINE: 'offline',
  WARNING: 'warning',
  UNKNOWN: 'unknown',
} as const;
