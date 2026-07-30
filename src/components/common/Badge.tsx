import React from 'react';
import { cn, getSeverityClasses, getStatusClasses } from '../../utils';
import type { AlertSeverity, DeviceStatus } from '../../types';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'severity' | 'status';
  severity?: AlertSeverity;
  status?: DeviceStatus;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  severity,
  status,
  size = 'sm',
  dot = false,
  className,
}) => {
  let classes = '';

  if (variant === 'severity' && severity) {
    const s = getSeverityClasses(severity);
    classes = s.badge;
  } else if (variant === 'status' && status) {
    const s = getStatusClasses(status);
    classes = `${s.bg} ${s.text} border border-current/10`;
  } else {
    classes = 'bg-surface-tertiary text-text-secondary border border-border';
  }

  const dotColor =
    variant === 'severity' && severity
      ? getSeverityClasses(severity).dot
      : variant === 'status' && status
      ? getStatusClasses(status).dot
      : 'bg-text-muted';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-medium rounded-full',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs',
        classes,
        className
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor)} />
      )}
      {children}
    </span>
  );
};

// Convenience severity badge
export const SeverityBadge: React.FC<{ severity: AlertSeverity }> = ({ severity }) => {
  const labels: Record<AlertSeverity, string> = {
    critical: 'Critical',
    warning: 'Warning',
    info: 'Info',
    success: 'Success',
  };
  return (
    <Badge variant="severity" severity={severity} dot>
      {labels[severity]}
    </Badge>
  );
};

// Convenience status badge
export const StatusBadge: React.FC<{ status: DeviceStatus }> = ({ status }) => {
  const labels: Record<DeviceStatus, string> = {
    online: 'Online',
    offline: 'Offline',
    warning: 'Warning',
    unknown: 'Unknown',
  };
  return (
    <Badge variant="status" status={status} dot>
      {labels[status]}
    </Badge>
  );
};
