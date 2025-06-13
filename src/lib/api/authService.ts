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
  const { data } = await api.post('/users/login', credentials);
  return data;
};

export const getCurrentUser = async (): Promise<Omit<User, 'token'>> => {
  const { data } = await api.get('/users/profile');
  return data;
};

export const logout = (): void => {
  localStorage.removeItem('authToken');
  window.location.href = '/admin/login';
};

export const updateProfile = async (userData: Partial<User>): Promise<User> => {
  const { data } = await api.put('/users/profile', userData);
  return data;
};

export const changePassword = async (currentPassword: string, newPassword: string): Promise<void> => {
  await api.put('/users/profile/password', { currentPassword, newPassword });
};
