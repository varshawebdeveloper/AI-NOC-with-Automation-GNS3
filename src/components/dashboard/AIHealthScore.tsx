import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';
import { Card, CardHeader } from '../common/Card';
import { cn } from '../../utils';
import { getTrafficData, type TrafficData } from '../../services/api';

export const AIHealthScore: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);

  // Load traffic data from FastAPI backend
  useEffect(() => {
    const loadTrafficData = async () => {
      try {
        const data = await getTrafficData();

        console.log('AI-NOC Traffic Data:', data);

        setTrafficData(data);
      } catch (error) {
        console.error('Failed to load traffic data:', error);
      }
    };

    loadTrafficData();
  }, []);

  // --------------------------------------------------
  // AI HEALTH SCORE
  // --------------------------------------------------

  const score = trafficData
    ? Math.max(0, Math.min(100, 100 - trafficData.risk))
    : 0;

  // --------------------------------------------------
  // HEALTH LABEL
  // --------------------------------------------------

  const getLabel = (s: number) => {
    if (s >= 90) {
      return {
        text: 'Excellent',
        color: 'text-teal-600',
      };
    }

    if (s >= 75) {
      return {
        text: 'Good',
        color: 'text-success-600',
      };
    }

    if (s >= 50) {
      return {
        text: 'Fair',
        color: 'text-warning-600',
      };
    }

    return {
      text: 'Critical',
      color: 'text-critical-600',
    };
  };

  const label = getLabel(score);

  // --------------------------------------------------
  // LIVE SUB-SCORES
  // --------------------------------------------------

  const connectivity =
    trafficData && trafficData.total_packets > 0
      ? 100
      : 0;

  const security = trafficData
    ? Math.max(0, 100 - trafficData.risk)
    : 0;

  const trafficStability =
    trafficData?.threat === 'LOW'
      ? 100
      : trafficData?.threat === 'MEDIUM'
        ? 70
        : trafficData?.threat === 'HIGH'
          ? 40
          : trafficData?.threat === 'CRITICAL'
            ? 20
            : 0;

  // --------------------------------------------------
  // SVG GAUGE
  // --------------------------------------------------

  const radius = 54;
  const strokeWidth = 10;
  const cx = 80;

  const circumference = Math.PI * radius;
  const filled = (score / 100) * circumference;
  const empty = circumference - filled;

  // Avoid template-string parsing issue
  const strokeDashArray =
    filled + ' ' + (empty + circumference);

  // --------------------------------------------------
  // MAIN UI
  // --------------------------------------------------

  return (
    <Card padding="md">

      {/* HEADER */}

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

        {/* ==========================================
            GAUGE
        ========================================== */}

        <svg
          width={160}
          height={100}
          viewBox="0 0 160 100"
        >

          {/* Background Arc */}

          <path
            d="M 16 90 A 64 64 0 0 1 144 90"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Filled Arc */}

          <circle
            cx={cx}
            cy={cx}
            r={radius}
            fill="none"
            stroke="url(#gaugeGrad)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDashArray}
            strokeDashoffset={circumference / 2}
            transform={`rotate(-180 ${cx} ${cx})`}
          />

          {/* Gauge Gradient */}

          <defs>
            <linearGradient
              id="gaugeGrad"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop
                offset="0%"
                stopColor="#2563eb"
              />

              <stop
                offset="100%"
                stopColor="#0d9488"
              />
            </linearGradient>
          </defs>

        </svg>

        {/* ==========================================
            SCORE DISPLAY
        ========================================== */}

        <div className="-mt-8 text-center">

          <span
            className={cn(
              'text-4xl font-bold',
              label.color
            )}
          >
            {trafficData ? score : '--'}
          </span>

          <span className="text-lg font-semibold text-text-muted">
            /100
          </span>

          <p
            className={cn(
              'text-sm font-semibold mt-1',
              label.color
            )}
          >
            {trafficData
              ? label.text
              : 'Loading...'}
          </p>

        </div>

        {/* ==========================================
            THREAT LEVEL
        ========================================== */}

        {trafficData && (
          <div className="w-full mt-4 text-center">

            <div className="text-xs text-text-muted">
              Current Threat Level
            </div>

            <div
              className={cn(
                'text-lg font-bold mt-1',
                trafficData.threat === 'LOW'
                  ? 'text-teal-600'
                  : trafficData.threat === 'MEDIUM'
                    ? 'text-warning-600'
                    : trafficData.threat === 'HIGH'
                      ? 'text-orange-600'
                      : 'text-critical-600'
              )}
            >
              {trafficData.threat}
            </div>

          </div>
        )}

        {/* ==========================================
            AI THREAT DETECTION
        ========================================== */}

        {trafficData?.threats &&
          trafficData.threats.length > 0 && (

            <div className="w-full mt-4 p-3 rounded-lg bg-red-50 border border-red-200">

              <div className="flex items-center justify-between">

                <span className="text-sm font-semibold text-red-700">
                  ⚠ AI Threat Detected
                </span>

                <span className="text-xs font-bold text-red-600">
                  {trafficData.threats[0].severity}
                </span>

              </div>

              <p className="text-sm font-bold text-text-primary mt-1">
                {trafficData.threats[0].type}
              </p>

              <p className="text-xs text-text-muted mt-1">
                {trafficData.threats[0].description}
              </p>

            </div>
          )}

        {/* ==========================================
            NO THREAT
        ========================================== */}

        {trafficData &&
          trafficData.threats &&
          trafficData.threats.length === 0 && (

            <div className="w-full mt-4 p-3 rounded-lg bg-teal-50 border border-teal-200">

              <p className="text-sm font-semibold text-teal-700 text-center">
                ✓ No threats detected
              </p>

              <p className="text-xs text-teal-600 text-center mt-1">
                Network traffic is within normal limits.
              </p>

            </div>
          )}

        {/* ==========================================
            LIVE SUB-SCORES
        ========================================== */}

        <div className="grid grid-cols-3 gap-3 w-full mt-4">

          {/* Connectivity */}

          <div className="text-center">

            <div className="text-sm font-bold text-text-primary">
              {connectivity}%
            </div>

            <div className="text-[10px] text-text-muted mt-0.5">
              Connectivity
            </div>

          </div>

          {/* Security */}

          <div className="text-center">

            <div className="text-sm font-bold text-text-primary">
              {security}%
            </div>

            <div className="text-[10px] text-text-muted mt-0.5">
              Security
            </div>

          </div>

          {/* Traffic Stability */}

          <div className="text-center">

            <div className="text-sm font-bold text-text-primary">
              {trafficStability}%
            </div>

            <div className="text-[10px] text-text-muted mt-0.5">
              Traffic Stability
            </div>

          </div>

        </div>

        {/* ==========================================
            TRAFFIC SUMMARY
        ========================================== */}

        {trafficData && (

          <div className="grid grid-cols-2 gap-3 w-full mt-4">

            {/* Total Packets */}

            <div className="p-2 rounded-lg bg-slate-50 text-center">

              <div className="text-sm font-bold text-text-primary">
                {trafficData.total_packets}
              </div>

              <div className="text-[10px] text-text-muted">
                Total Packets
              </div>

            </div>

            {/* Total Bytes */}

            <div className="p-2 rounded-lg bg-slate-50 text-center">

              <div className="text-sm font-bold text-text-primary">
                {trafficData.total_bytes}
              </div>

              <div className="text-[10px] text-text-muted">
                Total Bytes
              </div>

            </div>

            {/* ICMP */}

            <div className="p-2 rounded-lg bg-slate-50 text-center">

              <div className="text-sm font-bold text-text-primary">
                {trafficData.icmp}
              </div>

              <div className="text-[10px] text-text-muted">
                ICMP
              </div>

            </div>

            {/* OSPF */}

            <div className="p-2 rounded-lg bg-slate-50 text-center">

              <div className="text-sm font-bold text-text-primary">
                {trafficData.ospf}
              </div>

              <div className="text-[10px] text-text-muted">
                OSPF
              </div>

            </div>

          </div>
        )}

      </div>

    </Card>
  );
};