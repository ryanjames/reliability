import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  userId: number | null;
  login: (id: number) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    set => ({
      userId: null,
      login: id => set({ userId: id }),
      logout: () => set({ userId: null }),
    }),
    {
      name: 'auth-storage',
    },
  ),
);
