import { create } from 'zustand'

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false,
  setUser: (user) =>
    set(() => ({
      user,
      isAuthenticated: !!user,
      error: null,
    })),
  setLoading: (isLoading) => set(() => ({ isLoading })),
  setError: (error) => set(() => ({ error })),
}));
