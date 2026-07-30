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
      <div className="p-6 space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-text-primary">Dashboard</h1>
            <p className="text-xs text-text-muted mt-0.5">
              Real-time network overview · Last updated just now
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-success-50 border border-success-100 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-success-600 animate-pulse-slow" />
              <span className="text-xs font-medium text-success-600">Live</span>
            </div>
          </div>
        </div>

        {/* KPI Cards */}
        <KpiCards data={kpiData} />

        {/* Main content area */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left column – charts and alerts */}
          <div className="xl:col-span-2 space-y-6">
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
