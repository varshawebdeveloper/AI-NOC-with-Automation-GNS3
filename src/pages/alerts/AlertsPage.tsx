import React, { useEffect, useState } from 'react';
import {
  AlertTriangle,
  ShieldAlert,
  Activity,
  Clock,
  RefreshCw,
  CheckCircle,
} from 'lucide-react';

import { AppLayout } from '../../layouts/AppLayout';
import alertService, {
  type Alert,
} from '../../services/alertService';

export const AlertsPage: React.FC = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // --------------------------------------------------
  // FETCH LIVE ALERTS
  // --------------------------------------------------

  const fetchAlerts = async () => {
    try {
      setLoading(true);

      const data = await alertService.getAlerts();

      setAlerts(data);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Failed to load alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------------------------
  // AUTO REFRESH EVERY 10 SECONDS
  // --------------------------------------------------

  useEffect(() => {
    fetchAlerts();

    const interval = setInterval(() => {
      fetchAlerts();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  // --------------------------------------------------
  // KPI DATA
  // --------------------------------------------------

  const activeAlerts = alerts.filter(
    (alert) => alert.status === 'ACTIVE'
  );

  const highRiskAlerts = alerts.filter(
    (alert) =>
      alert.severity === 'HIGH' ||
      alert.severity === 'CRITICAL'
  );

  // --------------------------------------------------
  // SEVERITY STYLES
  // --------------------------------------------------

  const getSeverityClasses = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-50 text-red-600 border-red-200';

      case 'HIGH':
        return 'bg-orange-50 text-orange-600 border-orange-200';

      case 'MEDIUM':
        return 'bg-yellow-50 text-yellow-600 border-yellow-200';

      default:
        return 'bg-green-50 text-green-600 border-green-200';
    }
  };

  // --------------------------------------------------
  // SEVERITY ICON
  // --------------------------------------------------

  const getSeverityIcon = (severity: string) => {
    if (
      severity === 'CRITICAL' ||
      severity === 'HIGH'
    ) {
      return (
        <ShieldAlert className="w-5 h-5" />
      );
    }

    if (severity === 'MEDIUM') {
      return (
        <AlertTriangle className="w-5 h-5" />
      );
    }

    return (
      <CheckCircle className="w-5 h-5" />
    );
  };

  // --------------------------------------------------
  // RISK COLOR
  // --------------------------------------------------

  const getRiskColor = (risk: number) => {
    if (risk >= 70) {
      return 'text-red-600';
    }

    if (risk >= 40) {
      return 'text-orange-600';
    }

    return 'text-green-600';
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <AppLayout>
      <div className="p-6 space-y-6 bg-surface-secondary min-h-screen">

        {/* ==================================================
            HEADER
        ================================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Alert Management
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              AI-powered network threat detection
            </p>
          </div>

          <button
            onClick={fetchAlerts}
            disabled={loading}
            className="
              flex items-center gap-2
              px-4 py-2
              rounded-lg
              bg-white
              hover:bg-gray-50
              border border-gray-200
              text-gray-700
              shadow-sm
              transition
            "
          >
            <RefreshCw
              className={`w-4 h-4 ${
                loading ? 'animate-spin' : ''
              }`}
            />

            Refresh
          </button>

        </div>


        {/* ==================================================
            KPI CARDS
        ================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* ACTIVE ALERTS */}

          <div className="
            rounded-xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Active Alerts
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {activeAlerts.length}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-red-50">
                <AlertTriangle
                  className="w-6 h-6 text-red-500"
                />
              </div>

            </div>

          </div>


          {/* HIGH RISK ALERTS */}

          <div className="
            rounded-xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  High Risk Alerts
                </p>

                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {highRiskAlerts.length}
                </p>
              </div>

              <div className="p-3 rounded-lg bg-orange-50">
                <ShieldAlert
                  className="w-6 h-6 text-orange-500"
                />
              </div>

            </div>

          </div>


          {/* MONITORING STATUS */}

          <div className="
            rounded-xl
            border border-gray-200
            bg-white
            p-5
            shadow-sm
          ">

            <div className="flex items-center justify-between">

              <div>
                <p className="text-sm text-gray-500">
                  Monitoring Status
                </p>

                <p className="text-xl font-bold text-green-500 mt-2">
                  LIVE
                </p>
              </div>

              <div className="p-3 rounded-lg bg-green-50">
                <Activity
                  className="w-6 h-6 text-green-500"
                />
              </div>

            </div>

          </div>

        </div>


        {/* ==================================================
            THREAT LIST
        ================================================== */}

        <div className="
          rounded-xl
          border border-gray-200
          bg-white
          shadow-sm
          overflow-hidden
        ">

          {/* TITLE */}

          <div className="
            px-6 py-4
            border-b border-gray-200
          ">

            <div className="flex items-center justify-between">

              <div>

                <h2 className="text-lg font-semibold text-gray-900">
                  Detected Threats
                </h2>

                <p className="text-xs text-gray-500 mt-1">
                  Real-time network security events
                </p>

              </div>

              {lastUpdated && (
                <div className="
                  flex items-center gap-2
                  text-xs text-gray-500
                ">
                  <Clock className="w-4 h-4" />

                  Updated{' '}
                  {lastUpdated.toLocaleTimeString()}
                </div>
              )}

            </div>

          </div>


          {/* ==================================================
              LOADING
          ================================================== */}

          {loading && alerts.length === 0 && (
            <div className="
              p-10
              text-center
              text-gray-500
            ">

              <RefreshCw
                className="w-6 h-6 animate-spin mx-auto mb-3"
              />

              Loading threat data...

            </div>
          )}


          {/* ==================================================
              NO THREATS
          ================================================== */}

          {!loading && alerts.length === 0 && (
            <div className="
              p-10
              text-center
            ">

              <CheckCircle
                className="
                  w-10 h-10
                  text-green-500
                  mx-auto mb-3
                "
              />

              <p className="text-gray-900 font-medium">
                No threats detected
              </p>

              <p className="text-sm text-gray-500 mt-1">
                The network is currently operating normally.
              </p>

            </div>
          )}


          {/* ==================================================
              THREATS
          ================================================== */}

          {alerts.length > 0 && (
            <div className="divide-y divide-gray-200">

              {alerts.map((alert) => (

                <div
                  key={alert.id}
                  className="
                    p-6
                    hover:bg-gray-50
                    transition
                  "
                >

                  <div className="
                    flex flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                  ">

                    {/* THREAT INFORMATION */}

                    <div className="flex items-start gap-4">

                      <div
                        className={`
                          p-3
                          rounded-lg
                          border
                          ${getSeverityClasses(
                            alert.severity
                          )}
                        `}
                      >
                        {getSeverityIcon(
                          alert.severity
                        )}
                      </div>


                      <div>

                        {/* TITLE + BADGES */}

                        <div className="
                          flex flex-wrap
                          items-center
                          gap-3
                        ">

                          <h3 className="
                            text-lg
                            font-semibold
                            text-gray-900
                          ">
                            {alert.threat}
                          </h3>

                          <span
                            className={`
                              px-2.5 py-1
                              rounded-full
                              text-xs
                              font-semibold
                              border
                              ${getSeverityClasses(
                                alert.severity
                              )}
                            `}
                          >
                            {alert.severity}
                          </span>

                          <span className="
                            px-2.5 py-1
                            rounded-full
                            text-xs
                            font-medium
                            bg-gray-100
                            text-gray-600
                          ">
                            {alert.status}
                          </span>

                        </div>


                        {/* DESCRIPTION */}

                        {alert.description && (
                          <p className="
                            text-sm
                            text-gray-600
                            mt-3
                          ">
                            {alert.description}
                          </p>
                        )}


                        <div className="mt-3">

                          <p className="
                            text-sm
                            text-gray-500
                          ">
                            Detected by AI threat analysis
                          </p>

                        </div>

                      </div>

                    </div>


                    {/* ==================================================
                        RISK SCORE
                    ================================================== */}

                    <div className="min-w-[180px]">

                      <div className="
                        flex items-center
                        justify-between
                        mb-2
                      ">

                        <span className="
                          text-xs
                          text-gray-500
                        ">
                          Risk Score
                        </span>

                        <span
                          className={`
                            text-lg
                            font-bold
                            ${getRiskColor(
                              alert.risk_score
                            )}
                          `}
                        >
                          {alert.risk_score}
                        </span>

                      </div>


                      {/* RISK BAR */}

                      <div className="
                        w-full
                        h-2
                        rounded-full
                        bg-gray-200
                        overflow-hidden
                      ">

                        <div
                          className="
                            h-full
                            rounded-full
                            bg-orange-500
                            transition-all
                          "
                          style={{
                            width: `${Math.min(
                              alert.risk_score,
                              100
                            )}%`,
                          }}
                        />

                      </div>

                    </div>

                  </div>

                </div>

              ))}

            </div>
          )}

        </div>

      </div>
    </AppLayout>
  );
};

export default AlertsPage;