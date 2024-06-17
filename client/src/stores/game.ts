import { create } from "zustand";

interface GameState {
  resources: number;
  setResources: (resources: number) => void;
}

export const useGameStore = create<GameState>()((set, get) => ({
  resources: 0,
  setResources: (resources) => set({ resources }),
}));
