import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/users/login', { email, password });
    return response.data;
  },
  register: async (name: string, email: string, password: string) => {
    const response = await api.post('/users/register', { name, email, password });
    return response.data;
  },
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (data: { name?: string; email?: string; password?: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },
};

// Portfolio API
export const portfolioAPI = {
  getAll: async () => {
    const response = await api.get('/portfolio');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/portfolio/${id}`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post('/portfolio', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await api.put(`/portfolio/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/portfolio/${id}`);
    return response.data;
  },
};

// Team API
export const teamAPI = {
  getAll: async () => {
    const response = await api.get('/team');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/team/${id}`);
    return response.data;
  },
  create: async (data: FormData) => {
    const response = await api.post('/team', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async (id: string, data: FormData) => {
    const response = await api.put(`/team/${id}`, data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/team/${id}`);
    return response.data;
  },
};

// Testimonial API
export const testimonialAPI = {
  getAll: async () => {
    const response = await api.get('/testimonials');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/testimonials/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/testimonials', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/testimonials/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/testimonials/${id}`);
    return response.data;
  },
};

// Subscription API
export const subscriptionAPI = {
  getAll: async () => {
    const response = await api.get('/subscriptions');
    return response.data;
  },
  getOne: async (id: string) => {
    const response = await api.get(`/subscriptions/${id}`);
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/subscriptions', data);
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/subscriptions/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/subscriptions/${id}`);
    return response.data;
  },
};

export default api;
