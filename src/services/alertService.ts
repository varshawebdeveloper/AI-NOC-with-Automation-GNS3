/**
 * Alert Service
 * Connects the React dashboard to the FastAPI traffic analyzer.
 */

import apiClient from './api';

export interface Alert {
  id: string;
  threat: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  risk_score: number;
  description?: string;
  source_ip?: string;
  destination_ip?: string;
  protocol?: string;
  timestamp: string;
  status: 'ACTIVE' | 'RESOLVED';
}

export const alertService = {
  /**
   * Get live threat information from FastAPI.
   *
   * Backend endpoint:
   * GET /api/traffic
   */
  async getAlerts(): Promise<Alert[]> {
    try {
      const response = await apiClient.get('/api/traffic');

      const data = response.data;

      const threats = Array.isArray(data.threats)
        ? data.threats
        : [];

      return threats.map((item: any, index: number) => ({
        id: `threat-${index}`,

        threat:
          item.type ||
          'Unknown Threat',

        severity:
          item.severity ||
          'LOW',

        risk_score:
          Number(data.risk ?? 0),

        description:
          item.description ||
          'Suspicious network activity detected.',

        timestamp:
          new Date().toISOString(),

        status: 'ACTIVE',
      }));
    } catch (error) {
      console.error(
        'Failed to fetch threat alerts:',
        error
      );

      return [];
    }
  },

  /**
   * Acknowledge an alert.
   *
   * Not implemented in the current FastAPI backend.
   */
  async acknowledgeAlert(id: string) {
    console.warn(
      `Acknowledge API is not implemented yet for alert ${id}`
    );

    return {
      id,
      acknowledged: true,
    };
  },

  /**
   * Delete an alert.
   *
   * Not implemented in the current FastAPI backend.
   */
  async deleteAlert(id: string) {
    console.warn(
      `Delete API is not implemented yet for alert ${id}`
    );

    return {
      id,
      deleted: true,
    };
  },

  /**
   * Activity feed.
   *
   * Not implemented in the current FastAPI backend.
   */
  async getActivityFeed() {
    return [];
  },
};

export default alertService;