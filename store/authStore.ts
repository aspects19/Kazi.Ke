// store/authStore.ts
import { create } from 'zustand';

export type Role = 'worker' | 'employer';
type User = {
  id: string;
  name: string;
  role: Role;
  phone?: string;
  verified?: boolean;
  rating?: number;
  ratingsCount?: number;
};

type AuthState = {
  user: User | null;
  loading: boolean;
  setUser: (u: User | null) => void;
  setLoading: (b: boolean) => void;
};

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (u) => set({ user: u }),
  setLoading: (b) => set({ loading: b }),
}));
