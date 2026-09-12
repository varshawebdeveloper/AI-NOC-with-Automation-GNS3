import React, { useState, useCallback, useMemo, useEffect } from 'react';
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
import { ChevronDown, Filter, Network, RefreshCw } from 'lucide-react';
import { AppLayout } from '../../layouts/AppLayout';
import { nodeTypes } from '../../components/topology/TopologyNode';
import type { TopologyNodeData } from '../../components/topology/TopologyNode';
import { DeviceDetailDrawer } from '../../components/topology/DeviceDetailDrawer';
import { GNS3StatusBadge } from '../../components/topology/GNS3StatusBadge';
import { SearchBar } from '../../components/common/SearchBar';
import { topologyNodes as demoNodes, topologyEdges as demoEdges } from '../../data/topologyData';
import type { TopologyNode as TopologyNodeType, DeviceType, DeviceStatus } from '../../types';
import { useGNS3 } from '../../context/GNS3Context';
import type { MappedNode, MappedEdge } from '../../services/gns3Service';
import { cn } from '../../utils';

// ─── Converters ────────────────────────────────────────────────────────────────

const toRFNodes = (nodes: (TopologyNodeType | MappedNode)[]): Node<TopologyNodeData>[] =>
  nodes.map((n) => ({
    id:   n.id,
    type: 'default',
    position: n.position,
    data: {
      label:     n.label,
      type:      n.type,
      status:    n.status,
      ipAddress: n.ipAddress,
      cpu:       n.cpu,
      ram:       n.ram,
    },
    draggable: true,
  }));

const toRFEdges = (edges: (typeof demoEdges[0] | MappedEdge)[]): Edge[] =>
  edges.map((e) => ({
    id:           e.id,
    source:       e.source,
    target:       e.target,
    label:        ('bandwidth' in e ? e.bandwidth : undefined),
    style:        { stroke: '#cbd5e1', strokeWidth: 1.5 },
    labelStyle:   { fontSize: 9, fill: '#94a3b8' },
    labelBgStyle: { fill: '#f8fafc' },
    animated:     false,
  }));

// ─── Filter constants ──────────────────────────────────────────────────────────

const DEVICE_TYPE_FILTERS: { type: DeviceType | 'all'; label: string }[] = [
  { type: 'all',      label: 'All' },
  { type: 'router',   label: 'Routers' },
  { type: 'switch',   label: 'Switches' },
  { type: 'firewall', label: 'Firewalls' },
  { type: 'server',   label: 'Servers' },
  { type: 'pc',       label: 'PCs' },
];

const STATUS_FILTERS: { status: DeviceStatus | 'all'; label: string; dot: string }[] = [
  { status: 'all',     label: 'All Status', dot: 'bg-text-muted' },
  { status: 'online',  label: 'Online',     dot: 'bg-success-600' },
  { status: 'warning', label: 'Warning',    dot: 'bg-warning-500' },
  { status: 'offline', label: 'Offline',    dot: 'bg-critical-600' },
];

// ─── Component ────────────────────────────────────────────────────────────────

