import { Resource } from "@/dojo/game/types/resource";
import { create } from "zustand";

interface GameState {
  resources: number;
  setResources: (resources: number) => void;
  storage: boolean;
  setStorage: (storageModal: boolean) => void;
  costs: Resource[];
  setCosts: (costs: Resource[]) => void;
  callback: (resources: number) => void;
  setCallback: (callback: (resources: number) => void) => void;
  reset: () => void;
}

export const useGameStore = create<GameState>()((set, get) => ({
  resources: 0,
  setResources: (resources) => set({ resources }),
  storage: false,
  setStorage: (storage) => set({ storage }),
  costs: [],
  setCosts: (costs) => set({ costs }),
  callback: () => {},
  setCallback: (callback) => set({ callback }),
  reset: () =>
    set({ resources: 0, storage: false, costs: [], callback: () => {} }),
}));
