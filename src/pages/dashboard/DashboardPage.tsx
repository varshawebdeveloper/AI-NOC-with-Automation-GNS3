import React from 'react';
import { AppLayout } from '../../layouts/AppLayout';
import { KpiCards } from '../../components/dashboard/KpiCards';
import { TrafficChart } from '../../components/dashboard/TrafficChart';
import { DeviceDistributionChart } from '../../components/dashboard/DeviceDistributionChart';
import { RecentAlerts } from '../../components/dashboard/RecentAlerts';
import { AIHealthScore } from '../../components/dashboard/AIHealthScore';
import { QuickActions } from '../../components/dashboard/QuickActions';
import { ActivityFeed } from '../../components/dashboard/ActivityFeed';

import {
  kpiData,
  trafficData,
  deviceDistribution,
  recentAlerts,
  activityFeed,
} from '../../data/dashboardData';

const DashboardPage: React.FC = () => {
  return (
    <AppLayout breadcrumbs={[{ label: 'Overview' }]}>
      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-gray-500">
              Real-time network overview · Last updated just now
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-green-500"></span>
            <span className="text-sm font-medium">Live</span>
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCards data={kpiData} />

        {/* Main content area */}
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

          {/* Left column – charts and alerts */}
          <div className="space-y-6 xl:col-span-2">
            <TrafficChart data={trafficData} />
            <RecentAlerts alerts={recentAlerts} maxRows={6} />
          </div>

          {/* Right column – widgets */}
          <div className="space-y-6">
            <AIHealthScore score={kpiData.networkHealthScore} />
            <DeviceDistributionChart data={deviceDistribution} />
            <QuickActions />
            <ActivityFeed items={activityFeed} />
          </div>

        </div>
      </div>
    </AppLayout>
  );
};

export default DashboardPage;