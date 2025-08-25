// src/store/uiStore.ts
import { create } from 'zustand';

type UIState = {
  activeTab: 'Jobs' | 'Applications' | 'Saved' | 'Profile';
  isLoading: boolean;
  isFilterModalOpen: boolean;
  theme: 'light' | 'dark';
};

type UIActions = {
  setActiveTab: (tab: UIState['activeTab']) => void;
  setLoading: (loading: boolean) => void;
  toggleFilterModal: () => void;
  toggleTheme: () => void;
};

export const useUIStore = create<UIState & UIActions>((set) => ({
  activeTab: 'Jobs',
  isLoading: false,
  isFilterModalOpen: false,
  theme: 'light',

  setActiveTab: (tab) => set({ activeTab: tab }),
  setLoading: (loading) => set({ isLoading: loading }),
  toggleFilterModal: () =>
    set((state) => ({ isFilterModalOpen: !state.isFilterModalOpen })),
  toggleTheme: () =>
    set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
}));
