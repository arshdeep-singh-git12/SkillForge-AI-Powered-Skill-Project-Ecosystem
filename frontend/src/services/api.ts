/**
 * API Client
 *
 * Base configuration for all API calls to the SkillForge backend.
 * Uses axios for HTTP requests with interceptors for auth tokens.
 */

import axios from 'axios';

const rawUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
const cleanBaseUrl = rawUrl.replace(/\/api\/?$/, '').replace(/\/+$/, '');

const api = axios.create({
  baseURL: `${cleanBaseUrl}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('skillforge_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor — handle common errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized');
    }
    return Promise.reject(error);
  },
);

export default api;
