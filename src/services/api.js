import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000/api'; // Update with your backend URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const sweetsAPI = {
  getAll: () => api.get('/sweets'),
  getById: (id) => api.get(`/sweets/${id}`),
  create: (sweetData) => api.post('/sweets', sweetData),
  update: (id, sweetData) => api.put(`/sweets/${id}`, sweetData),
  delete: (id) => api.delete(`/sweets/${id}`)
};

export default api;
