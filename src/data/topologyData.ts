import type { TopologyNode, TopologyEdge } from '../types';

// ─── Topology Nodes ───────────────────────────────────────────────────────────
// Prepared for future GNS3 integration – node IDs map to GNS3 project node IDs
// GNS3 REST API: GET /v2/projects/{project_id}/nodes
export const topologyNodes: TopologyNode[] = [
  // Internet / WAN
  {
    id: 'inet-01',
    type: 'router',
    label: 'Internet / WAN',
    ipAddress: '203.0.113.1',
    status: 'online',
    cpu: 0,
    ram: 0,
    location: 'External',
    position: { x: 600, y: 20 },
  },

  // Edge Routers
  {
    id: 'router-edge-01',
    type: 'router',
    label: 'Router-Edge-01',
    ipAddress: '10.0.1.1',
    status: 'online',
    cpu: 42,
    ram: 55,
    location: 'DC – Rack A2',
    vendor: 'Cisco',
    model: 'ASR 1001-X',
    position: { x: 350, y: 130 },
  },
  {
    id: 'router-edge-02',
    type: 'router',
    label: 'Router-Edge-02',
    ipAddress: '10.0.1.2',
    status: 'online',
    cpu: 38,
    ram: 49,
    location: 'DC – Rack A3',
    vendor: 'Juniper',
    model: 'MX104',
    position: { x: 850, y: 130 },
  },

  // Firewalls
  {
    id: 'fw-primary',
    type: 'firewall',
    label: 'FW-Primary',
    ipAddress: '10.0.2.1',
    status: 'warning',
    cpu: 71,
    ram: 82,
    location: 'DC – Rack B1',
    vendor: 'Palo Alto',
    model: 'PA-3260',
    position: { x: 350, y: 260 },
  },
  {
    id: 'fw-secondary',
    type: 'firewall',
    label: 'FW-Secondary',
    ipAddress: '10.0.2.2',
    status: 'online',
    cpu: 33,
    ram: 45,
    location: 'DC – Rack B2',
    vendor: 'Palo Alto',
    model: 'PA-3260',
    position: { x: 850, y: 260 },
  },

  // Core Router
  {
    id: 'core-router-01',
    type: 'router',
    label: 'Core-Router-01',
    ipAddress: '10.0.0.1',
    status: 'warning',
    cpu: 95,
    ram: 68,
    location: 'DC – Rack A1',
    vendor: 'Cisco',
    model: 'ASR 1001-X',
    position: { x: 600, y: 260 },
  },

  // Core Switches
  {
    id: 'sw-core-01',
    type: 'switch',
    label: 'SW-Core-01',
    ipAddress: '10.0.3.1',
    status: 'online',
    cpu: 22,
    ram: 38,
    location: 'DC – Rack C1',
    vendor: 'Cisco',
    model: 'Catalyst 9300',
    position: { x: 450, y: 390 },
  },
  {
    id: 'sw-core-02',
    type: 'switch',
    label: 'SW-Core-02',
    ipAddress: '10.0.3.2',
    status: 'online',
    cpu: 19,
    ram: 34,
    location: 'DC – Rack C2',
    vendor: 'Cisco',
    model: 'Catalyst 9300',
    position: { x: 750, y: 390 },
  },

  // Distribution Switches
  {
    id: 'sw-floor-1',
    type: 'switch',
    label: 'SW-Floor-1',
    ipAddress: '10.0.4.1',
    status: 'online',
    cpu: 15,
    ram: 28,
    location: 'Floor 1 – IDF',
    vendor: 'Cisco',
    model: 'Catalyst 9200',
    position: { x: 200, y: 510 },
  },
  {
    id: 'sw-floor-2',
    type: 'switch',
    label: 'SW-Floor-2',
    ipAddress: '10.0.4.2',
    status: 'online',
    cpu: 18,
    ram: 31,
    location: 'Floor 2 – IDF',
    vendor: 'Cisco',
    model: 'Catalyst 9200',
    position: { x: 450, y: 510 },
  },
  {
    id: 'sw-floor-3',
    type: 'switch',
    label: 'SW-Floor-3',
    ipAddress: '10.0.4.3',
    status: 'warning',
    cpu: 28,
    ram: 42,
    location: 'Floor 3 – IDF',
    vendor: 'Cisco',
    model: 'Catalyst 9200',
    position: { x: 750, y: 510 },
  },

  // Servers
  {
    id: 'server-db-01',
    type: 'server',
    label: 'Server-DB-01',
    ipAddress: '10.0.5.1',
    status: 'online',
    cpu: 45,
    ram: 78,
    location: 'DC – Rack D1',
    vendor: 'Dell',
    model: 'PowerEdge R750',
    position: { x: 980, y: 390 },
  },
  {
    id: 'server-db-02',
    type: 'server',
    label: 'Server-DB-02',
    ipAddress: '10.0.5.2',
    status: 'warning',
    cpu: 55,
    ram: 91,
    location: 'DC – Rack D2',
    vendor: 'Dell',
    model: 'PowerEdge R750',
    position: { x: 980, y: 480 },
  },
  {
    id: 'server-app-01',
    type: 'server',
    label: 'Server-App-01',
    ipAddress: '10.0.5.3',
    status: 'online',
    cpu: 62,
    ram: 80,
    location: 'DC – Rack D3',
    vendor: 'HPE',
    model: 'ProLiant DL380',
    position: { x: 980, y: 570 },
  },
  {
    id: 'server-app-02',
    type: 'server',
    label: 'Server-App-02',
    ipAddress: '10.0.5.4',
    status: 'offline',
    cpu: 0,
    ram: 0,
    location: 'DC – Rack D4',
    vendor: 'HPE',
    model: 'ProLiant DL380',
    position: { x: 980, y: 660 },
  },

  // PC Endpoints
  {
    id: 'pc-dev-01',
    type: 'pc',
    label: 'PC-Dev-01',
    ipAddress: '192.168.10.101',
    status: 'online',
    cpu: 34,
    ram: 52,
    location: 'Floor 1 – Dev Zone',
    position: { x: 100, y: 630 },
  },
  {
    id: 'pc-dev-02',
    type: 'pc',
    label: 'PC-Dev-02',
    ipAddress: '192.168.10.102',
    status: 'online',
    cpu: 28,
    ram: 44,
    location: 'Floor 1 – Dev Zone',
    position: { x: 220, y: 630 },
  },
  {
    id: 'pc-mgmt-01',
    type: 'pc',
    label: 'PC-Mgmt-01',
    ipAddress: '192.168.20.101',
    status: 'offline',
    cpu: 0,
    ram: 0,
    location: 'Floor 2 – Mgmt Zone',
    position: { x: 380, y: 630 },
  },
];

