/**
 * GNS3 Service – placeholder for GNS3 REST API integration
 * GNS3 Server REST API: http://localhost:3080/v2
 * Docs: https://gns3-server.readthedocs.io/en/latest/
 *
 * TODO: Configure GNS3 server address in .env
 * TODO: Implement project discovery
 * TODO: Map GNS3 node types to AI-NOC device types
 * TODO: Sync real-time topology from GNS3 links + nodes
 */
// import apiClient from './api'; // The backend will proxy GNS3 calls

const GNS3_URL = import.meta.env.VITE_GNS3_URL || 'http://localhost:3080/v2';

export const gns3Service = {
  /**
   * Get all GNS3 projects
   * TODO: GET /v2/projects
   */
  async getProjects() {
    console.info(`[GNS3] Would fetch projects from ${GNS3_URL}/projects`);
    return [];
  },

  /**
   * Get nodes in a GNS3 project
   * TODO: GET /v2/projects/{project_id}/nodes
   */
  async getProjectNodes(_projectId: string) {
    console.info(`[GNS3] Would fetch nodes for project ${_projectId}`);
    return [];
  },

  /**
   * Get links in a GNS3 project
   * TODO: GET /v2/projects/{project_id}/links
   */
  async getProjectLinks(_projectId: string) {
    console.info(`[GNS3] Would fetch links for project ${_projectId}`);
    return [];
  },

  /**
   * Start a GNS3 node
   * TODO: POST /v2/projects/{project_id}/nodes/{node_id}/start
   */
  async startNode(_projectId: string, _nodeId: string) {
    console.info(`[GNS3] Would start node ${_nodeId}`);
  },

  /**
   * Stop a GNS3 node
   * TODO: POST /v2/projects/{project_id}/nodes/{node_id}/stop
   */
  async stopNode(_projectId: string, _nodeId: string) {
    console.info(`[GNS3] Would stop node ${_nodeId}`);
  },

  /**
   * Map GNS3 node type to AI-NOC device type
   */
  mapNodeType(gns3Type: string): string {
    const typeMap: Record<string, string> = {
      'ethernet_hub': 'switch',
      'ethernet_switch': 'switch',
      'router': 'router',
      'vpcs': 'pc',
      'cloud': 'router',
      'firewall': 'firewall',
    };
    return typeMap[gns3Type] ?? 'pc';
  },
};
