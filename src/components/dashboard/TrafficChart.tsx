import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardHeader } from '../common/Card';
import { Wifi } from 'lucide-react';
import type { TrafficDataPoint } from '../../types';

interface TrafficChartProps {
  data: TrafficDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-card-md p-3">
        <p className="text-xs font-semibold text-text-primary mb-2">{label}</p>
        {payload.map((p, i) => (
          <div key={i} className="flex items-center gap-2 text-xs">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: p.color }} />
            <span className="text-text-secondary capitalize">{p.name}:</span>
            <span className="font-semibold text-text-primary">{p.value} Gbps</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const TrafficChart: React.FC<TrafficChartProps> = ({ data }) => (
  <Card padding="md">
    <CardHeader
      title="Network Traffic"
      subtitle="24-hour bandwidth utilization"
      icon={
        <div className="p-2 bg-primary-50 rounded-lg">
          <Wifi className="h-4 w-4 text-primary-600" />
        </div>
      }
    />
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="inboundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="outboundGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#0d9488" stopOpacity={0.15} />
            <stop offset="95%" stopColor="#0d9488" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fontSize: 10, fill: '#94a3b8' }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v: number) => `${v}G`}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: '11px', paddingTop: '12px' }}
          iconType="circle"
          iconSize={8}
        />
        <Area
          type="monotone"
          dataKey="inbound"
          name="Inbound"
          stroke="#2563eb"
          strokeWidth={2}
          fill="url(#inboundGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
        <Area
          type="monotone"
          dataKey="outbound"
          name="Outbound"
          stroke="#0d9488"
          strokeWidth={2}
          fill="url(#outboundGrad)"
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  </Card>
);
