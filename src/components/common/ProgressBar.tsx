import React from 'react';
import { cn } from '../../utils';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  label?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'teal' | 'success' | 'warning' | 'critical' | 'auto';
  className?: string;
}

function getAutoVariant(value: number): string {
  if (value >= 90) return 'bg-critical-600';
  if (value >= 75) return 'bg-warning-500';
  return 'bg-primary-600';
}

const variantFill: Record<string, string> = {
  primary: 'bg-primary-600',
  teal: 'bg-teal-600',
  success: 'bg-success-600',
  warning: 'bg-warning-500',
  critical: 'bg-critical-600',
};

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
};

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  label,
  showValue = false,
  size = 'md',
  variant = 'primary',
  className,
}) => {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const fillClass = variant === 'auto' ? getAutoVariant(pct) : variantFill[variant];

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-1.5">
          {label && <span className="text-xs text-text-secondary font-medium">{label}</span>}
          {showValue && (
            <span className="text-xs font-semibold text-text-primary">{value}%</span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-surface-tertiary rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', fillClass)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
