import React, { useEffect, useState } from 'react';
import {
  Activity,
  Network,
  Package,
  Radio,
  ShieldAlert,
  ShieldCheck,
} from 'lucide-react';

import { Card } from '../common/Card';
import { cn } from '../../utils';
import { getTrafficData, type TrafficData } from '../../services/api';

interface KpiCard {
  id: string;
  label: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  iconBg: string;
  iconColor: string;
  valueColor?: string;
}

export const KpiCards: React.FC = () => {
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchTrafficData = async () => {
      try {
        setLoading(true);
        setError(false);

        const data = await getTrafficData();

        console.log('FastAPI Traffic Data:', data);

        if (isMounted) {
          setTrafficData(data);
        }
      } catch (err) {
        console.error('Failed to fetch traffic data:', err);

        if (isMounted) {
          setError(true);
          setTrafficData(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTrafficData();

    return () => {
      isMounted = false;
    };
  }, []);

  const getThreatStyles = () => {
    if (loading) {
      return {
        iconBg: 'bg-surface-tertiary',
        iconColor: 'text-text-secondary',
        valueColor: 'text-text-primary',
      };
    }

    const threat = trafficData?.threat_analysis?.severity?.toUpperCase();

    if (threat === 'LOW') {
      return {
        iconBg: 'bg-success-100',
        iconColor: 'text-success-600',
        valueColor: 'text-success-600',
      };
    }

    if (threat === 'MEDIUM') {
      return {
        iconBg: 'bg-warning-100',
        iconColor: 'text-warning-600',
        valueColor: 'text-warning-600',
      };
    }

    if (threat === 'HIGH') {
      return {
        iconBg: 'bg-critical-100',
        iconColor: 'text-critical-600',
        valueColor: 'text-critical-600',
      };
    }

    return {
      iconBg: 'bg-surface-tertiary',
      iconColor: 'text-text-secondary',
      valueColor: 'text-text-primary',
    };
  };

  const threatStyles = getThreatStyles();

  const cards: KpiCard[] = [
    {
      id: 'total-packets',
      label: 'Total Packets',
      value: loading ? '...' : trafficData?.total_packets ?? 0,
      subtitle: error
        ? 'Unable to fetch traffic data'
        : 'Packets captured from PCAP',
      icon: <Package className="h-5 w-5" />,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-600',
    },

    {
      id: 'total-bytes',
      label: 'Total Bytes',
      value: loading ? '...' : trafficData?.total_bytes ?? 0,
      subtitle: error
        ? 'Unable to fetch traffic data'
        : 'Total network traffic',
      icon: <Network className="h-5 w-5" />,
      iconBg: 'bg-teal-100',
      iconColor: 'text-teal-600',
      valueColor: 'text-teal-600',
    },

    {
      id: 'icmp',
      label: 'ICMP Packets',
      value: loading ? '...' : trafficData?.icmp ?? 0,
      subtitle: 'ICMP traffic detected',
      icon: <Radio className="h-5 w-5" />,
      iconBg: 'bg-success-100',
      iconColor: 'text-success-600',
      valueColor: 'text-success-600',
    },

    {
      id: 'ospf',
      label: 'OSPF Packets',
      value: loading ? '...' : trafficData?.ospf ?? 0,
      subtitle: 'OSPF routing traffic',
      icon: <Activity className="h-5 w-5" />,
      iconBg: 'bg-primary-100',
      iconColor: 'text-primary-600',
      valueColor: 'text-primary-600',
    },

    {
      id: 'risk-score',
      label: 'Risk Score',
      value: loading ? '...' : trafficData?.threat_analysis?.risk_score ?? 0,
      subtitle: error
        ? 'Unable to calculate risk'
        : trafficData?.threat_analysis?.risk_score === 0
          ? 'Network risk is low'
          : (trafficData?.threat_analysis?.risk_score ?? 0) < 40
            ? 'Low network risk'
            : (trafficData?.threat_analysis?.risk_score ?? 0) < 70
              ? 'Medium network risk'
              : 'High network risk',
      icon: <ShieldAlert className="h-5 w-5" />,
      iconBg:
        trafficData?.threat_analysis?.risk_score !== undefined && trafficData.threat_analysis.risk_score >= 70
          ? 'bg-critical-100'
          : trafficData?.threat_analysis?.risk_score !== undefined && trafficData.threat_analysis.risk_score >= 40
            ? 'bg-warning-100'
            : 'bg-success-100',
      iconColor:
        trafficData?.threat_analysis?.risk_score !== undefined && trafficData.threat_analysis.risk_score >= 70
          ? 'text-critical-600'
          : trafficData?.threat_analysis?.risk_score !== undefined && trafficData.threat_analysis.risk_score >= 40
            ? 'text-warning-600'
            : 'text-success-600',
      valueColor:
        trafficData?.threat_analysis?.risk_score !== undefined && trafficData.threat_analysis.risk_score >= 70
          ? 'text-critical-600'
          : trafficData?.threat_analysis?.risk_score !== undefined && trafficData.threat_analysis.risk_score >= 40
            ? 'text-warning-600'
            : 'text-success-600',
    },

    {
      id: 'threat',
      label: 'Threat Level',
      value: loading ? '...' : (trafficData?.threat_analysis?.severity?.toUpperCase() ?? 'UNKNOWN'),
      subtitle: error
        ? 'Unable to fetch traffic data'
        : 'Current network threat status',
      icon: <ShieldCheck className="h-5 w-5" />,
      iconBg: threatStyles.iconBg,
      iconColor: threatStyles.iconColor,
      valueColor: threatStyles.valueColor,
    },

    {
      id: 'tcp',
      label: 'TCP Packets',
      value: loading ? '...' : trafficData?.tcp ?? 0,
      subtitle: 'TCP traffic detected',
      icon: <Network className="h-5 w-5" />,
      iconBg: 'bg-surface-tertiary',
      iconColor: 'text-text-secondary',
      valueColor: 'text-text-primary',
    },

    {
      id: 'udp',
      label: 'UDP Packets',
      value: loading ? '...' : trafficData?.udp ?? 0,
      subtitle: 'UDP traffic detected',
      icon: <Radio className="h-5 w-5" />,
      iconBg: 'bg-surface-tertiary',
      iconColor: 'text-text-secondary',
      valueColor: 'text-text-primary',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          className="relative overflow-hidden group hover:shadow-card-md transition-shadow duration-200"
        >
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-text-muted font-medium">
                {card.label}
              </p>

              <p
                className={cn(
                  'text-2xl font-bold mt-1',
                  card.valueColor ?? 'text-text-primary'
                )}
              >
                {card.value}
              </p>
            </div>

            <div
              className={cn(
                'p-2.5 rounded-xl flex-shrink-0',
                card.iconBg
              )}
            >
              <span className={card.iconColor}>
                {card.icon}
              </span>
            </div>
          </div>

          <p className="text-xs text-text-muted">
            {card.subtitle}
          </p>
        </Card>
      ))}
    </div>
  );
};