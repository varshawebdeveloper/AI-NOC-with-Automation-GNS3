import React from 'react';
import { Clock } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { cn, formatRelativeTime, getSeverityClasses } from '../../utils';
import type { ActivityItem } from '../../types';

interface ActivityFeedProps {
  items: ActivityItem[];
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ items }) => {
  // Static class map so Tailwind detects them at build time
  const ringMap: Record<string, string> = {
    critical: 'ring-critical-200',
    warning:  'ring-warning-200',
    success:  'ring-success-100',
    info:     'ring-primary-200',
  };

  return (
  <Card padding="md">
    <CardHeader
      title="Recent Activity"
      subtitle="Network event timeline"
      icon={
        <div className="p-2 bg-surface-tertiary rounded-lg">
          <Clock className="h-4 w-4 text-text-secondary" />
        </div>
      }
    />
    <div className="space-y-0">
      {items.map((item, idx) => {
        const classes = getSeverityClasses(item.type);
        const ringClass = ringMap[item.type] ?? 'ring-primary-200';
        return (
          <div key={item.id} className="flex gap-3 relative">
            {/* Timeline connector */}
            {idx < items.length - 1 && (
              <div className="absolute left-[7px] top-5 w-[2px] h-full bg-border" />
            )}
            {/* Dot */}
            <div className={cn('w-3.5 h-3.5 rounded-full mt-1 flex-shrink-0 border-2 border-white ring-2', classes.dot, ringClass)} />
            {/* Content */}
            <div className="flex-1 pb-4 min-w-0">
              <p className="text-xs text-text-primary font-medium leading-snug">{item.message}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {item.device && (
                  <span className="text-[10px] text-text-muted font-medium">{item.device}</span>
                )}
                <span className="text-[10px] text-text-muted">{formatRelativeTime(item.timestamp)}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  </Card>
  );
};
