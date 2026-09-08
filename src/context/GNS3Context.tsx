/**
 * GNS3Context – Single source of truth for live GNS3 data.
 *
 * Responsibilities:
 *  - Ping GNS3, load project list
 *  - Poll node + link status every 10 s
 *  - Detect state changes → generate alerts (deduplication)
 *  - Maintain activity feed (last 30 events)
 *  - Expose device distribution counts
 *  - Feed both Dashboard and Network Topology from one poll loop
 */

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  gns3Service,
  type GNS3Project,
  type MappedNode,
  type MappedEdge,
} from '../services/gns3Service';
import type { Alert, ActivityItem, DeviceDistribution } from '../types';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GNS3State {
  // Connection
  connected: boolean;
  loading: boolean;
  error: string | null;

  // Projects
  projects: GNS3Project[];
  selectedProject: GNS3Project | null;
  setSelectedProject: (p: GNS3Project) => void;

  // Live topology data
  nodes: MappedNode[];
  edges: MappedEdge[];

  // Derived dashboard data
  deviceDistribution: DeviceDistribution[];
  alerts: Alert[];
  activityFeed: ActivityItem[];

  // Counts
  onlineCount: number;
  offlineCount: number;
  warningCount: number;

  // Manual refresh
  refresh: () => void;
  lastUpdated: Date | null;
}

// ─── Context ──────────────────────────────────────────────────────────────────

const GNS3Context = createContext<GNS3State | null>(null);

