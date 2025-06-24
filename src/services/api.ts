import axios, { AxiosError, AxiosResponse } from 'axios';

// Get API URL from environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_KEY = import.meta.env.VITE_API_KEY;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    ...(API_KEY ? { 'x-api-key': API_KEY } : {}),
  },
  timeout: 10000, // 10 seconds timeout
});

// Add a request interceptor to log requests
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle errors globally
api.interceptors.response.use(
  (response: AxiosResponse) => {
    if (import.meta.env.DEV) {
      console.log(`[API] Response ${response.status} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        url: error.config?.url,
        method: error.config?.method,
        data: error.response.data,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API Error: No response received', {
        url: error.config?.url,
        method: error.config?.method,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Error:', error.message);
    }
    return Promise.reject(error);
  }
);

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
  /**
   * Get all subscription plans
   * @returns {Promise<Array>} List of subscription plans
   */
  getAll: async () => {
    try {
      console.log('Fetching subscription plans from:', `${api.defaults.baseURL}/subscriptions`);
      const response = await api.get('/subscriptions');
      
      if (!response.data) {
        console.warn('No data in subscription plans response');
        return [];
      }
      
      console.log('Subscription plans response:', response.data);
      return {
        data: Array.isArray(response.data) ? response.data : [response.data],
        status: response.status,
        statusText: response.statusText,
        headers: response.headers
      };
    } catch (error) {
      console.error('Error in subscriptionAPI.getAll:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          baseURL: error.config?.baseURL
        }
      });
      throw error;
    }
  },
  
  /**
   * Get a single subscription plan by ID
   * @param {string} id - The subscription plan ID
   * @returns {Promise<Object>} Subscription plan details
   */
  getOne: async (id: string) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching subscription plan ${id}:`, error);
      throw error;
    }
  },
  
  /**
   * Create a new subscription
   * @param {Object} data - Subscription data
   * @returns {Promise<Object>} Created subscription details
   */
  create: async (data: any) => {
    try {
      const response = await api.post('/subscriptions', data);
      return response.data;
    } catch (error) {
      console.error('Error creating subscription:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
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
