import axios from 'axios';

/**
 * Axios instance with base URL and JWT interceptors.
 * Uses CRA proxy in development, deployed backend URL in production.
 */
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  headers: { 'Content-Type': 'application/json' }
});

// Inject JWT on every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('indialens_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// On 401 – clear token and redirect to login
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('indialens_token');
      localStorage.removeItem('indialens_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
