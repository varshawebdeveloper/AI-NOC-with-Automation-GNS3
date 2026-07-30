/**
 * Alert Service – placeholder for Express + MongoDB
 * TODO: Connect to GET  /api/alerts
 * TODO: Connect to PUT  /api/alerts/:id/acknowledge
 * TODO: Connect to DELETE /api/alerts/:id
 */
// import apiClient from './api';
import { recentAlerts, activityFeed } from '../data/dashboardData';

export const alertService = {
  async getAlerts() {
    // TODO: return apiClient.get('/alerts').then(r => r.data)
    await new Promise((r) => setTimeout(r, 400));
    return recentAlerts;
  },

  async acknowledgeAlert(id: string) {
    // TODO: return apiClient.put(`/alerts/${id}/acknowledge`).then(r => r.data)
    await new Promise((r) => setTimeout(r, 300));
    return { id, acknowledged: true };
  },

  async deleteAlert(id: string) {
    // TODO: return apiClient.delete(`/alerts/${id}`).then(r => r.data)
    await new Promise((r) => setTimeout(r, 300));
    return { id, deleted: true };
  },

  async getActivityFeed() {
    // TODO: return apiClient.get('/alerts/activity').then(r => r.data)
    await new Promise((r) => setTimeout(r, 300));
    return activityFeed;
  },
};
