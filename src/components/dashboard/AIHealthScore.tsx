import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { cn } from '../../utils';
import { getTrafficData, type TrafficData } from '../../services/api';

export const AIHealthScore: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);

  useEffect(() => {
    const loadTrafficData = async () => {
      try {
        const data = await getTrafficData();
        setTrafficData(data);
      } catch (error) {
        console.error('Failed to load traffic data:', error);
      }
    };

    loadTrafficData();
  }, []);

  // Calculate health score from live risk
  const score = trafficData
    ? Math.max(0, Math.min(100, 100 - trafficData.risk))
    : 0;

  const getLabel = (s: number) => {
    if (s >= 90) return { text: 'Excellent', color: 'text-teal-600' };
    if (s >= 75) return { text: 'Good', color: 'text-success-600' };
    if (s >= 50) return { text: 'Fair', color: 'text-warning-600' };
    return { text: 'Critical', color: 'text-critical-600' };
  };

  const label = getLabel(score);

  // Live-derived scores
  const connectivity =
    trafficData && trafficData.total_packets > 0 ? 100 : 0;

  const security = trafficData
    ? Math.max(0, 100 - trafficData.risk)
    : 0;

  const trafficStability =
    trafficData?.threat === 'LOW'
      ? 100
      : trafficData?.threat === 'MEDIUM'
        ? 70
        : trafficData?.threat === 'HIGH'
          ? 40
          : 0;

  // SVG arc parameters
  const radius = 54;
  const strokeWidth = 10;
  const cx = 80;
  const circumference = Math.PI * radius;
  const filled = (score / 100) * circumference;
  const empty = circumference - filled;

  return (
    <Card padding="md">
      <CardHeader
        title="AI Health Score"
        subtitle="Real-time network assessment"
        icon={
          <div className="p-2 bg-teal-100 rounded-lg">
            <Activity className="h-4 w-4 text-teal-600" />
          </div>
        }
      />

      <div className="flex flex-col items-center py-2">

        {/* Gauge SVG */}
        <svg width={160} height={100} viewBox="0 0 160 100">

          {/* Background arc */}
          <path
            d="M 16 90 A 64 64 0 0 1 144 90"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled arc */}
          <circle
            cx={cx}
            cy={cx}
            r={radius}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${empty + circumference}`}
            strokeDashoffset={circumference / 2}
            transform={`rotate(-180 ${cx} ${cx})`}
          />

          <defs>
            <linearGradient
              id="gaugeGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>

        </svg>

        {/* Score display */}
        <div className="-mt-8 text-center">

          <span className={cn('text-4xl font-bold', label.color)}>
            {trafficData ? score : '--'}
          </span>

          <span className="text-lg font-semibold text-text-muted">
            /100
          </span>

          <p className={cn('text-sm font-semibold mt-1', label.color)}>
            {trafficData ? label.text : 'Loading...'}
          </p>

        </div>

        {/* Live Sub-scores */}
        <div className="grid grid-cols-3 gap-3 w-full mt-4">

          <div className="text-center">
            <div className="text-sm font-bold text-text-primary">
              {connectivity}%
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">
              Connectivity
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm font-bold text-text-primary">
              {security}%
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">
              Security
            </div>
          </div>

          <div className="text-center">
            <div className="text-sm font-bold text-text-primary">
              {trafficStability}%
            </div>
            <div className="text-[10px] text-text-muted mt-0.5">
              Traffic Stability
            </div>
          </div>

        </div>

      </div>
    </Card>
  );
};