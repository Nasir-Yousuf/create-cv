import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('novacv_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for centralized error formatting
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'An unexpected error occurred';

    // If 401 unauthorized on protected routes, can clear stale token
    if (error.response?.status === 401) {
      if (localStorage.getItem('novacv_token')) {
        localStorage.removeItem('novacv_token');
        localStorage.removeItem('novacv_user');
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default api;

