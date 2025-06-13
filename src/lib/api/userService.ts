import api from './api';

export interface User {
  _id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  isActive?: boolean;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  isAdmin?: boolean;
  isActive?: boolean;
  password?: string;
}

// Get all users
export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get('/users');
  return data;
};

// Get a single user by ID
export const getUserById = async (id: string): Promise<User> => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};

// Create a new user
export const createUser = async (userData: CreateUserData): Promise<User> => {
  const { data } = await api.post('/users/register', userData);
  return data;
};

// Update a user
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  const { data } = await api.put(`/users/${id}`, userData);
  return data;
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  await api.delete(`/users/${id}`);
};

// Update user status (active/inactive)
export const updateUserStatus = async (id: string, isActive: boolean): Promise<User> => {
  const { data } = await api.patch(`/users/${id}/status`, { isActive });
  return data;
};
