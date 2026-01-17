import axios from 'axios';
import { toast } from 'react-toastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds
});

// Request interceptor to add JWT token
axiosInstance.interceptors.request.use(
  (config) => {
    // Don't add token to auth endpoints (login, register, refresh)
    const isAuthEndpoint = config.url?.includes('/auth/login') ||
                          config.url?.includes('/auth/register') ||
                          config.url?.includes('/auth/refresh');

    if (!isAuthEndpoint) {
      const token = localStorage.getItem('superadmin_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration and errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized - Token expired or invalid
    if (error.response && error.response.status === 401) {
      // Only redirect if NOT on login page (to prevent refresh on wrong credentials)
      const isLoginPage = window.location.pathname === '/login';

      if (!isLoginPage) {
        localStorage.removeItem('superadmin_token');
        localStorage.removeItem('superadmin_user');

        // Show toast notification
        toast.error('Session expired. Please login again.', {
          position: 'top-right',
          autoClose: 3000,
        });

        // Redirect to login page
        window.location.href = '/login';
      }
      // If on login page, let the login component handle the error
    }

    // Handle 403 Forbidden - Insufficient permissions
    if (error.response && error.response.status === 403) {
      toast.error('Access denied. Insufficient permissions.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    // Handle 500 Internal Server Error
    if (error.response && error.response.status === 500) {
      toast.error('Server error. Please try again later.', {
        position: 'top-right',
        autoClose: 3000,
      });
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
