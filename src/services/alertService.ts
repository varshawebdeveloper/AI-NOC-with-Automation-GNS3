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
  status: 'OPEN' | 'RESOLVED';
}

export const alertService = {
  /**
   * Get live alerts from FastAPI backend.
   *
   * Backend endpoint:
   * GET /api/alerts
   */
  async getAlerts(): Promise<Alert[]> {
    try {
      const response = await apiClient.get('/api/alerts');
      const data = response.data;

      const backendAlerts = Array.isArray(data) ? data : [];

      return backendAlerts.map((item: any) => {
        let severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL' = 'LOW';
        let risk_score = 10;
        
        if (item.severity === 'critical') {
          severity = 'CRITICAL';
          risk_score = 90;
        } else if (item.severity === 'warning') {
          severity = 'MEDIUM';
          risk_score = 50;
        }

        let threat = item.device_name ? `${item.device_name} Alert` : 'System Alert';
        // Extract the title if formatted like "CRITICAL — PC1 went offline"
        if (item.message && item.message.includes('—')) {
            threat = item.message.split('—')[1].trim();
        }

        return {
          id: item.id,
          threat,
          severity,
          risk_score,
          description: item.message,
          timestamp: item.created_at,
          status: item.status === 'OPEN' ? 'OPEN' : 'RESOLVED',
        };
      });
    } catch (error) {
      console.error('Failed to fetch threat alerts:', error);
      return [];
    }
  },

  /**
   * Clear all active alerts.
   */
  async clearAlerts(): Promise<void> {
    try {
      await apiClient.post('/api/alerts/clear');
    } catch (error) {
      console.error('Failed to clear alerts:', error);
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