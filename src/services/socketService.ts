/**
 * Socket Service – Socket.IO placeholder
 * TODO: Install socket.io-client and connect to your Express Socket.IO server
 * TODO: Subscribe to real-time alert events
 * TODO: Subscribe to device status change events
 * TODO: Subscribe to topology change events
 */
// import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

// TODO: Uncomment and configure when backend is ready
// let socket: Socket | null = null;

export const socketService = {
  connect() {
    // TODO: socket = io(SOCKET_URL, { auth: { token: localStorage.getItem('auth_token') } });
    console.info(`[Socket] Would connect to ${SOCKET_URL}`);
  },

  disconnect() {
    // TODO: socket?.disconnect();
    console.info('[Socket] Would disconnect');
  },

  onAlert(_callback: (alert: unknown) => void) {
    // TODO: socket?.on('alert:new', callback);
    console.info('[Socket] Would listen for alert:new events');
  },

  onDeviceStatusChange(_callback: (event: unknown) => void) {
    // TODO: socket?.on('device:status', callback);
    console.info('[Socket] Would listen for device:status events');
  },

  onTopologyChange(_callback: (event: unknown) => void) {
    // TODO: socket?.on('topology:change', callback);
    console.info('[Socket] Would listen for topology:change events');
  },

  emit(event: string, data?: unknown) {
    // TODO: socket?.emit(event, data);
    console.info(`[Socket] Would emit event: ${event}`, data);
  },
};
