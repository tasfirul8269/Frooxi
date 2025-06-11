import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user: {
    id: string;
    role: string;
  };
  exp: number;
}

export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getUserRole = (): string | null => {
    return localStorage.getItem('userRole');
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    if (!token) return false;

    try {
        const decoded = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (decoded.exp < currentTime) {
            // Clear expired token
            logout();
            return false;
        }

        return true;
    } catch (error) {
        // If token is invalid, clear it
        logout();
        return false;
    }
};

export const isAdmin = (): boolean => {
    const role = getUserRole();
    return role === 'admin';
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('username');
    // Optionally, redirect to login page
    window.location.href = '/admin/login';
};