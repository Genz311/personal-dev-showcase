import { create } from 'zustand';
import { authService } from '../services/authService';

interface User {
  id: string;
  email: string;
  username: string;
  displayName?: string;
}

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.login({ email, password });
      set({ 
        user: response.user, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch {
      set({ isLoading: false });
      throw error;
    }
  },

  register: async (email: string, username: string, password: string) => {
    set({ isLoading: true });
    try {
      const response = await authService.register({ email, username, password });
      set({ 
        user: response.user, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch {
      set({ isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await authService.logout();
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    } catch {
      // Even if logout fails on server, clear local state
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  checkAuth: async () => {
    if (!authService.isAuthenticated()) {
      set({ user: null, isAuthenticated: false });
      return;
    }

    set({ isLoading: true });
    try {
      const user = await authService.getCurrentUser();
      set({ 
        user, 
        isAuthenticated: true,
        isLoading: false 
      });
    } catch {
      set({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      });
    }
  },

  setUser: (user: User | null) => {
    set({ 
      user, 
      isAuthenticated: !!user 
    });
  },
}));