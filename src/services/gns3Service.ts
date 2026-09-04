/**
 * GNS3 Service
 * Connects React frontend with GNS3 Server REST API
 *
 * GNS3 Server:
 * http://localhost:3080/v2
 */

const GNS3_URL =
  import.meta.env.VITE_GNS3_URL || 'http://localhost:3080/v2';

export interface GNS3Project {
  project_id: string;
  name: string;
  status?: string;
  filename?: string;
}

export interface GNS3Node {
  node_id: string;
  name: string;
  node_type: string;
  compute_id?: string;
  status?: string;
  console_type?: string;
  console?: number | null;
  x?: number;
  y?: number;
}

export interface GNS3Link {
  link_id: string;
  nodes?: Array<{
    node_id: string;
    adapter_number?: number;
    port_number?: number;
  }>;
}

export interface AINOCDevice {
  id: string;
  name: string;
  type: string;
  status: string;
  x?: number;
  y?: number;
  gns3Type: string;
}

/**
 * Generic GET request
 */
async function get<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GNS3_URL}${endpoint}`);

  if (!response.ok) {
    throw new Error(
      `GNS3 API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Generic POST request
 */
async function post<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${GNS3_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(
      `GNS3 API Error: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

export const gns3Service = {
  /**
   * Get all GNS3 projects
   *
   * GET /v2/projects
   */
  async getProjects(): Promise<GNS3Project[]> {
    return get<GNS3Project[]>('/projects');
  },

  /**
   * Get nodes in a GNS3 project
   *
   * GET /v2/projects/{project_id}/nodes
   */
  async getProjectNodes(
    projectId: string
  ): Promise<GNS3Node[]> {
    return get<GNS3Node[]>(
      `/projects/${projectId}/nodes`
    );
  },

  /**
   * Get links in a GNS3 project
   *
   * GET /v2/projects/{project_id}/links
   */
  async getProjectLinks(
    projectId: string
  ): Promise<GNS3Link[]> {
    return get<GNS3Link[]>(
      `/projects/${projectId}/links`
    );
  },

  /**
   * Start a GNS3 node
   *
   * POST /v2/projects/{project_id}/nodes/{node_id}/start
   */
  async startNode(
    projectId: string,
    nodeId: string
  ) {
    return post(
      `/projects/${projectId}/nodes/${nodeId}/start`
    );
  },

  /**
   * Stop a GNS3 node
   *
   * POST /v2/projects/{project_id}/nodes/{node_id}/stop
   */
  async stopNode(
    projectId: string,
    nodeId: string
  ) {
    return post(
      `/projects/${projectId}/nodes/${nodeId}/stop`
    );
  },

  /**
   * Convert GNS3 node type
   * into AI-NOC device type.
   */
  mapNodeType(gns3Type: string): string {
    const typeMap: Record<string, string> = {
      ethernet_hub: 'switch',
      ethernet_switch: 'switch',
      router: 'router',
      vpcs: 'pc',
      cloud: 'router',
      firewall: 'firewall',
    };

    return typeMap[gns3Type] ?? 'pc';
  },

  /**
   * Convert GNS3 nodes into
   * AI-NOC dashboard devices.
   */
  mapNodesToDevices(
    nodes: GNS3Node[]
  ): AINOCDevice[] {
    return nodes.map((node) => ({
      id: node.node_id,
      name: node.name,
      type: this.mapNodeType(node.node_type),
      status: node.status ?? 'unknown',
      x: node.x,
      y: node.y,
      gns3Type: node.node_type,
    }));
  },
};