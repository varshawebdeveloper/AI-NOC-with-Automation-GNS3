import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { ToastProvider } from '../components/common/Toast';
import { ProtectedRoute } from './ProtectedRoute';
import { LoadingOverlay } from '../components/common/Spinner';
import { ROUTES } from '../constants/theme';
import { PlaceholderPage } from '../pages/PlaceholderPage';

// Lazy loaded pages
const LoginPage           = lazy(() => import('../pages/auth/LoginPage'));
const ForgotPasswordPage  = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const SessionReadyPage    = lazy(() => import('../pages/auth/SessionReadyPage'));
const DashboardPage       = lazy(() => import('../pages/dashboard/DashboardPage'));
const TopologyPage        = lazy(() => import('../pages/topology/TopologyPage'));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
    <LoadingOverlay />
  </div>
);

export const AppRoutes: React.FC = () => (
  <BrowserRouter>
    <AuthProvider>
      <ToastProvider>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            {/* Auth routes */}
            <Route path={ROUTES.LOGIN}           element={<LoginPage />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />
            <Route
              path={ROUTES.SESSION_READY}
              element={
                <ProtectedRoute>
                  <SessionReadyPage />
                </ProtectedRoute>
              }
            />

            {/* Protected app routes */}
            <Route
              path={ROUTES.DASHBOARD}
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.TOPOLOGY}
              element={
                <ProtectedRoute>
                  <TopologyPage />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ALERTS}
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Alert Management"
                    description="Full alert management with filtering, acknowledgment, and escalation rules. Coming in Phase 2."
                    breadcrumbs={[{ label: 'Alerts' }]}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.DEVICES}
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Device Inventory"
                    description="Complete device inventory with real-time stats, configuration, and management. Coming in Phase 2."
                    breadcrumbs={[{ label: 'Devices' }]}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.ANALYTICS}
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Analytics"
                    description="Advanced analytics with historical data, trends, and AI predictions. Coming in Phase 2."
                    breadcrumbs={[{ label: 'Analytics' }]}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.REPORTS}
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Reports"
                    description="Automated report generation and scheduling. Coming in Phase 2."
                    breadcrumbs={[{ label: 'Reports' }]}
                  />
                </ProtectedRoute>
              }
            />
            <Route
              path={ROUTES.SETTINGS}
              element={
                <ProtectedRoute>
                  <PlaceholderPage
                    title="Settings"
                    description="User preferences, notification settings, and integrations. Coming in Phase 2."
                    breadcrumbs={[{ label: 'Settings' }]}
                  />
                </ProtectedRoute>
              }
            />

            {/* Redirects */}
            <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
            <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          </Routes>
        </Suspense>
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRoutes;