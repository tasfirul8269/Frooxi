export const getToken = (): string | null => {
    return localStorage.getItem('token');
};

export const getUserRole = (): string | null => {
    return localStorage.getItem('userRole');
};

export const isAuthenticated = (): boolean => {
    const token = getToken();
    return !!token; // Returns true if token exists, false otherwise
};

export const isAdmin = (): boolean => {
    const role = getUserRole();
    return role === 'admin';
};

export const logout = (): void => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    // Optionally, redirect to login page
    window.location.href = '/admin/login';
};