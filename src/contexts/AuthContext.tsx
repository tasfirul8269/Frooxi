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

  // Refresh the auth token
  const refreshToken = useCallback(async () => {
    if (isRefreshingToken) return;
    
    try {
      setIsRefreshingToken(true);
      const userData = await getCurrentUser();
      setUser(userData);
      
      // If we have a new token, update it
      const token = localStorage.getItem('authToken');
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      }
      
      // Schedule next refresh
      // Assuming token expires in 30 days (30 * 24 * 60 * 60 * 1000)
      scheduleTokenRefresh(Date.now() + 30 * 24 * 60 * 60 * 1000);
    } catch (error) {
      console.error('Token refresh failed:', error);
      // If refresh fails, log the user out
      await handleLogout();
    } finally {
      setIsRefreshingToken(false);
    }
  }, [isRefreshingToken]);

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
    }
  }, []);

  // Check for existing session on initial load
  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setLoading(false);
        // If we're not on the login page, redirect to login
        if (!location.pathname.includes('/admin/login') && location.pathname.startsWith('/admin')) {
          navigate('/admin/login', { 
            state: { from: location.pathname },
            replace: true
          });
        }
        return;
      }

      console.log('Checking authentication status...');
      const userData = await getCurrentUser();
      setUser(userData);
      
      // Schedule token refresh
      scheduleTokenRefresh(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
      
      // If we're on the login page but already authenticated, redirect to dashboard
      if (location.pathname === '/admin/login') {
        console.log('Already authenticated, redirecting to dashboard...');
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      await handleLogout();
      
      // If we're not on the login page and auth check fails, redirect to login
      if (!location.pathname.includes('/admin/login') && location.pathname.startsWith('/admin')) {
        navigate('/admin/login', { 
          state: { from: location.pathname },
          replace: true
        });
      }
    } finally {
      setLoading(false);
    }
  }, [navigate, location, handleLogout, scheduleTokenRefresh]);

  // Initialize auth check on mount
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

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
    login,
    logout,
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
