import React from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { KpiCards } from '../../components/dashboard/KpiCards';
import { TrafficChart } from '../../components/dashboard/TrafficChart';
import { DeviceDistributionChart } from '../../components/dashboard/DeviceDistributionChart';
import { RecentAlerts } from '../../components/dashboard/RecentAlerts';
import { AIHealthScore } from '../../components/dashboard/AIHealthScore';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';
import { useGNS3 } from '../../context/GNS3Context';

const DashboardPage: React.FC = () => {
  const { alerts, activityFeed, deviceDistribution, connected, lastUpdated } = useGNS3();

  return (
    <AppLayout breadcrumbs={[{ label: 'Overview' }]}>
      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Real-time network overview ·{' '}
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : 'Connecting to GNS3...'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`h-2 w-2 rounded-full ${connected ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`} />
            <span className="text-sm font-medium">
              {connected ? 'GNS3 Live' : 'GNS3 Offline'}
            </span>
          </div>
        </div>

        {/* KPI Cards — FastAPI PCAP data */}
        <KpiCards />

        {/* Main content area */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Left column – charts and alerts */}
          <div className="space-y-6 xl:col-span-2">
            <TrafficChart />
            {/* RecentAlerts: use live GNS3 alerts when available, fallback to empty */}
            <RecentAlerts alerts={alerts} maxRows={6} />
          </div>

          {/* Right column – widgets */}
          <div className="space-y-6">
            {/* AIHealthScore — FastAPI risk score */}
            <AIHealthScore />
            {/* DeviceDistributionChart — live GNS3 device types */}
            <DeviceDistributionChart data={deviceDistribution} />
            {/* QuickActions — connected to FastAPI + GNS3 */}
            <QuickActions />
            {/* ActivityFeed — live GNS3 state change events */}
            <ActivityFeed items={activityFeed} />
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;