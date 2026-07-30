import React from 'react';
import { Bell, ChevronRight } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { SeverityBadge } from '../common/Badge';
import { formatRelativeTime } from '../../utils';
import type { Alert } from '../../types';

interface RecentAlertsProps {
  alerts: Alert[];
  maxRows?: number;
}

export const RecentAlerts: React.FC<RecentAlertsProps> = ({ alerts, maxRows = 6 }) => {
  const displayed = alerts.slice(0, maxRows);

  return (
    <Card padding="none">
      <div className="px-5 pt-5 pb-0">
        <CardHeader
          title="Recent Alerts"
          subtitle={`${alerts.filter((a) => !a.acknowledged).length} unacknowledged`}
          icon={
            <div className="p-2 bg-critical-50 rounded-lg">
              <Bell className="h-4 w-4 text-critical-600" />
            </div>
          }
          action={
            <button className="text-xs text-primary-600 hover:text-primary-700 font-medium hover:underline flex items-center gap-1">
              View all <ChevronRight className="h-3 w-3" />
            </button>
          }
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-y border-border bg-surface-secondary">
              <th className="px-5 py-2.5 text-left font-semibold text-text-secondary">Severity</th>
              <th className="px-3 py-2.5 text-left font-semibold text-text-secondary">Device</th>
              <th className="px-3 py-2.5 text-left font-semibold text-text-secondary hidden sm:table-cell">Message</th>
              <th className="px-5 py-2.5 text-right font-semibold text-text-secondary">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {displayed.map((alert) => (
              <tr
                key={alert.id}
                className={`hover:bg-surface-secondary transition-colors ${
                  !alert.acknowledged ? 'bg-white' : 'bg-white opacity-70'
                }`}
              >
                <td className="px-5 py-3">
                  <SeverityBadge severity={alert.severity} />
                </td>
                <td className="px-3 py-3">
                  <span className="font-medium text-text-primary">{alert.device}</span>
                </td>
                <td className="px-3 py-3 hidden sm:table-cell">
                  <span className="text-text-secondary">{alert.message}</span>
                </td>
                <td className="px-5 py-3 text-right text-text-muted whitespace-nowrap">
                  {formatRelativeTime(alert.timestamp)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
