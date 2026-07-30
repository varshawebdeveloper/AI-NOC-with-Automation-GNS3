/**
 * Auth Service – placeholder for Express + MongoDB auth
 * TODO: Connect to POST /api/auth/login
 * TODO: Connect to POST /api/auth/logout
 * TODO: Connect to POST /api/auth/forgot-password
 * TODO: Connect to GET  /api/auth/me
 */
import type { LoginCredentials, User } from '../types';
// import apiClient from './api';  // Uncomment when backend is ready

// Dummy credentials for Phase 1
const DUMMY_USERS: (User & { password: string })[] = [
  {
    id: 'user-001',
    name: 'Admin User',
    email: 'admin@ainoc.com',
    role: 'admin',
    password: 'admin123',
  },
  {
    id: 'user-002',
    name: 'NOC Operator',
    email: 'operator@ainoc.com',
    role: 'operator',
    password: 'operator123',
  },
];

export const authService = {
  async login(credentials: LoginCredentials): Promise<User> {
    // TODO: Replace with: return apiClient.post('/auth/login', credentials).then(r => r.data)
    await new Promise((resolve) => setTimeout(resolve, 1000)); // simulate latency
    const user = DUMMY_USERS.find(
      (u) => u.email === credentials.email && u.password === credentials.password
    );
    if (!user) {
      throw new Error('Invalid email or password');
    }
    const { password: _, ...userWithoutPassword } = user;
    localStorage.setItem('auth_token', `dummy-token-${user.id}`);
    localStorage.setItem('auth_user', JSON.stringify(userWithoutPassword));
    return userWithoutPassword;
  },

  async logout(): Promise<void> {
    // TODO: Replace with: return apiClient.post('/auth/logout')
    await new Promise((resolve) => setTimeout(resolve, 300));
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  },

  async forgotPassword(email: string): Promise<void> {
    // TODO: Replace with: return apiClient.post('/auth/forgot-password', { email })
    await new Promise((resolve) => setTimeout(resolve, 1000));
    const user = DUMMY_USERS.find((u) => u.email === email);
    if (!user) {
      throw new Error('No account found with that email address');
    }
    // In real app, sends reset email
  },

  async getCurrentUser(): Promise<User | null> {
    // TODO: Replace with: return apiClient.get('/auth/me').then(r => r.data)
    const stored = localStorage.getItem('auth_user');
    if (!stored) return null;
    try {
      return JSON.parse(stored) as User;
    } catch {
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('auth_token');
  },
};
