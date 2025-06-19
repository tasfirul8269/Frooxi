import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  login as loginService, 
  getCurrentUser, 
  logout as logoutService, 
  User as ApiUser 
} from '@/lib/api/authService';
import api from '@/lib/api/api';

// How often to check if the token is about to expire (in milliseconds)
const TOKEN_EXPIRY_CHECK_INTERVAL = 5 * 60 * 1000; // 5 minutes
// How long before token expiry to trigger a refresh (in milliseconds)
const TOKEN_REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes

export interface User {
  _id: string;
  email: string;
  name: string;
  isAdmin: boolean;
  token?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setError: (error: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshingToken, setIsRefreshingToken] = useState<boolean>(false);
  const refreshTimeoutRef = useRef<NodeJS.Timeout>();
  const navigate = useNavigate();
  const location = useLocation();

  // Clear any existing timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
    };
  }, []);

  // Schedule token refresh check
  const scheduleTokenRefresh = useCallback((expiresIn: number) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    // Calculate when to refresh the token (10 minutes before expiry)
    const refreshTime = expiresIn - TOKEN_REFRESH_THRESHOLD - Date.now();
    
    if (refreshTime > 0) {
      refreshTimeoutRef.current = setTimeout(() => {
        refreshToken();
      }, refreshTime);
    }
  }, []);

  // Handle logout logic
  const handleLogout = useCallback(async (redirectToLogin: boolean = true) => {
    try {
      await logoutService(redirectToLogin);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      if (refreshTimeoutRef.current) {
        clearTimeout(refreshTimeoutRef.current);
      }
      // Only clear local storage if we're actually logging out
      if (redirectToLogin) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Refresh the auth token
  const refreshToken = useCallback(async () => {
    if (isRefreshingToken || !user) return;
    
    try {
      setIsRefreshingToken(true);
      const userData = await getCurrentUser();
      
      if (userData) {
        setUser(userData);
        const token = localStorage.getItem('authToken');
        if (token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        scheduleTokenRefresh(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      await handleLogout();
    } finally {
      setIsRefreshingToken(false);
    }
  }, [isRefreshingToken, user, handleLogout, scheduleTokenRefresh]);

  // Check for existing session on initial load - simplified
  const checkAuth = useCallback(async () => {
    console.log('checkAuth called');
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.log('No token found');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      console.log('Fetching current user...');
      const userData = await getCurrentUser();
      
      if (userData) {
        console.log('User found:', userData.email);
        setUser(userData);
        
        // If we're on the login page, redirect to dashboard
        if (location.pathname === '/admin/login') {
          console.log('Redirecting to dashboard...');
          navigate('/admin/dashboard', { replace: true });
        }
      } else {
        console.log('No user data received');
        await handleLogout(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await handleLogout(false);
    } finally {
      setLoading(false);
    }
  }, [navigate, location, handleLogout]);

  // Get token for dependency array
  const token = localStorage.getItem('authToken');

  // Initialize auth check on mount or when token changes
  useEffect(() => {
    checkAuth();
  }, [checkAuth, token]);

  // Handle login
  const login = async (email: string, password: string): Promise<User> => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Attempting login...');
      const userData = await loginService({ email, password });
      setUser(userData);
      
      // Schedule token refresh
      scheduleTokenRefresh(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      // Get the redirect path from location state or default to dashboard
      const from = location.state?.from?.pathname || '/admin/dashboard';
      console.log('Login successful, redirecting to:', from);
      
      // Use replace: true to prevent going back to login page with browser back button
      navigate(from, { replace: true });
      
      return userData;
    } catch (error: any) {
      console.error('Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials and try again.';
      setError(errorMessage);
      throw error; // Re-throw to allow form to handle the error
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const logout = async () => {
    setLoading(true);
    try {
      await handleLogout();
      
      // Clear local state
      setUser(null);
      setUser(null);
      
      // Redirect to login page with current location for post-login redirect
      navigate('/admin/login', { 
        state: { from: location.pathname },
        replace: true 
      });
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, we still want to clear local state
      localStorage.removeItem('authToken');
      setUser(null);
      navigate('/admin/login', { replace: true });
    } finally {
      setLoading(false);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = {
    user,
    loading,
    error,
    token: user?.token || null,
    login,
    logout: handleLogout,
    setError,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
