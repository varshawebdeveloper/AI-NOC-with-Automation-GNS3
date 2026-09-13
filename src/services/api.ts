/**
 * API Service
 * Connects React Dashboard with Python FastAPI backend
 */

import axios, {
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from "axios";

// --------------------------------------------------
// API BASE URL
// --------------------------------------------------

// Uses Vite dev proxy: /api → http://127.0.0.1:8000 (no CORS)
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL || '';

// --------------------------------------------------
// AXIOS CLIENT
// --------------------------------------------------

export const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// --------------------------------------------------
// REQUEST INTERCEPTOR
// --------------------------------------------------

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },

  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// --------------------------------------------------
// RESPONSE INTERCEPTOR
// --------------------------------------------------

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },

  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// --------------------------------------------------
// TRAFFIC DATA TYPE
// --------------------------------------------------

export interface TrafficThreat {
  type: string;
  severity: string;
  description: string;
}

export interface TrafficData {
  total_packets: number;
  total_bytes: number;

  icmp: number;
  ospf: number;
  tcp: number;
  udp: number;
  other: number;

  threat_analysis?: {
    risk_score: number;
    severity: string;
    detected_threats: string[];
  };

  top_source_ips: Record<string, number>;
  top_destination_ips: Record<string, number>;
}

// --------------------------------------------------
// GET TRAFFIC DATA
// --------------------------------------------------

export const getTrafficData = async (): Promise<TrafficData> => {
  const response = await apiClient.get<TrafficData>(
    "/api/traffic"
  );

  return response.data;
};

// --------------------------------------------------
// DEFAULT EXPORT
// --------------------------------------------------

export default apiClient;