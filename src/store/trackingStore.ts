import { create } from "zustand";
import type { UserProfile } from "@/data/nutrients";

interface FoodLog {
  [foodId: string]: number; // quantity count
}

interface TrackingState {
  userProfile: UserProfile | null;
  foodLog: FoodLog;
  setUserProfile: (profile: UserProfile) => void;
  addFood: (foodId: string, quantity: number) => void;
  getFoodQuantity: (foodId: string) => number;
  resetLog: () => void;
}

export const useTrackingStore = create<TrackingState>((set, get) => ({
  userProfile: null,
  foodLog: {},
  setUserProfile: (profile) => set({ userProfile: profile }),
  addFood: (foodId, quantity) =>
    set((state) => ({
      foodLog: { ...state.foodLog, [foodId]: quantity },
    })),
  getFoodQuantity: (foodId) => get().foodLog[foodId] ?? 0,
  resetLog: () => set({ foodLog: {} }),
}));
