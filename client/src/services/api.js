import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  updateProfile: (userData) => api.put('/auth/profile', userData),
};

// Transactions API
export const transactionsAPI = {
  getAll: () => api.get('/transactions'),
  add: (transaction) => api.post('/transactions', transaction),
  update: (id, transaction) => api.put(`/transactions/${id}`, transaction),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Insights API
export const insightsAPI = {
  getSpendingInsights: () => api.get('/insights/spending'),
  getMonthlyData: () => api.get('/insights/monthly'),
  getYearlyComparison: () => api.get('/insights/yearly'),
  getCategories: () => api.get('/insights/categories'),
};

// Export utilities
export const exportAPI = {
  downloadPDF: (data) => api.post('/export/pdf', data),
  downloadCSV: (data) => api.post('/export/csv', data),
};

export default api;
