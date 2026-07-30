import React from 'react';
import {
  Activity,
  Monitor,
  WifiOff,
  AlertTriangle,
  Cpu,
  MemoryStick,
  Wifi,
  TrendingUp,
  TrendingDown,
  CheckCircle,
} from 'lucide-react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { cn } from '../../utils';
import type { KpiData } from '../../types';

interface KpiCardsProps {
  data: KpiData;
}

interface KpiCard {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  trend?: 'up' | 'down' | 'neutral';
  trendText?: string;
  progressValue?: number;
  progressVariant?: 'primary' | 'teal' | 'auto';
  valueColor?: string;
}

export const KpiCards: React.FC<KpiCardsProps> = ({ data }) => {
  const cards: KpiCard[] = [
    {
      id: 'health-score',
      label: 'AI Health Score',
      value: `${data.networkHealthScore}%`,
      subtitle: 'Network Status: Excellent',
      icon: <Activity className="h-5 w-5" />,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      valueColor: 'text-teal-600',
      progressValue: data.networkHealthScore,
      progressVariant: 'teal',
    },
    {
      id: 'online-devices',
      label: 'Online Devices',
      value: data.onlineDevices,
      subtitle: '+3 from yesterday',
      icon: <Monitor className="h-5 w-5" />,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-600',
      trend: 'up',
      trendText: '+3',
    },
    {
      id: 'offline-devices',
      label: 'Offline Devices',
      value: data.offlineDevices,
      subtitle: 'Requires attention',
      icon: <WifiOff className="h-5 w-5" />,
      iconBg: 'bg-critical-100',
      iconColor: 'text-critical-600',
      valueColor: 'text-critical-600',
      trend: 'down',
      trendText: 'Action needed',
    },
    {
      id: 'active-alerts',
      label: 'Active Alerts',
      value: data.activeAlerts,
      subtitle: `${data.criticalAlerts} Critical · ${data.warningAlerts} Warning`,
      icon: <AlertTriangle className="h-5 w-5" />,
      iconBg: 'bg-warning-100',
      iconColor: 'text-warning-600',
      valueColor: 'text-warning-600',
    },
    {
      id: 'cpu-average',
      label: 'CPU Average',
      value: `${data.cpuAverage}%`,
      subtitle: 'Across all devices',
      icon: <Cpu className="h-5 w-5" />,
      iconBg: 'bg-surface-tertiary',
      iconColor: 'text-text-secondary',
      progressValue: data.cpuAverage,
      progressVariant: 'auto',
    },
    {
      id: 'ram-average',
      label: 'RAM Average',
      value: `${data.ramAverage}%`,
      subtitle: 'Across all devices',
      icon: <MemoryStick className="h-5 w-5" />,
      iconBg: 'bg-surface-tertiary',
      iconColor: 'text-text-secondary',
      progressValue: data.ramAverage,
      progressVariant: 'auto',
    },
    {
      id: 'bandwidth',
      label: 'Bandwidth',
      value: data.bandwidth,
      subtitle: 'Peak: 3.1 Gbps today',
      icon: <Wifi className="h-5 w-5" />,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-600',
      trend: 'neutral',
    },
    {
      id: 'uptime',
      label: 'Uptime',
      value: `${data.uptime}%`,
      subtitle: '30-day average',
      icon: <CheckCircle className="h-5 w-5" />,
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
      valueColor: 'text-success-600',
      trend: 'up',
      trendText: 'Excellent',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.id} className="relative overflow-hidden group hover:shadow-card-md transition-shadow duration-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-text-muted font-medium">{card.label}</p>
              <p className={cn('text-2xl font-bold mt-1', card.valueColor ?? 'text-text-primary')}>
                {card.value}
              </p>
            </div>
            <div className={cn('p-2.5 rounded-xl flex-shrink-0', card.iconBg)}>
              <span className={card.iconColor}>{card.icon}</span>
            </div>
          </div>

          {card.progressValue !== undefined ? (
            <ProgressBar
              value={card.progressValue}
              size="sm"
              variant={card.progressVariant ?? 'primary'}
            />
          ) : (
            <div className="flex items-center gap-1.5">
              {card.trend === 'up' && <TrendingUp className="h-3 w-3 text-success-600" />}
              {card.trend === 'down' && <TrendingDown className="h-3 w-3 text-critical-600" />}
              <p className="text-xs text-text-muted">{card.subtitle}</p>
              {card.trendText && (
                <span className={cn(
                  'text-xs font-semibold ml-1',
                  card.trend === 'up' ? 'text-success-600' : card.trend === 'down' ? 'text-critical-600' : 'text-text-secondary'
                )}>
                  {card.trendText}
                </span>
              )}
            </div>
          )}

          {card.progressValue !== undefined && (
            <p className="text-xs text-text-muted mt-1.5">{card.subtitle}</p>
          )}
        </Card>
      ))}
    </div>
  );
};
