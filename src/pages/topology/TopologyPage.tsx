import React, { useState, useCallback, useMemo } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { AppLayout } from '../../layouts/AppLayout';
import { nodeTypes } from '../../components/topology/TopologyNode';
import type { TopologyNodeData } from '../../components/topology/TopologyNode';
import { DeviceDetailDrawer } from '../../components/topology/DeviceDetailDrawer';
import { SearchBar } from '../../components/common/SearchBar';
import { topologyNodes, topologyEdges } from '../../data/topologyData';
import type { TopologyNode as TopologyNodeType, DeviceType, DeviceStatus } from '../../types';
import { cn } from '../../utils';
import { Network, Filter } from 'lucide-react';

// Convert data to React Flow format
const toRFNodes = (nodes: TopologyNodeType[]): Node<TopologyNodeData>[] =>
  nodes.map((n) => ({
    id: n.id,
    type: 'default',
    position: n.position,
    data: {
      label: n.label,
      type: n.type,
      status: n.status,
      ipAddress: n.ipAddress,
      cpu: n.cpu,
      ram: n.ram,
    },
    draggable: true,
  }));

const toRFEdges = (edges: typeof topologyEdges): Edge[] =>
  edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
    label: e.bandwidth,
    style: { stroke: '#cbd5e1', strokeWidth: 1.5 },
    labelStyle: { fontSize: 9, fill: '#94a3b8' },
    labelBgStyle: { fill: '#f8fafc' },
    animated: false,
  }));

const DEVICE_TYPE_FILTERS: { type: DeviceType | 'all'; label: string }[] = [
  { type: 'all',      label: 'All' },
  { type: 'router',   label: 'Routers' },
  { type: 'switch',   label: 'Switches' },
  { type: 'firewall', label: 'Firewalls' },
  { type: 'server',   label: 'Servers' },
  { type: 'pc',       label: 'PCs' },
];

const STATUS_FILTERS: { status: DeviceStatus | 'all'; label: string; dot: string }[] = [
  { status: 'all',     label: 'All Status',  dot: 'bg-text-muted' },
  { status: 'online',  label: 'Online',      dot: 'bg-success-600' },
  { status: 'warning', label: 'Warning',     dot: 'bg-warning-500' },
  { status: 'offline', label: 'Offline',     dot: 'bg-critical-600' },
];

const TopologyPage: React.FC = () => {
  const [nodes, , onNodesChange] = useNodesState<TopologyNodeData>(toRFNodes(topologyNodes));
  const [edges, , onEdgesChange] = useEdgesState(toRFEdges(topologyEdges));

  const [selectedNode, setSelectedNode] = useState<TopologyNodeType | null>(null);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<DeviceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');

  // Apply search and filter to nodes (dim non-matching nodes)
  const filteredNodeIds = useMemo(() => {
    return topologyNodes
      .filter((n) => {
        const matchesSearch =
          !search ||
          n.label.toLowerCase().includes(search.toLowerCase()) ||
          n.ipAddress.includes(search);
        const matchesType = typeFilter === 'all' || n.type === typeFilter;
        const matchesStatus = statusFilter === 'all' || n.status === statusFilter;
        return matchesSearch && matchesType && matchesStatus;
      })
      .map((n) => n.id);
  }, [search, typeFilter, statusFilter]);

  const visibleNodes = useMemo(
    () =>
      nodes.map((n) => ({
        ...n,
        style: filteredNodeIds.includes(n.id) ? {} : { opacity: 0.15 },
      })),
    [nodes, filteredNodeIds]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node<TopologyNodeData>) => {
      const found = topologyNodes.find((n) => n.id === node.id);
      setSelectedNode(found ?? null);
    },
    []
  );

  const statusCounts = useMemo(() => ({
    online:  topologyNodes.filter((n) => n.status === 'online').length,
    warning: topologyNodes.filter((n) => n.status === 'warning').length,
    offline: topologyNodes.filter((n) => n.status === 'offline').length,
  }), []);

  return (
    <AppLayout breadcrumbs={[{ label: 'Network Topology' }]}>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Toolbar */}
        <div className="flex-shrink-0 bg-white border-b border-border px-5 py-3 flex flex-wrap items-center gap-3">
          {/* Title */}
          <div className="flex items-center gap-2 mr-2">
            <div className="p-1.5 bg-primary-50 rounded-lg">
              <Network className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary">Network Topology</h1>
              <p className="text-[10px] text-text-muted">{topologyNodes.length} devices · {topologyEdges.length} links</p>
            </div>
          </div>

          {/* Search */}
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search device or IP..."
            size="sm"
            className="w-48"
          />

          {/* Type filter */}
          <div className="flex items-center gap-1 flex-wrap">
            <Filter className="h-3.5 w-3.5 text-text-muted" />
            {DEVICE_TYPE_FILTERS.map((f) => (
              <button
                key={f.type}
                onClick={() => setTypeFilter(f.type as DeviceType | 'all')}
                className={cn(
                  'px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors',
                  typeFilter === f.type
                    ? 'bg-primary-600 text-white'
                    : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary'
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Divider */}
          <div className="h-5 w-px bg-border" />

          {/* Status filter */}
          <div className="flex items-center gap-1 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.status}
                onClick={() => setStatusFilter(f.status as DeviceStatus | 'all')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors',
                  statusFilter === f.status
                    ? 'bg-surface-tertiary border border-border-strong text-text-primary'
                    : 'text-text-secondary hover:bg-surface-secondary'
                )}
              >
                <span className={cn('w-1.5 h-1.5 rounded-full', f.dot)} />
                {f.label}
              </button>
            ))}
          </div>

          {/* Status summary */}
          <div className="ml-auto flex items-center gap-3">
            <span className="flex items-center gap-1 text-[10px] text-success-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-success-600" />
              {statusCounts.online} online
            </span>
            <span className="flex items-center gap-1 text-[10px] text-warning-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />
              {statusCounts.warning} warning
            </span>
            <span className="flex items-center gap-1 text-[10px] text-critical-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-critical-600" />
              {statusCounts.offline} offline
            </span>
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={visibleNodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.2 }}
            minZoom={0.3}
            maxZoom={2}
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={20}
              size={1}
              color="#e2e8f0"
            />
            <Controls />
            <MiniMap
              nodeColor={(n: Node<TopologyNodeData>) => {
                const status = n.data?.status;
                if (status === 'online')  return '#16a34a';
                if (status === 'warning') return '#f59e0b';
                if (status === 'offline') return '#dc2626';
                return '#94a3b8';
              }}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
              }}
              maskColor="rgba(241,245,249,0.6)"
            />
          </ReactFlow>

          {/* Legend */}
          <div className="absolute bottom-16 left-4 bg-white/90 backdrop-blur-sm border border-border rounded-lg shadow-card p-3 text-[10px] space-y-1.5">
            <p className="font-semibold text-text-secondary uppercase tracking-wider text-[9px]">Legend</p>
            {[
              { color: 'bg-primary-100 border-primary-300', label: 'Router' },
              { color: 'bg-teal-100 border-teal-300',       label: 'Switch' },
              { color: 'bg-warning-100 border-warning-300', label: 'Firewall' },
              { color: 'bg-success-50 border-success-200',  label: 'Server' },
              { color: 'bg-surface-tertiary border-border',  label: 'PC / Endpoint' },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2">
                <div className={cn('w-4 h-4 rounded border', item.color)} />
                <span className="text-text-secondary">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Device Detail Drawer */}
      <DeviceDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
      />
    </AppLayout>
  );
};

export default TopologyPage;
