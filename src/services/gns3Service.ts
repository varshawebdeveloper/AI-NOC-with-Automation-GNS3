/**
 * GNS3 Service – Live REST API Integration
 * GNS3 Server: http://localhost:3080/v2
 * Docs: https://gns3-server.readthedocs.io/en/latest/
 */

import type { DeviceStatus, DeviceType } from '../types';

// Uses Vite dev proxy: /gns3/... → localhost:3080/v2/... (no CORS)
const GNS3_BASE = import.meta.env.VITE_GNS3_URL ?? '/gns3';

// ─── GNS3 Raw Types ────────────────────────────────────────────────────────────

export interface GNS3Project {
  project_id: string;
  name: string;
  status: 'opened' | 'closed';
  path: string;
}

export interface GNS3Node {
  node_id: string;
  name: string;
  node_type: string;
  console_type: string;
  status: 'started' | 'stopped' | 'suspended';
  x: number;
  y: number;
  properties?: Record<string, unknown>;
}

export interface GNS3Link {
  link_id: string;
  nodes: Array<{
    node_id: string;
    adapter_number: number;
    port_number: number;
  }>;
  link_type?: string;
}

// ─── Mapped Types ──────────────────────────────────────────────────────────────

export interface MappedNode {
  id: string;
  label: string;
  type: DeviceType;
  status: DeviceStatus;
  ipAddress: string;
  cpu: number;
  ram: number;
  location: string;
  vendor?: string;
  model?: string;
  position: { x: number; y: number };
}

export interface MappedEdge {
  id: string;
  source: string;
  target: string;
  bandwidth?: string;
}

// ─── Helpers ───────────────────────────────────────────────────────────────────

function mapNodeType(gns3Type: string): DeviceType {
  const map: Record<string, DeviceType> = {
    vpcs:            'pc',
    ethernet_hub:    'switch',
    ethernet_switch: 'switch',
    router:          'router',
    cloud:           'router',
    firewall:        'firewall',
    qemu:            'server',
    docker:          'server',
    iou:             'router',
    dynamips:        'router',
  };
  const lower = gns3Type.toLowerCase();
  for (const [key, val] of Object.entries(map)) {
    if (lower.includes(key)) return val;
  }
  return 'pc';
}

function mapNodeStatus(gns3Status: string): DeviceStatus {
  switch (gns3Status) {
    case 'started':   return 'online';
    case 'stopped':   return 'offline';
    case 'suspended': return 'warning';
    default:          return 'unknown';
  }
}

// ─── Fetch helper with 5s timeout ─────────────────────────────────────────────

async function gns3Fetch<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 5000);
  try {
    const res = await fetch(`${GNS3_BASE}${path}`, {
      signal: controller.signal,
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) throw new Error(`GNS3 ${res.status}: ${res.statusText}`);
    return res.json() as Promise<T>;
  } finally {
    clearTimeout(timeout);
  }
}

// ─── GNS3 Service ──────────────────────────────────────────────────────────────

export const gns3Service = {
  /** Check if GNS3 server is reachable */
  async ping(): Promise<boolean> {
    try {
      await gns3Fetch('/version');
      return true;
    } catch {
      return false;
    }
  },

  /** Get all GNS3 projects */
  async getProjects(): Promise<GNS3Project[]> {
    return gns3Fetch<GNS3Project[]>('/projects');
  },

  /** Get nodes for a specific project */
  async getProjectNodes(projectId: string): Promise<GNS3Node[]> {
    return gns3Fetch<GNS3Node[]>(`/projects/${projectId}/nodes`);
  },

  /** Get links for a specific project */
  async getProjectLinks(projectId: string): Promise<GNS3Link[]> {
    return gns3Fetch<GNS3Link[]>(`/projects/${projectId}/links`);
  },

  /** Start a node */
  async startNode(projectId: string, nodeId: string): Promise<void> {
    await fetch(`${GNS3_BASE}/projects/${projectId}/nodes/${nodeId}/start`, {
      method: 'POST',
    });
  },

  /** Stop a node */
  async stopNode(projectId: string, nodeId: string): Promise<void> {
    await fetch(`${GNS3_BASE}/projects/${projectId}/nodes/${nodeId}/stop`, {
      method: 'POST',
    });
  },

  /** Convert GNS3 nodes → MappedNode[] */
  mapNodes(gns3Nodes: GNS3Node[]): MappedNode[] {
    return gns3Nodes.map((n) => ({
      id:        n.node_id,
      label:     n.name,
      type:      mapNodeType(n.node_type),
      status:    mapNodeStatus(n.status),
      ipAddress: '',
      cpu:       0,
      ram:       0,
      location:  'GNS3 Simulation',
      position:  {
        x: (n.x ?? 0) + 600,
        y: (n.y ?? 0) + 400,
      },
    }));
  },

  /** Convert GNS3 links → MappedEdge[] */
  mapLinks(gns3Links: GNS3Link[]): MappedEdge[] {
    return gns3Links
      .filter((l) => l.nodes.length >= 2)
      .map((l) => ({
        id:     l.link_id,
        source: l.nodes[0].node_id,
        target: l.nodes[1].node_id,
      }));
  },
};