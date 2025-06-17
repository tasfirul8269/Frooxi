import api from './api';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  token: string;
}

export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    console.log('Attempting login with email:', credentials.email);
    const response = await api.post('/users/login', credentials);
    
    if (response.data.token) {
      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);
      
      // Set default auth header for future requests
      api.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
      
      console.log('Login successful, token stored');
      
      // Store user data in localStorage for initial page load
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify({
          _id: response.data.user._id,
          name: response.data.user.name,
          email: response.data.user.email,
          isAdmin: response.data.user.isAdmin
        }));
      }
      
      return response.data;
    } else {
      const errorMsg = 'Login successful but no token received';
      console.warn(errorMsg);
      throw new Error(errorMsg);
    }
  } catch (error) {
    const errorDetails = {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      code: error.code
    };
    
    console.error('Login error:', errorDetails);
    
    // Provide more specific error messages
    if (error.response?.status === 401) {
      throw new Error('Invalid email or password');
    } else if (!error.response) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else {
      throw new Error(error.response.data?.message || 'Login failed. Please try again.');
    }
  }
};

export const getCurrentUser = async (): Promise<Omit<User, 'token'>> => {
  try {
    // First try to get user from localStorage (for initial page load)
    const userFromStorage = localStorage.getItem('user');
    
    // If we have a user in localStorage, use it as a fallback while we fetch fresh data
    let fallbackUser = null;
    if (userFromStorage) {
      try {
        fallbackUser = JSON.parse(userFromStorage);
      } catch (e) {
        console.error('Error parsing user from localStorage:', e);
      }
    }
    
    // Try to fetch fresh user data
    try {
      const { data } = await api.get('/users/profile');
      
      // Update localStorage with fresh data
      if (data?.user) {
        localStorage.setItem('user', JSON.stringify({
          _id: data.user._id,
          name: data.user.name,
          email: data.user.email,
          isAdmin: data.user.isAdmin
        }));
      }
      
      return data.user || fallbackUser || null;
    } catch (error) {
      console.error('Error fetching user profile:', {
        message: error.message,
        status: error.response?.status,
        code: error.code
      });
      
      // If we have a fallback user, return it
      if (fallbackUser) {
        console.warn('Using fallback user data from localStorage');
        return fallbackUser;
      }
      
      // If it's a 401, clear the token and redirect to login
      if (error.response?.status === 401) {
        localStorage.removeItem('authToken');
        delete api.defaults.headers.common['Authorization'];
        window.location.href = '/admin/login';
      }
      
      throw error;
    }
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

export const logout = async (redirectToLogin: boolean = true): Promise<void> => {
  try {
    // Clear all user-related data from localStorage
    const itemsToRemove = [
      'authToken',
      'user',
      'session',
      'token',
      'refreshToken',
      'authState'
    ];
    
    itemsToRemove.forEach(item => localStorage.removeItem(item));
    
    // Clear any stored cookies
    document.cookie.split(';').forEach(cookie => {
      const [name] = cookie.trim().split('=');
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    
    // Remove the auth header
    delete api.defaults.headers.common['Authorization'];
    
    console.log('User logged out successfully');
    
    // Optional: Call the backend to invalidate the token
    try {
      await api.post('/users/logout');
    } catch (err) {
      console.warn('Logout API call failed, but continuing with client-side cleanup', err);
    }
    
    // Clear any service worker caches
    if ('caches' in window) {
      caches.keys().then(cacheNames => {
        cacheNames.forEach(cacheName => {
          caches.delete(cacheName);
        });
      }).catch(err => {
        console.warn('Error clearing caches:', err);
      });
    }
    
    // Force a full page reload to clear any application state
    if (redirectToLogin) {
      window.location.href = '/admin/login';
      // Force a hard reload to ensure all state is cleared
      window.location.reload();
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Still redirect even if there's an error
    if (redirectToLogin) {
      window.location.href = '/admin/login';
    }
  }
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  try {
    console.log('Updating user profile with data:', userData);
    const { data } = await api.put('/users/profile', userData);
    
    // Update the stored user data if the update was successful
    if (data?.user) {
      localStorage.setItem('user', JSON.stringify({
        _id: data.user._id,
        name: data.user.name,
        email: data.user.email,
        isAdmin: data.user.isAdmin
      }));
      console.log('User profile updated successfully');
    }
    
    return data.user;
  } catch (error) {
    console.error('Error updating profile:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      throw new Error('Session expired. Please log in again.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid data provided');
    } else if (!error.response) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else {
      throw new Error(error.response.data?.message || 'Failed to update profile');
    }
  }
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  try {
    console.log('Attempting to change password');
    await api.put('/users/profile/password', { currentPassword, newPassword });
    console.log('Password changed successfully');
  } catch (error) {
    console.error('Error changing password:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
    
    // Handle specific error cases
    if (error.response?.status === 401) {
      if (error.response.data?.message?.toLowerCase().includes('current password')) {
        throw new Error('The current password you entered is incorrect.');
      }
      throw new Error('Session expired. Please log in again.');
    } else if (error.response?.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid password format');
    } else if (!error.response) {
      throw new Error('Unable to connect to the server. Please check your internet connection.');
    } else {
      throw new Error(error.response.data?.message || 'Failed to change password');
    }
  }
};
