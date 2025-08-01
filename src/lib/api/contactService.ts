import axios from 'axios';

// In production, use the production API URL
const API_URL = import.meta.env.PROD 
  ? 'https://frooxi-backend.onrender.com/api' 
  : import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const submitContactForm = async (formData: ContactFormData) => {
  try {
    const response = await axios.post(`${API_URL}/contacts/`, formData);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to send message');
    }
    throw new Error('Failed to send message');
  }
};

// Helper to get auth config with token
const getAuthConfig = () => {
  try {
    const token = localStorage.getItem('authToken');
    if (!token) {
      // Redirect to login or handle missing token
      window.location.href = '/admin/login';
      throw new Error('Authentication required');
    }
    
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      withCredentials: true // Important for sending cookies if using httpOnly cookies
    };
  } catch (error) {
    throw new Error('Authentication failed');
  }
};

// Function to check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('authToken');
  return !!token;
};

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginatedResponse<T> {
  docs: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export const getContactMessages = async ({
  page = 1,
  limit = 10,
  search = '',
  read,
}: {
  page?: number;
  limit?: number;
  search?: string;
  read?: boolean;
}) => {
  try {
    // First verify we have a token
    if (!isAuthenticated()) {
      // Redirect to login
      window.location.href = '/login';
      throw new Error('Authentication required');
    }

    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
      ...(read !== undefined && { read: read.toString() }),
    });
    
    const response = await axios.get<{ data: {
      docs: ContactMessage[];
      total: number;
      page: number;
      limit: number;
      pages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    } }>(
      `${API_URL}/contacts?${params}`,
      getAuthConfig()
    );
    
    return response.data.data;
  } catch (error) {
    // Handle 401 Unauthorized
    if (error.response?.status === 401) {
      // Clear any invalid token
      localStorage.removeItem('authToken');
      // Redirect to login
      window.location.href = '/login';
    }
    
    throw new Error(
      error.response?.data?.message || 
      error.message || 
      'Failed to fetch contact messages. Please try again.'
    );
  }
};

export const getContactMessage = async (id: string) => {
  try {
    const response = await axios.get<{ data: ContactMessage }>(
      `${API_URL}/contacts/${id}`,
      getAuthConfig()
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const deleteContactMessage = async (id: string) => {
  try {
    await axios.delete(`${API_URL}/contacts/${id}`, getAuthConfig());
  } catch (error) {
    throw error;
  }
};

export const toggleReadStatus = async (id: string) => {
  try {
    const response = await axios.patch<{ data: ContactMessage }>(
      `${API_URL}/contacts/${id}/read`,
      {},
      getAuthConfig()
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
