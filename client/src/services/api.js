import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    let message = error.message || 'An unexpected error occurred';
    let parsedData = null;

    if (error.response?.data) {
      if (typeof error.response.data === 'object' && !(error.response.data instanceof Blob)) {
        parsedData = error.response.data;
        message = parsedData.message || parsedData.error || message;
      } else if (typeof Blob !== 'undefined' && error.response.data instanceof Blob) {
        try {
          const text = await error.response.data.text();
          parsedData = JSON.parse(text);
          message = parsedData.message || parsedData.error || message;
        } catch (e) {
          // Retain default error message when non-JSON blob error occurs
        }
      }
    }

    const status = error.response?.status;
    const reqUrl = String(error.config?.url || '');
    const isAuthAttempt = reqUrl.includes('/auth/login') || reqUrl.includes('/auth/register');

    if (status === 401 && !isAuthAttempt) {
      localStorage.removeItem('novacv_token');
      localStorage.removeItem('novacv_user');
    }

    const wrapped = new Error(message);
    wrapped.status = status;
    wrapped.code = parsedData?.code;
    wrapped.entitlements = parsedData?.entitlements;
    wrapped.data = parsedData;
    wrapped.response = error.response;
    return Promise.reject(wrapped);
  }
);

export default api;
