import api from './api';
import { User } from '../types';

export interface UpdateProfileData {
  name?: string;
  bio?: string;
  location?: string;
  website?: string;
  github?: string;
  twitter?: string;
  linkedin?: string;
  profileImage?: string;
}

export interface UpdateEmailData {
  email: string;
  password: string;
}

export interface UpdatePasswordData {
  currentPassword: string;
  newPassword: string;
}

export interface DeleteAccountData {
  password: string;
}

export interface UsersResponse {
  users: User[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const userService = {
  // Get current user profile
  getCurrentUser: async (): Promise<User> => {
    const response = await api.get('/users/me/profile');
    return response.data;
  },

  // Get user profile by ID
  getUserProfile: async (userId: string): Promise<User> => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileData): Promise<User> => {
    const response = await api.put('/users/me/profile', data);
    return response.data;
  },

  // Update email
  updateEmail: async (data: UpdateEmailData): Promise<User> => {
    const response = await api.put('/users/me/email', data);
    return response.data;
  },

  // Update password
  updatePassword: async (data: UpdatePasswordData): Promise<{ message: string }> => {
    const response = await api.put('/users/me/password', data);
    return response.data;
  },

  // Delete account
  deleteAccount: async (data: DeleteAccountData): Promise<{ message: string }> => {
    const response = await api.delete('/users/me', { data });
    return response.data;
  },

  // Get users list
  getUsers: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<UsersResponse> => {
    const response = await api.get('/users', { params });
    return response.data;
  }
};