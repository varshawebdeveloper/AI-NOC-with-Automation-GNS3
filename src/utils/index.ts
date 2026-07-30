import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { AlertSeverity, DeviceStatus, DeviceType } from '../types';

// Merge Tailwind classes safely
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

// Format relative time
export function formatRelativeTime(timestamp: string): string {
  const now = new Date();
  const then = new Date(timestamp);
  const diffMs = now.getTime() - then.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  return `${diffDays}d ago`;
}

// Format bytes to human readable
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Severity to Tailwind classes
export function getSeverityClasses(severity: AlertSeverity): {
  bg: string; text: string; dot: string; badge: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-critical-100',
        text: 'text-critical-600',
        dot: 'bg-critical-600',
        badge: 'bg-critical-50 text-critical-600 border border-critical-100',
      };
    case 'warning':
      return {
        bg: 'bg-warning-100',
        text: 'text-warning-600',
        dot: 'bg-warning-500',
        badge: 'bg-warning-50 text-warning-600 border border-warning-100',
      };
    case 'success':
      return {
        bg: 'bg-success-100',
        text: 'text-success-600',
        dot: 'bg-success-600',
        badge: 'bg-success-50 text-success-600 border border-success-100',
      };
    case 'info':
    default:
      return {
        bg: 'bg-primary-100',
        text: 'text-primary-600',
        dot: 'bg-primary-600',
        badge: 'bg-primary-50 text-primary-600 border border-primary-100',
      };
  }
}

// Device status to classes
export function getStatusClasses(status: DeviceStatus): {
  bg: string; text: string; dot: string; ring: string;
} {
  switch (status) {
    case 'online':
      return {
        bg: 'bg-success-50',
        text: 'text-success-600',
        dot: 'bg-success-600',
        ring: 'ring-success-600',
      };
    case 'offline':
      return {
        bg: 'bg-critical-50',
        text: 'text-critical-600',
        dot: 'bg-critical-600',
        ring: 'ring-critical-600',
      };
    case 'warning':
      return {
        bg: 'bg-warning-50',
        text: 'text-warning-600',
        dot: 'bg-warning-500',
        ring: 'ring-warning-500',
      };
    default:
      return {
        bg: 'bg-surface-tertiary',
        text: 'text-text-muted',
        dot: 'bg-text-muted',
        ring: 'ring-text-muted',
      };
  }
}

// Device type to label
export function getDeviceTypeLabel(type: DeviceType): string {
  const labels: Record<DeviceType, string> = {
    router: 'Router',
    switch: 'Switch',
    firewall: 'Firewall',
    server: 'Server',
    pc: 'PC / Endpoint',
  };
  return labels[type] ?? type;
}

// Validate email
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Truncate text
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '…';
}
