import { Card } from "@/dojo/game/types/card";
import { Resource } from "@/dojo/game/types/resource";
import { Side } from "@/dojo/game/types/side";
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
  upgradeToShow: { card: Card; side1: Side; side2: Side } | null;
  resetUpgradeToShow: () => void;
  setUpgradeToShow: (card: Card, side1: Side, side2: Side) => void;
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
  upgradeToShow: null,
  resetUpgradeToShow: () => set({ upgradeToShow: null }),
  setUpgradeToShow: (card, side1, side2) =>
    set({ upgradeToShow: { card, side1, side2 } }),
  reset: () =>
    set({
      resources: 0,
      storage: false,
      costs: [],
      callback: () => {},
      upgradeToShow: null,
    }),
}));
