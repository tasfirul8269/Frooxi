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

export interface ApiError {
  message: string;
  response: {
    data: any;
    status: number;
    headers: any;
  };
}

// Get a single user by ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const { data } = await api.get(`/users/${id}`);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to get user by ID: ${error.message}`);
  }
};

// Create a new user
export const createUser = async (userData: CreateUserData): Promise<User> => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw new Error(`Failed to create user: ${error.response.data.message}`);
    } else {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }
};

// Update a user
export const updateUser = async (id: string, userData: UpdateUserData): Promise<User> => {
  try {
    const { data } = await api.put(`/users/${id}`, userData);
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update user: ${error.message}`);
  }
};

// Delete a user
export const deleteUser = async (id: string): Promise<void> => {
  try {
    await api.delete(`/users/${id}`);
  } catch (error: any) {
    throw new Error(`Failed to delete user: ${error.message}`);
  }
};

// Update user status (active/inactive)
export const updateUserStatus = async (id: string, isActive: boolean): Promise<User> => {
  try {
    const { data } = await api.patch(`/users/${id}/status`, { isActive });
    return data;
  } catch (error: any) {
    throw new Error(`Failed to update user status: ${error.message}`);
  }
};

// Get all users
export const getUsers = async (): Promise<User[]> => {
  try {
    const { data } = await api.get('/users');
    // The backend returns { success: boolean, users: User[] }
    return Array.isArray(data?.users) ? data.users : [];
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return [];
  }
};
