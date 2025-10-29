// src/store/useUiStore.js
import { create } from "zustand";

export const useUiStore = create((set) => ({
  menuOpen: false,
  toggleMenu: () => set((s) => ({ menuOpen: !s.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  openMenu: () => set({ menuOpen: true }),
}));