const TopologyPage: React.FC = () => {
  // ── Consume shared GNS3 context (no separate polling here) ──────────────────
  const {
    connected, loading: gns3Loading,
    projects, selectedProject, setSelectedProject,
    nodes: liveNodes, edges: liveEdges,
    onlineCount, offlineCount, warningCount,
    refresh,
  } = useGNS3();

  const [showProjectDrop, setShowProjectDrop] = useState(false);

  // Use live GNS3 data if connected and nodes available, else demo data
  const usingLive  = connected && liveNodes.length > 0;
  const activeNodes: (TopologyNodeType | MappedNode)[] = usingLive ? liveNodes : demoNodes;
  const activeEdges: (typeof demoEdges[0] | MappedEdge)[] = usingLive ? liveEdges : demoEdges;

  // ── React Flow state ──
  const rfNodes = useMemo(() => toRFNodes(activeNodes), [activeNodes]);
  const rfEdges = useMemo(() => toRFEdges(activeEdges), [activeEdges]);
  
  const [nodes, setNodes, onNodesChange] = useNodesState<TopologyNodeData>(rfNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(rfEdges);

  // Sync ReactFlow state when live data updates
  useEffect(() => {
    setNodes(rfNodes);
  }, [rfNodes, setNodes]);

  useEffect(() => {
    setEdges(rfEdges);
  }, [rfEdges, setEdges]);

  // ── UI filter state ──
  const [selectedNode, setSelectedNode] = useState<TopologyNodeType | MappedNode | null>(null);
  const [search, setSearch]             = useState('');
  const [typeFilter, setTypeFilter]     = useState<DeviceType | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<DeviceStatus | 'all'>('all');

  // ── Filters ──────────────────────────────────────────────────────────────────
  const filteredNodeIds = useMemo(() => {
    return activeNodes
      .filter((n) => {
        const matchSearch =
          !search ||
          n.label.toLowerCase().includes(search.toLowerCase()) ||
          n.ipAddress.includes(search);
        const matchType   = typeFilter === 'all' || n.type === typeFilter;
        const matchStatus = statusFilter === 'all' || n.status === statusFilter;
        return matchSearch && matchType && matchStatus;
      })
      .map((n) => n.id);
  }, [activeNodes, search, typeFilter, statusFilter]);

  const visibleNodes = useMemo(
    () => nodes.map((n) => ({
      ...n,
      style: filteredNodeIds.includes(n.id) ? {} : { opacity: 0.15 },
    })),
    [nodes, filteredNodeIds],
  );

  const onNodeClick = useCallback(
    (_e: React.MouseEvent, node: Node<TopologyNodeData>) => {
      const found = activeNodes.find((n) => n.id === node.id);
      setSelectedNode(found ?? null);
    },
    [activeNodes],
  );

  // Use GNS3 context counts when live, else compute from demo
  const counts = usingLive
    ? { online: onlineCount, warning: warningCount, offline: offlineCount }
    : {
        online:  demoNodes.filter((n) => n.status === 'online').length,
        warning: demoNodes.filter((n) => n.status === 'warning').length,
        offline: demoNodes.filter((n) => n.status === 'offline').length,
      };

  return (
    <AppLayout breadcrumbs={[{ label: 'Network Topology' }]}>
      <div className="flex flex-col h-[calc(100vh-64px)]">

        {/* ── Toolbar ── */}
        <div className="flex-shrink-0 bg-white border-b border-border px-5 py-3 flex flex-wrap items-center gap-3">

          {/* Title */}
          <div className="flex items-center gap-2 mr-2">
            <div className="p-1.5 bg-primary-50 rounded-lg">
              <Network className="h-4 w-4 text-primary-600" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-text-primary">Network Topology</h1>
              <p className="text-[10px] text-text-muted">
                {activeNodes.length} devices · {activeEdges.length} links
                {usingLive && <span className="ml-1 text-success-600 font-medium">· Live</span>}
              </p>
            </div>
          </div>

          {/* GNS3 status badge */}
          <GNS3StatusBadge
            connected={connected}
            loading={gns3Loading}
            projectName={selectedProject?.name}
            onRefresh={refresh}
          />

          {/* Project dropdown */}
          {connected && projects.length > 0 && (
            <div className="relative">
              <button
                onClick={() => setShowProjectDrop((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-secondary border border-border rounded-full text-[11px] font-medium text-text-secondary hover:text-text-primary hover:bg-surface-tertiary transition-colors"
              >
                {selectedProject?.name ?? 'Select Project'}
                <ChevronDown className={cn('h-3 w-3 transition-transform', showProjectDrop && 'rotate-180')} />
              </button>

              {showProjectDrop && (
                <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-border rounded-card shadow-card-lg z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-[10px] font-semibold text-text-muted uppercase tracking-wider">GNS3 Projects</p>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {projects.map((p) => (
                      <button
                        key={p.project_id}
                        onClick={() => { setSelectedProject(p); setShowProjectDrop(false); }}
                        className={cn(
                          'flex items-center justify-between w-full px-3 py-2.5 text-xs text-left transition-colors',
                          selectedProject?.project_id === p.project_id
                            ? 'bg-primary-50 text-primary-600 font-semibold'
                            : 'text-text-secondary hover:bg-surface-secondary',
                        )}
                      >
                        <span className="truncate">{p.name}</span>
                        <span className={cn(
                          'ml-2 flex-shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded-full',
                          p.status === 'opened' ? 'bg-success-50 text-success-600' : 'bg-surface-tertiary text-text-muted',
                        )}>
                          {p.status === 'opened' ? 'Open' : 'Closed'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Manual refresh */}
          {connected && (
            <button
              onClick={refresh}
              className="p-1.5 rounded-lg text-text-muted hover:text-primary-600 hover:bg-primary-50 transition-colors"
              title="Refresh topology"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Search */}
          <SearchBar value={search} onChange={setSearch} placeholder="Search device or IP..." size="sm" className="w-48" />

          {/* Type filters */}
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
                    : 'bg-surface-secondary text-text-secondary hover:bg-surface-tertiary',
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Status filters */}
          <div className="flex items-center gap-1 flex-wrap">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.status}
                onClick={() => setStatusFilter(f.status as DeviceStatus | 'all')}
                className={cn(
                  'flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-medium rounded-full transition-colors',
                  statusFilter === f.status
                    ? 'bg-surface-tertiary border border-border-strong text-text-primary'
                    : 'text-text-secondary hover:bg-surface-secondary',
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
              <span className="w-1.5 h-1.5 rounded-full bg-success-600" />{counts.online} online
            </span>
            <span className="flex items-center gap-1 text-[10px] text-warning-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-warning-500" />{counts.warning} warning
            </span>
            <span className="flex items-center gap-1 text-[10px] text-critical-600 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-critical-600" />{counts.offline} offline
            </span>
          </div>
        </div>

        {/* ── Canvas ── */}
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
            <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#e2e8f0" />
            <Controls />
            <MiniMap
              nodeColor={(n: Node<TopologyNodeData>) => {
                if (n.data?.status === 'online')  return '#16a34a';
                if (n.data?.status === 'warning') return '#f59e0b';
                if (n.data?.status === 'offline') return '#dc2626';
                return '#94a3b8';
              }}
              style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px' }}
              maskColor="rgba(241,245,249,0.6)"
            />
          </ReactFlow>

          {/* Demo warning banner */}
          {!usingLive && !gns3Loading && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-warning-50 border border-warning-100 rounded-full px-4 py-1.5 text-[11px] text-warning-600 font-medium shadow-card">
              GNS3 not connected — showing demo topology
            </div>
          )}

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
        node={selectedNode as TopologyNodeType}
        onClose={() => setSelectedNode(null)}
      />
    </AppLayout>
  );
};

export default TopologyPage;
