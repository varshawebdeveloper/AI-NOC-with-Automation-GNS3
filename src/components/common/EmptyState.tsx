import React from 'react';
import { Network } from 'lucide-react';
import { cn } from '../../utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className,
}) => (
  <div className={cn('flex flex-col items-center justify-center gap-3 py-12 text-center', className)}>
    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-surface-secondary text-text-muted">
      {icon ?? <Network className="h-6 w-6" />}
    </div>
    <div>
      <p className="text-sm font-semibold text-text-primary">{title}</p>
      {description && (
        <p className="text-xs text-text-muted mt-1 max-w-xs">{description}</p>
      )}
    </div>
    {action && <div className="mt-1">{action}</div>}
  </div>
);
