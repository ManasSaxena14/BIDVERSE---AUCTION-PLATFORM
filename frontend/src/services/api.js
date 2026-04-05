import axios from 'axios';

/**
 * Enterprise API Gateway Configuration
 * Defines institutional base URLs and global interceptors for secure resource allocation.
 */
const API_URL = import.meta.env.VITE_API_BASE_URL || 
  (import.meta.env.MODE === 'production' 
    ? 'https://bidverse-auction-platform.onrender.com/api'
    : '/api');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Institutional request timeout (15s)
});

/**
 * Secure Request Interceptor
 * Injects institutional authentication tokens and logs outgoing protocols.
 */
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.info(`[API] Protocol Initiated: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('[API] Request Protocol Error:', error);
    return Promise.reject(error);
  }
);

/**
 * Response Interceptor
 * Handles institutional status codes and manages authentication session lifecycle.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response?.status === 401) {
      console.warn('[API] Authentication Link Terminated: Unauthorized Access.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Prevent recursive redirect if already on login page
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login?expired=true';
      }
    }

    if (import.meta.env.DEV) {
      console.error(`[API] Response Protocol Error: ${response?.status} | ${response?.data?.message || error.message}`);
    }

    return Promise.reject(error);
  }
);

export default api;
