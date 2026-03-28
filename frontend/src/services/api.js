import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Response interceptor for handling 401 errors
// Exclude /auth/me so the AuthContext session-check doesn't trigger a redirect loop
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isSessionCheck = error.config?.url?.includes('/auth/me');
    if (error.response?.status === 401 && !isSessionCheck) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
