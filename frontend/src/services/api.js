import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://elimupath.onrender.com/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const parseResults = (smsText) => api.post('/parse-results', { smsText });
export const initiatePayment = (analysisId, phoneNumber) => api.post('/pay', { analysisId, phoneNumber });
export const getPaymentStatus = (analysisId) => api.get(`/payment-status/${analysisId}`);
export const getFullAnalysis = (analysisId) => api.get(`/analysis/${analysisId}`);
export const getAdminStats = () => api.get('/admin/stats');

export default api;
