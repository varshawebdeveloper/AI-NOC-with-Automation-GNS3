import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Legend
} from 'recharts';
import {
  TrendingUp,
  Activity,
  AlertTriangle,
  BrainCircuit,
  Calendar,
  ChevronDown
} from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';

export const AnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('7d');
  const [chartData, setChartData] = useState<any[]>([]);

  // Generate dynamic deterministic data for the charts
  useEffect(() => {
    const data = [];
    const points = timeRange === '24h' ? 24 : timeRange === '7d' ? 7 : 30;
    const now = new Date();
    
    for (let i = points; i >= 0; i--) {
      const d = new Date(now);
      if (timeRange === '24h') d.setHours(d.getHours() - i);
      else d.setDate(d.getDate() - i);
      
      const label = timeRange === '24h' 
        ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        : d.toLocaleDateString([], { month: 'short', day: 'numeric' });
      
      // Generate somewhat realistic looking network waves
      const baseTraffic = 400 + Math.sin(i * 0.5) * 200;
      const inbound = Math.max(100, Math.floor(baseTraffic + Math.random() * 150));
      const outbound = Math.max(50, Math.floor(baseTraffic * 0.7 + Math.random() * 100));
      const latency = Math.max(5, Math.floor(15 + Math.sin(i * 0.8) * 10 + Math.random() * 5));
      const packetLoss = Math.max(0, parseFloat((Math.sin(i * 0.3) * 0.5 + Math.random() * 0.2).toFixed(2)));
      
      data.push({
        time: label,
        inbound,
        outbound,
        latency,
        packetLoss: Number(packetLoss)
      });
    }
    setChartData(data);
  }, [timeRange]);

  const anomalies = [
    { id: 1, type: 'Capacity Warning', node: 'R1-Core', description: 'Interface G0/0 predicted to saturate in 48 hours based on current 7-day velocity.', probability: 89, time: '2 hours ago' },
    { id: 2, type: 'Latency Spike', node: 'SW-Dist-2', description: 'Recurring micro-bursts detected during backup window. Consider QoS adjustment.', probability: 76, time: '5 hours ago' },
    { id: 3, type: 'Hardware Degradation', node: 'FW-Edge', description: 'CPU temperature trend suggests cooling failure within 14 days.', probability: 92, time: '1 day ago' },
  ];

  return (
    <AppLayout breadcrumbs={[{ label: 'Analytics' }]}>
      <div className="flex flex-col gap-6 animate-fade-in">
        
        {/* HEADER CONTROLS */}
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-card border border-gray-100">
          <div className="flex items-center gap-2 text-gray-700 font-medium">
            <Calendar className="w-5 h-5 text-blue-600" />
            Time Range:
          </div>
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['24h', '7d', '30d'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  timeRange === range
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {range === '24h' ? 'Last 24 Hours' : range === '7d' ? 'Last 7 Days' : 'Last 30 Days'}
              </button>
            ))}
          </div>
        </div>

        {/* CHARTS GRID */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          
          {/* BANDWIDTH CHART */}
          <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">Bandwidth Trend Forecast</h2>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorInbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOutbound" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0D9488" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#0D9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Area type="monotone" dataKey="inbound" name="Inbound (Mbps)" stroke="#2563EB" strokeWidth={2} fillOpacity={1} fill="url(#colorInbound)" />
                  <Area type="monotone" dataKey="outbound" name="Outbound (Mbps)" stroke="#0D9488" strokeWidth={2} fillOpacity={1} fill="url(#colorOutbound)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* LATENCY CHART */}
          <div className="bg-white p-6 rounded-xl shadow-card border border-gray-100">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-semibold text-gray-900">Average Latency & Packet Loss</h2>
            </div>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                  <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={-10} />
                  <YAxis yAxisId="right" orientation="right" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dx={10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} iconType="circle" />
                  <Line yAxisId="left" type="monotone" dataKey="latency" name="Latency (ms)" stroke="#9333EA" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
                  <Line yAxisId="right" type="step" dataKey="packetLoss" name="Packet Loss (%)" stroke="#DC2626" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI PREDICTIVE ANOMALIES */}
        <div className="bg-white rounded-xl shadow-card border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BrainCircuit className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Predictive Anomalies</h2>
            </div>
            <span className="bg-indigo-50 text-indigo-700 text-xs font-semibold px-3 py-1 rounded-full border border-indigo-100">
              Machine Learning Engine Active
            </span>
          </div>
          <div className="divide-y divide-gray-100">
            {anomalies.map((anomaly) => (
              <div key={anomaly.id} className="p-6 hover:bg-gray-50 transition-colors flex items-start gap-4">
                <div className="bg-orange-100 p-2 rounded-lg text-orange-600 mt-1">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="text-gray-900 font-semibold">{anomaly.type} — {anomaly.node}</h3>
                    <span className="text-sm text-gray-500">{anomaly.time}</span>
                  </div>
                  <p className="text-gray-600 mt-1 text-sm">{anomaly.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">{anomaly.probability}%</div>
                  <div className="text-xs text-gray-500 font-medium uppercase tracking-wide mt-1">Probability</div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </AppLayout>
  );
};
export default AnalyticsPage;
