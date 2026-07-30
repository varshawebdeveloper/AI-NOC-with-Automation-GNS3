import React from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { cn } from '../../utils';

interface AIHealthScoreProps {
  score: number; // 0-100
}

export const AIHealthScore: React.FC<AIHealthScoreProps> = ({ score }) => {
  const getLabel = (s: number) => {
    if (s >= 90) return { text: 'Excellent', color: 'text-teal-600' };
    if (s >= 75) return { text: 'Good', color: 'text-success-600' };
    if (s >= 50) return { text: 'Fair', color: 'text-warning-600' };
    return { text: 'Critical', color: 'text-critical-600' };
  };

  const label = getLabel(score);

  // SVG arc parameters
  const radius = 54;
  const strokeWidth = 10;
  const cx = 80;
  const circumference = Math.PI * radius; // half circle = π * r
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
          {/* Filled arc using stroke-dasharray */}
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
            <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score display */}
        <div className="-mt-8 text-center">
          <span className={cn('text-4xl font-bold', label.color)}>{score}</span>
          <span className="text-lg font-semibold text-text-muted">/100</span>
          <p className={cn('text-sm font-semibold mt-1', label.color)}>{label.text}</p>
        </div>

        {/* Sub-scores */}
        <div className="grid grid-cols-3 gap-3 w-full mt-4">
          {[
            { label: 'Connectivity', value: 98 },
            { label: 'Security',     value: 91 },
            { label: 'Performance',  value: 87 },
          ].map((item) => (
            <div key={item.label} className="text-center">
              <div className="text-sm font-bold text-text-primary">{item.value}%</div>
              <div className="text-[10px] text-text-muted mt-0.5">{item.label}</div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
