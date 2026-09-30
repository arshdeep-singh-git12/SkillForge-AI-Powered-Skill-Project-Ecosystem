/**
 * API Client
 *
 * Base configuration for all API calls to the SkillForge backend.
 * Uses axios for HTTP requests with interceptors for auth tokens.
 *
 * Usage in other service files:
 *   import api from './api';
 *   const response = await api.get('/users/123');
 */

import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    // TODO: Get token from localStorage or auth context
    // const token = localStorage.getItem('skillforge_token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
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
    // TODO: Handle 401 (redirect to login), 500 (show error toast), etc.
    if (error.response?.status === 401) {
      // Redirect to login or refresh token
      console.warn('Unauthorized — redirecting to login');
    }
    return Promise.reject(error);
  },
);

export default api;
