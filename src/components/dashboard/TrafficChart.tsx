import React, { useEffect, useState } from 'react';
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
import { getTrafficData, type TrafficData } from '../../services/api';

interface ChartData {
  protocol: string;
  packets: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
  }>;
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-border rounded-lg shadow-card-md p-3">
        <p className="text-xs font-semibold text-text-primary mb-2">
          {label}
        </p>

        {payload.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-2 text-xs"
          >
            <span className="text-text-secondary">
              Packets:
            </span>

            <span className="font-semibold text-text-primary">
              {item.value}
            </span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

export const TrafficChart: React.FC = () => {
  const [trafficData, setTrafficData] =
    useState<TrafficData | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getTrafficData();

        console.log('Traffic Chart API Data:', data);

        setTrafficData(data);
      } catch (err) {
        console.error(
          'Failed to fetch traffic chart data:',
          err
        );

        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchTrafficData();
  }, []);

  const chartData: ChartData[] = trafficData
    ? [
        {
          protocol: 'ICMP',
          packets: trafficData.icmp,
        },
        {
          protocol: 'OSPF',
          packets: trafficData.ospf,
        },
        {
          protocol: 'TCP',
          packets: trafficData.tcp,
        },
        {
          protocol: 'UDP',
          packets: trafficData.udp,
        },
        {
          protocol: 'Other',
          packets: trafficData.other,
        },
      ]
    : [];

  return (
    <Card padding="md">
      <CardHeader
        title="Network Traffic"
        subtitle="Protocol traffic captured from PCAP"
        icon={
          <div className="p-2 bg-primary-50 rounded-lg">
            <Wifi className="h-4 w-4 text-primary-600" />
          </div>
        }
      />

      {loading && (
        <div className="h-[220px] flex items-center justify-center">
          <p className="text-sm text-text-muted">
            Loading traffic data...
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="h-[220px] flex items-center justify-center">
          <p className="text-sm text-critical-600">
            Unable to fetch traffic data
          </p>
        </div>
      )}

      {!loading && !error && (
        <ResponsiveContainer
          width="100%"
          height={220}
        >
          <AreaChart
            data={chartData}
            margin={{
              top: 5,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="packetGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.2}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />

            <XAxis
              dataKey="protocol"
              tick={{
                fontSize: 10,
                fill: '#94a3b8',
              }}
              axisLine={false}
              tickLine={false}
            />

            <YAxis
              tick={{
                fontSize: 10,
                fill: '#94a3b8',
              }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />

            <Tooltip
              content={<CustomTooltip />}
            />

            <Legend
              wrapperStyle={{
                fontSize: '11px',
                paddingTop: '12px',
              }}
              iconType="circle"
              iconSize={8}
            />

            <Area
              type="monotone"
              dataKey="packets"
              name="Packets"
              stroke="#2563eb"
              strokeWidth={2}
              fill="url(#packetGradient)"
              dot={false}
              activeDot={{
                r: 4,
                strokeWidth: 0,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
};