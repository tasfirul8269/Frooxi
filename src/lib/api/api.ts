import axios from 'axios';

// Create axios instance with base URL and default headers
const API_URL = import.meta.env.PROD 
  ? 'https://frooxi-backend.onrender.com/api' 
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

console.log('API Base URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true, // Important for sending cookies with CORS
  timeout: 15000, // Increased to 15 seconds
});

// Set initial auth token if exists
const token = localStorage.getItem('authToken');
if (token) {
  api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    // Skip adding token for login/register requests
    const isAuthRequest = config.url?.includes('/users/login') || 
                         config.url?.includes('/users/register');
    
    if (!isAuthRequest) {
      const token = localStorage.getItem('authToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    console.log(`[${new Date().toISOString()}] ${config.method?.toUpperCase()} ${config.url}`, {
      data: config.data,
      params: config.params
    });
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    console.log(`[${new Date().toISOString()}] Response ${response.status} ${response.config.url}`, {
      data: response.data
    });
    
    // Handle successful responses
    if (response.data?.token) {
      // If the response contains a token, store it
      localStorage.setItem('authToken', response.data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Log the error for debugging
    console.error('API Error:', {
      url: originalRequest?.url,
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      code: error.code,
      config: {
        method: originalRequest?.method,
        url: originalRequest?.url,
        data: originalRequest?.data,
        timeout: originalRequest?.timeout
      }
    });
    
    // Handle network errors
    if (error.code === 'ECONNABORTED' || !error.response) {
      const errorMessage = 'Request timeout. Please check your internet connection and try again.';
      console.error('Network error:', errorMessage);
      return Promise.reject(new Error(errorMessage));
    }
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      // If this is a failed login attempt, just reject
      if (originalRequest?.url?.includes('/users/login')) {
        return Promise.reject(error);
      }
      
      // For other 401 errors, clear auth and redirect to login
      localStorage.removeItem('authToken');
      delete api.defaults.headers.common['Authorization'];
      
      // Only redirect if not already on login page and not an API request
      if (window.location.pathname !== '/admin/login') {
        window.location.href = '/admin/login';
      }
      
      return Promise.reject(error);
    }
    
    // Handle server errors
    if (error.response?.status >= 500) {
      console.error('Server error:', error.response.data);
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    // For other errors, include the server's error message if available
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.error || 
                        error.message || 
                        'An error occurred. Please try again.';
    
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;
