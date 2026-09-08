import React from 'react';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import { cn } from '../../utils';

interface GNS3StatusBadgeProps {
  connected: boolean;
  loading?: boolean;
  projectName?: string;
  onRefresh?: () => void;
}

export const GNS3StatusBadge: React.FC<GNS3StatusBadgeProps> = ({
  connected,
  loading = false,
  projectName,
  onRefresh,
}) => (
  <div className={cn(
    'flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-medium',
    connected
      ? 'bg-success-50 border-success-100 text-success-600'
      : 'bg-critical-50 border-critical-100 text-critical-600'
  )}>
    {loading ? (
      <RefreshCw className="h-3 w-3 animate-spin" />
    ) : connected ? (
      <Wifi className="h-3 w-3" />
    ) : (
      <WifiOff className="h-3 w-3" />
    )}
    <span>
      {loading
        ? 'Connecting...'
        : connected
        ? `GNS3${projectName ? ` · ${projectName}` : ' · Connected'}`
        : 'GNS3 Offline — Demo Data'}
    </span>
    {onRefresh && !loading && (
      <button
        onClick={onRefresh}
        className="ml-1 opacity-60 hover:opacity-100 transition-opacity"
        title="Refresh topology"
      >
        <RefreshCw className="h-3 w-3" />
      </button>
    )}
  </div>
);
