/**
 * Network Service – placeholder for Express + MongoDB
 * TODO: Connect to GET /api/devices
 * TODO: Connect to GET /api/devices/:id
 * TODO: Connect to GET /api/topology
 * TODO: Connect to POST /api/scan
 */
// import apiClient from './api';  // Uncomment when backend is ready
import { devices, kpiData, trafficData, deviceDistribution } from '../data/dashboardData';
import { topologyNodes, topologyEdges } from '../data/topologyData';

export const networkService = {
  async getDevices() {
    // TODO: return apiClient.get('/devices').then(r => r.data)
    await new Promise((r) => setTimeout(r, 500));
    return devices;
  },

  async getDevice(id: string) {
    // TODO: return apiClient.get(`/devices/${id}`).then(r => r.data)
    await new Promise((r) => setTimeout(r, 300));
    return devices.find((d) => d.id === id) ?? null;
  },

  async getKpiData() {
    // TODO: return apiClient.get('/dashboard/kpi').then(r => r.data)
    await new Promise((r) => setTimeout(r, 400));
    return kpiData;
  },

  async getTrafficData() {
    // TODO: return apiClient.get('/dashboard/traffic').then(r => r.data)
    await new Promise((r) => setTimeout(r, 400));
    return trafficData;
  },

  async getDeviceDistribution() {
    // TODO: return apiClient.get('/dashboard/devices/distribution').then(r => r.data)
    await new Promise((r) => setTimeout(r, 300));
    return deviceDistribution;
  },

  async getTopologyNodes() {
    // TODO: return apiClient.get('/topology/nodes').then(r => r.data)
    // GNS3: GET /v2/projects/{project_id}/nodes
    await new Promise((r) => setTimeout(r, 600));
    return topologyNodes;
  },

  async getTopologyEdges() {
    // TODO: return apiClient.get('/topology/edges').then(r => r.data)
    // GNS3: GET /v2/projects/{project_id}/links
    await new Promise((r) => setTimeout(r, 600));
    return topologyEdges;
  },

  async runNetworkScan() {
    // TODO: return apiClient.post('/scan').then(r => r.data)
    await new Promise((r) => setTimeout(r, 3000));
    return { devicesFound: 149, newDevices: 2, timestamp: new Date().toISOString() };
  },
};