// ─── Topology Edges ───────────────────────────────────────────────────────────
export const topologyEdges: TopologyEdge[] = [
  // Internet to Edge Routers
  { id: 'e-inet-edge01', source: 'inet-01', target: 'router-edge-01', bandwidth: '1 Gbps' },
  { id: 'e-inet-edge02', source: 'inet-01', target: 'router-edge-02', bandwidth: '1 Gbps' },

  // Edge Routers to Firewalls
  { id: 'e-edge01-fw1', source: 'router-edge-01', target: 'fw-primary', bandwidth: '1 Gbps' },
  { id: 'e-edge02-fw2', source: 'router-edge-02', target: 'fw-secondary', bandwidth: '1 Gbps' },

  // Firewalls to Core Router
  { id: 'e-fw1-core', source: 'fw-primary', target: 'core-router-01', bandwidth: '10 Gbps' },
  { id: 'e-fw2-core', source: 'fw-secondary', target: 'core-router-01', bandwidth: '10 Gbps' },

  // Core Router to Core Switches
  { id: 'e-core-sw1', source: 'core-router-01', target: 'sw-core-01', bandwidth: '10 Gbps' },
  { id: 'e-core-sw2', source: 'core-router-01', target: 'sw-core-02', bandwidth: '10 Gbps' },

  // Core Switch 1 to Distribution Switches
  { id: 'e-sw1-floor1', source: 'sw-core-01', target: 'sw-floor-1', bandwidth: '1 Gbps' },
  { id: 'e-sw1-floor2', source: 'sw-core-01', target: 'sw-floor-2', bandwidth: '1 Gbps' },

  // Core Switch 2 to Distribution Switches
  { id: 'e-sw2-floor3', source: 'sw-core-02', target: 'sw-floor-3', bandwidth: '1 Gbps' },
  { id: 'e-sw2-srv-db1', source: 'sw-core-02', target: 'server-db-01', bandwidth: '10 Gbps' },
  { id: 'e-sw2-srv-db2', source: 'sw-core-02', target: 'server-db-02', bandwidth: '10 Gbps' },
  { id: 'e-sw2-srv-app1', source: 'sw-core-02', target: 'server-app-01', bandwidth: '10 Gbps' },
  { id: 'e-sw2-srv-app2', source: 'sw-core-02', target: 'server-app-02', bandwidth: '10 Gbps' },

  // Distribution Switch 1 to PCs
  { id: 'e-floor1-pc01', source: 'sw-floor-1', target: 'pc-dev-01', bandwidth: '100 Mbps' },
  { id: 'e-floor1-pc02', source: 'sw-floor-1', target: 'pc-dev-02', bandwidth: '100 Mbps' },

  // Distribution Switch 2 to PCs
  { id: 'e-floor2-pc-mgmt', source: 'sw-floor-2', target: 'pc-mgmt-01', bandwidth: '100 Mbps' },
];
