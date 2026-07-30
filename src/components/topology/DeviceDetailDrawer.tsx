import React from 'react';
import { X, Router, Network, Shield, Server, Monitor, MapPin, Tag } from 'lucide-react';
import { StatusBadge } from '../common/Badge';
import { ProgressBar } from '../common/ProgressBar';
import { cn } from '../../utils';
import { getDeviceTypeLabel } from '../../utils';
import type { TopologyNode } from '../../types';

interface DeviceDetailDrawerProps {
  node: TopologyNode | null;
  onClose: () => void;
}

const typeIcons = {
  router:   <Router   className="h-5 w-5" />,
  switch:   <Network  className="h-5 w-5" />,
  firewall: <Shield   className="h-5 w-5" />,
  server:   <Server   className="h-5 w-5" />,
  pc:       <Monitor  className="h-5 w-5" />,
};

const typeColors = {
  router:   'from-primary-600 to-primary-700',
  switch:   'from-teal-600 to-teal-700',
  firewall: 'from-warning-500 to-warning-600',
  server:   'from-success-600 to-success-700',
  pc:       'from-slate-500 to-slate-600',
};

export const DeviceDetailDrawer: React.FC<DeviceDetailDrawerProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/10"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-80 bg-white border-l border-border shadow-card-lg z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className={cn('px-5 py-4 bg-gradient-to-r text-white flex-shrink-0', typeColors[node.type])}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                {typeIcons[node.type]}
              </div>
              <div>
                <h2 className="font-bold text-sm leading-tight">{node.label}</h2>
                <p className="text-white/70 text-xs mt-0.5">{getDeviceTypeLabel(node.type)}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-3">
            <StatusBadge status={node.status} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto scrollbar-thin p-5 space-y-5">
          {/* Network Info */}
          <section>
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              Network Info
            </h3>
            <div className="space-y-2.5">
              <InfoRow icon={<Tag className="h-3.5 w-3.5" />} label="IP Address" value={node.ipAddress} />
              <InfoRow icon={<MapPin className="h-3.5 w-3.5" />} label="Location" value={node.location} />
              {node.vendor && <InfoRow label="Vendor" value={node.vendor} />}
              {node.model && <InfoRow label="Model" value={node.model} />}
            </div>
          </section>

          {/* Performance */}
          {node.status !== 'offline' && (
            <section>
              <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
                Performance
              </h3>
              <div className="space-y-3">
                <ProgressBar
                  label="CPU"
                  value={node.cpu}
                  showValue
                  size="md"
                  variant="auto"
                />
                <ProgressBar
                  label="RAM"
                  value={node.ram}
                  showValue
                  size="md"
                  variant="auto"
                />
              </div>
            </section>
          )}

          {node.status === 'offline' && (
            <div className="p-3 bg-critical-50 border border-critical-100 rounded-lg">
              <p className="text-xs text-critical-600 font-medium">Device is offline</p>
              <p className="text-[10px] text-critical-600/70 mt-0.5">No performance data available</p>
            </div>
          )}

          {/* GNS3 Placeholder */}
          <section className="pt-2 border-t border-border">
            <h3 className="text-[11px] font-semibold text-text-muted uppercase tracking-wider mb-3">
              GNS3 Integration
            </h3>
            <div className="p-3 bg-surface-secondary border border-border rounded-lg">
              <p className="text-[10px] text-text-muted">
                Node ID: <code className="font-mono text-text-secondary">{node.id}</code>
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                Status: <span className="text-warning-600 font-medium">Pending GNS3 connection</span>
              </p>
              <p className="text-[10px] text-text-muted mt-1">
                GNS3 REST API: <code className="font-mono">GET /v2/projects/&#123;id&#125;/nodes</code>
              </p>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-border flex gap-2 flex-shrink-0">
          <button className="flex-1 py-2 text-xs font-medium text-primary-600 border border-primary-200 rounded-lg hover:bg-primary-50 transition-colors">
            View Details
          </button>
          <button className="flex-1 py-2 text-xs font-medium text-text-secondary border border-border rounded-lg hover:bg-surface-secondary transition-colors">
            Ping Device
          </button>
        </div>
      </div>
    </>
  );
};

const InfoRow: React.FC<{
  icon?: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex items-start gap-2">
    {icon && <span className="text-text-muted mt-0.5 flex-shrink-0">{icon}</span>}
    <div className="flex-1 min-w-0">
      <p className="text-[10px] text-text-muted">{label}</p>
      <p className="text-xs font-medium text-text-primary truncate">{value}</p>
    </div>
  </div>
);
