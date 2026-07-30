import React from 'react';
import { cn } from '../../utils';

interface SkeletonProps {
  className?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className, lines = 1 }) => {
  if (lines === 1) {
    return (
      <div className={cn('animate-pulse bg-surface-tertiary rounded', className)} />
    );
  }
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'animate-pulse bg-surface-tertiary rounded h-4',
            i === lines - 1 && 'w-3/4',
            className
          )}
        />
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="bg-white rounded-card border border-border p-5 animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <div className="space-y-2">
        <div className="h-3 w-24 bg-surface-tertiary rounded" />
        <div className="h-7 w-16 bg-surface-tertiary rounded" />
      </div>
      <div className="h-10 w-10 bg-surface-tertiary rounded-lg" />
    </div>
    <div className="h-2 w-full bg-surface-tertiary rounded-full" />
  </div>
);

export const TableSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 animate-pulse">
        <div className="h-4 w-16 bg-surface-tertiary rounded" />
        <div className="h-4 flex-1 bg-surface-tertiary rounded" />
        <div className="h-4 w-24 bg-surface-tertiary rounded" />
        <div className="h-4 w-16 bg-surface-tertiary rounded" />
      </div>
    ))}
  </div>
);
