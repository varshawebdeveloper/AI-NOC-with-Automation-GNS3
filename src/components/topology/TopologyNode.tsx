import React, { memo } from 'react';
import { Handle, Position, type NodeProps } from 'reactflow';
import {
  Router,
  Network,
  Shield,
  Server,
  Monitor,
} from 'lucide-react';
import { cn } from '../../utils';
import type { DeviceType, DeviceStatus } from '../../types';

export interface TopologyNodeData {
  label: string;
  type: DeviceType;
  status: DeviceStatus;
  ipAddress: string;
  cpu: number;
  ram: number;
}

type DeviceColorConfig = { bg: string; icon: string; border: string };

const deviceIcons: Record<DeviceType, React.ReactNode> = {
  router:   <Router   className="h-4 w-4" />,
  switch:   <Network  className="h-4 w-4" />,
  firewall: <Shield   className="h-4 w-4" />,
  server:   <Server   className="h-4 w-4" />,
  pc:       <Monitor  className="h-4 w-4" />,
};

const deviceColors: Record<DeviceType, DeviceColorConfig> = {
  router:   { bg: 'bg-primary-50',        icon: 'text-primary-600', border: 'border-primary-200' },
  switch:   { bg: 'bg-teal-50',           icon: 'text-teal-600',    border: 'border-teal-200' },
  firewall: { bg: 'bg-warning-50',        icon: 'text-warning-600', border: 'border-warning-200' },
  server:   { bg: 'bg-success-50',        icon: 'text-success-600', border: 'border-success-100' },
  pc:       { bg: 'bg-surface-tertiary',  icon: 'text-text-secondary', border: 'border-border' },
};

const statusDotColor: Record<DeviceStatus, string> = {
  online:  'bg-success-600',
  offline: 'bg-critical-600',
  warning: 'bg-warning-500',
  unknown: 'bg-text-muted',
};

const TopologyNodeComponent: React.FC<NodeProps<TopologyNodeData>> = ({ data, selected }) => {
  const nodeType = (data.type || 'pc') as DeviceType;
  const colors = deviceColors[nodeType] ?? deviceColors.pc;
  const dotColor = statusDotColor[data.status] ?? 'bg-text-muted';
  const icon = deviceIcons[nodeType] ?? deviceIcons.pc;

  return (
    <div
      className={cn(
        'flex flex-col items-center cursor-pointer select-none',
        'transition-transform duration-150',
        selected && 'scale-110'
      )}
    >
      {/* Node icon box */}
      <div
        className={cn(
          'w-12 h-12 rounded-xl border-2 flex items-center justify-center shadow-card',
          'transition-all duration-150',
          colors.bg,
          selected ? 'border-primary-500 shadow-card-md ring-2 ring-primary-300' : colors.border,
          data.status === 'offline' && 'opacity-50'
        )}
      >
        <span className={colors.icon}>{icon}</span>
      </div>

      {/* Status dot */}
      <div className={cn(
        'w-2.5 h-2.5 rounded-full border-2 border-white shadow-sm -mt-1.5 z-10',
        dotColor
      )} />

      {/* Label */}
      <div className="mt-1.5 text-center max-w-[90px]">
        <p className="text-[10px] font-semibold text-text-primary leading-tight truncate">{data.label}</p>
        <p className="text-[9px] text-text-muted leading-tight">{data.ipAddress}</p>
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top}    style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', width: 8, height: 8 }} />
      <Handle type="target" position={Position.Left}   style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', width: 8, height: 8 }} />
      <Handle type="source" position={Position.Right}  style={{ background: '#e2e8f0', border: '1px solid #cbd5e1', width: 8, height: 8 }} />
    </div>
  );
};

export const TopologyNode = memo(TopologyNodeComponent);
export const nodeTypes = {
  default: TopologyNode,
};
