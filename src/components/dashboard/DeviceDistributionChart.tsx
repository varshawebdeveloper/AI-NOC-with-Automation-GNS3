import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardHeader } from '../common/Card';
import { Monitor } from 'lucide-react';
import type { DeviceDistribution } from '../../types';

interface DeviceDistributionChartProps {
  data: DeviceDistribution[];
}

const CustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    const item = payload[0];
    return (
      <div className="bg-white border border-border rounded-lg shadow-card-md p-3">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.payload.color }} />
          <span className="text-xs font-semibold text-text-primary">{item.name}</span>
          <span className="text-xs text-text-secondary ml-1">{item.value} devices</span>
        </div>
      </div>
    );
  }
  return null;
};

export const DeviceDistributionChart: React.FC<DeviceDistributionChartProps> = ({ data }) => {
  const total = data.reduce((sum, d) => sum + d.count, 0);

  return (
    <Card padding="md">
      <CardHeader
        title="Device Distribution"
        subtitle={`${total} total devices`}
        icon={
          <div className="p-2 bg-teal-100 rounded-lg">
            <Monitor className="h-4 w-4 text-teal-600" />
          </div>
        }
      />
      <div className="flex flex-col items-center">
        <ResponsiveContainer width="100%" height={160}>
          <PieChart>
            <Pie
              data={data.map((d) => ({ name: d.label, value: d.count, color: d.color }))}
              cx="50%"
              cy="50%"
              innerRadius={45}
              outerRadius={70}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>

        {/* Legend */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full mt-1">
          {data.map((item) => (
            <div key={item.type} className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
              <span className="text-[11px] text-text-secondary flex-1 truncate">{item.label}</span>
              <span className="text-[11px] font-semibold text-text-primary">{item.count}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};