export const useGNS3 = (): GNS3State => {
  const ctx = useContext(GNS3Context);
  if (!ctx) throw new Error('useGNS3 must be used inside GNS3Provider');
  return ctx;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 10_000;
const MAX_ACTIVITY = 30;
const MAX_ALERTS = 50;

const DEVICE_COLORS: Record<string, string> = {
  router:   '#2563eb',
  switch:   '#0d9488',
  firewall: '#f59e0b',
  server:   '#16a34a',
  pc:       '#94a3b8',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

let _alertCounter = 0;
const nextAlertId = () => `gns3-alrt-${Date.now()}-${++_alertCounter}`;

let _actCounter = 0;
const nextActId = () => `gns3-act-${Date.now()}-${++_actCounter}`;

function buildDistribution(nodes: MappedNode[]): DeviceDistribution[] {
  const counts: Record<string, number> = {
    router: 0, switch: 0, firewall: 0, server: 0, pc: 0,
  };
  for (const n of nodes) {
    if (n.type in counts) counts[n.type]++;
    else counts.pc++;
  }
  return [
    { type: 'router',   label: 'Routers',   count: counts.router,   color: DEVICE_COLORS.router },
    { type: 'switch',   label: 'Switches',  count: counts.switch,   color: DEVICE_COLORS.switch },
    { type: 'firewall', label: 'Firewalls', count: counts.firewall, color: DEVICE_COLORS.firewall },
    { type: 'server',   label: 'Servers',   count: counts.server,   color: DEVICE_COLORS.server },
    { type: 'pc',       label: 'PCs',       count: counts.pc,       color: DEVICE_COLORS.pc },
  ].filter((d) => d.count > 0);
}

type NodeStatus = 'online' | 'offline' | 'warning' | 'unknown';

function makeAlert(node: MappedNode, newStatus: NodeStatus): Alert {
  const isOnline  = newStatus === 'online';
  const isOffline = newStatus === 'offline';
  return {
    id:           nextAlertId(),
    severity:     isOffline ? 'critical' : isOnline ? 'success' : 'warning',
    device:       node.label,
    message:      isOffline
      ? `${node.label} went offline`
      : isOnline
        ? `${node.label} is back online`
        : `${node.label} status changed to ${newStatus}`,
    timestamp:    new Date().toISOString(),
    acknowledged: false,
  };
}

function makeActivity(node: MappedNode, newStatus: NodeStatus): ActivityItem {
  const isOnline  = newStatus === 'online';
  const isOffline = newStatus === 'offline';
  return {
    id:        nextActId(),
    message:   isOffline
      ? `${node.label} went offline`
      : isOnline
        ? `${node.label} is back online`
        : `${node.label} status: ${newStatus}`,
    timestamp: new Date().toISOString(),
    type:      isOffline ? 'critical' : isOnline ? 'success' : 'warning',
    device:    node.label,
  };
}

// ─── Provider ─────────────────────────────────────────────────────────────────

export const GNS3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [connected, setConnected]         = useState(false);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState<string | null>(null);
  const [projects, setProjects]           = useState<GNS3Project[]>([]);
  const [selectedProject, _setProject]   = useState<GNS3Project | null>(null);
  const [nodes, setNodes]                 = useState<MappedNode[]>([]);
  const [edges, setEdges]                 = useState<MappedEdge[]>([]);
  const [alerts, setAlerts]               = useState<Alert[]>([]);
  const [activityFeed, setActivity]       = useState<ActivityItem[]>([]);
  const [lastUpdated, setLastUpdated]     = useState<Date | null>(null);

  // Track previous node statuses for change detection
  const prevStatusRef = useRef<Map<string, NodeStatus>>(new Map());
  const pollRef       = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Fetch topology for current project ──────────────────────────────────────
  const fetchTopology = useCallback(async (project: GNS3Project) => {
    try {
      const [rawNodes, rawLinks] = await Promise.all([
        gns3Service.getProjectNodes(project.project_id),
        gns3Service.getProjectLinks(project.project_id),
      ]);

      const mapped = gns3Service.mapNodes(rawNodes);
      const mappedEdges = gns3Service.mapLinks(rawLinks);

      // Detect state changes — generate alerts + activity only on change
      const newAlerts: Alert[]       = [];
      const newActivity: ActivityItem[] = [];
      const prevMap = prevStatusRef.current;

      for (const node of mapped) {
        const prev = prevMap.get(node.id);
        const curr = node.status as NodeStatus;

        if (prev !== undefined && prev !== curr) {
          // State changed → generate alert + activity
          newAlerts.push(makeAlert(node, curr));
          newActivity.push(makeActivity(node, curr));
        }

        // Update tracked state
        prevMap.set(node.id, curr);
      }

      // Prepend new events (newest first)
      if (newAlerts.length > 0) {
        setAlerts((prev) => [...newAlerts, ...prev].slice(0, MAX_ALERTS));
      }
      if (newActivity.length > 0) {
        setActivity((prev) => [...newActivity, ...prev].slice(0, MAX_ACTIVITY));
      }

      setNodes(mapped);
      setEdges(mappedEdges);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('[GNS3Context] Topology fetch error:', err);
    }
  }, []);

  // ── Initial connect ──────────────────────────────────────────────────────────
  const connect = useCallback(async () => {
    setLoading(true);
    setError(null);

    const ok = await gns3Service.ping();
    setConnected(ok);

    if (!ok) {
      setError('GNS3 server not reachable at localhost:3080');
      setLoading(false);
      return;
    }

    try {
      const list = await gns3Service.getProjects();
      setProjects(list);

      // Auto-select first opened project, fallback to first
      const first = list.find((p) => p.status === 'opened') ?? list[0] ?? null;
      if (first) {
        _setProject(first);
        await fetchTopology(first);
      }
    } catch (e) {
      setError('Failed to load GNS3 projects');
      console.error(e);
    }

    setLoading(false);
  }, [fetchTopology]);

  // ── Set project from UI ──────────────────────────────────────────────────────
  const setSelectedProject = useCallback((p: GNS3Project) => {
    _setProject(p);
    prevStatusRef.current.clear(); // reset state tracking for new project
    fetchTopology(p);
  }, [fetchTopology]);

  // ── Start poll on mount ──────────────────────────────────────────────────────
  useEffect(() => {
    connect();
  }, [connect]);

  // ── Poll loop ────────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!connected || !selectedProject) return;

    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      fetchTopology(selectedProject);
    }, POLL_INTERVAL_MS);

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [connected, selectedProject, fetchTopology]);

  // ── Derived values ───────────────────────────────────────────────────────────
  const onlineCount  = nodes.filter((n) => n.status === 'online').length;
  const offlineCount = nodes.filter((n) => n.status === 'offline').length;
  const warningCount = nodes.filter((n) => n.status === 'warning').length;
  const deviceDistribution = buildDistribution(nodes);

  const refresh = useCallback(() => {
    if (selectedProject) fetchTopology(selectedProject);
    else connect();
  }, [selectedProject, fetchTopology, connect]);

  return (
    <GNS3Context.Provider value={{
      connected, loading, error,
      projects, selectedProject, setSelectedProject,
      nodes, edges,
      deviceDistribution, alerts, activityFeed,
      onlineCount, offlineCount, warningCount,
      refresh, lastUpdated,
    }}>
      {children}
    </GNS3Context.Provider>
  );
};
