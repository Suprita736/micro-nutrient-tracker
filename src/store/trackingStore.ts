import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserProfile, foods, calculateRequirement, nutrients } from "@/data/nutrients";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
interface FoodQuantities {
  [foodId: string]: number;
}

export interface HistoryEntry {
  userId: string;
  dateKey?: string;
  date: string;
  savedAt?: number;
  streakSnapshot?: number;
  nutrients: Record<string, { current: number; required: number; unit: string }>;
  foods: FoodQuantities;
}

interface TrackingState {
  userProfile: UserProfile | null;
  foodQuantities: FoodQuantities;
  history: HistoryEntry[];
  currentStreak: number;
  longestStreak: number;
  setHistory: (history: HistoryEntry[]) => void;
  setUserProfile: (profile: UserProfile) => void;
  updateProfile: (profile: UserProfile) => void;
  updateFoodQuantity: (foodId: string, quantity: number) => void;
  getCaloriesTotal: () => number;
  getNutrientTotal: (nutrientId: string) => number;
  getNutrientRequirement: (nutrientId: string) => number;
  saveDay: () => Promise<void>;
  migrateLegacyHistory: (userId: string) => void;
  reset: () => void;
  resetFoodQuantities: () => void;
  logout: () => void;
}

export const calculateStreak = (history: HistoryEntry[]): { currentStreak: number; longestStreak: number } => {
  if (!history.length) return { currentStreak: 0, longestStreak: 0 };

  const dates = Array.from(new Set(history.map(h => h.dateKey || format(new Date(h.date), "yyyy-MM-dd")))).sort().reverse();

  let tempStreak = 1;
  let currentStreak = 1;
  let longestStreak = 1;

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const mostRecent = dates[0];

  const todayDate = new Date(todayKey + "T00:00:00").getTime();
  const mostRecentDate = new Date(mostRecent + "T00:00:00").getTime();
  const diffToToday = Math.round((todayDate - mostRecentDate) / (1000 * 60 * 60 * 24));

  let currentStreakActive = diffToToday <= 1;

  for (let i = 1; i < dates.length; i++) {
    const prev = new Date(dates[i - 1] + "T00:00:00").getTime();
    const curr = new Date(dates[i] + "T00:00:00").getTime();
    const diff = Math.round((prev - curr) / (1000 * 60 * 60 * 24));

    if (diff === 1) {
      tempStreak++;
      if (currentStreakActive) {
        currentStreak++;
      }
    } else if (diff === 0) {
      continue;
    } else {
      tempStreak = 1;
      currentStreakActive = false;
    }

    longestStreak = Math.max(longestStreak, tempStreak);
  }

  if (diffToToday > 1) {
    currentStreak = 0;
  }

  return { currentStreak, longestStreak };
};

export const useTrackingStore = create<TrackingState>()(
  persist(
    (set, get) => ({
      userProfile: null,
      foodQuantities: {},
      history: [],
      currentStreak: 0,
      longestStreak: 0,
      setHistory: (history) => {
        const streaks = calculateStreak(history);
        set({ history, currentStreak: streaks.currentStreak, longestStreak: streaks.longestStreak });
      },
      setUserProfile: (profile) => set({ userProfile: profile }),
      updateProfile: (profile) => {
        // Reset progress when profile changes to avoid requirement mismatches
        set({ userProfile: profile });
        get().resetFoodQuantities();
      },
      updateFoodQuantity: (foodId, quantity) =>
        set((state) => ({
          foodQuantities: {
            ...state.foodQuantities,
            [foodId]: Math.max(0, quantity),
          },
        })),
      getCaloriesTotal: () => {
        const { foodQuantities } = get();
        let total = 0;
        foods.forEach((food) => {
          const qty = foodQuantities[food.id] ?? 0;
          total += (food.calories ?? 0) * qty;
        });
        return total;
      },
      getNutrientTotal: (nutrientId) => {
        const { foodQuantities } = get();
        let total = 0;
        foods.forEach((food) => {
          const qty = foodQuantities[food.id] ?? 0;
          total += (food.nutrients[nutrientId] ?? 0) * qty;
        });
        return total;
      },
      getNutrientRequirement: (nutrientId) => {
        const { userProfile } = get();
        return calculateRequirement(nutrientId, userProfile);
      },
      saveDay: async () => {
        try {
          const state = get();

          // 1. Get authenticated user
          const { data: { user }, error: authError } = await supabase.auth.getUser();
          if (authError || !user) {
            console.error("User not authenticated or auth error:", authError);
            return;
          }

          const { foodQuantities, getNutrientTotal, getNutrientRequirement } = state;

          // 2. Local date key
          const todayKey = format(new Date(), "yyyy-MM-dd");
          console.log("Saving day:", todayKey);

          // 3. Strict food selection check
          // allow save even if quantities are empty
          if (!foodQuantities) {
            console.warn("foodQuantities missing");
            return;
          }

          // 4. Manual snapshots (matching user expectation for state.totals/requirements)
          const totalsSnapshot: Record<string, { current: number; required: number; unit: string }> = {};
          nutrients.forEach((n) => {
            totalsSnapshot[n.id] = {
              current: getNutrientTotal(n.id),
              required: getNutrientRequirement(n.id),
              unit: n.unit,
            };
          });

          const requirementsSnapshot = totalsSnapshot; // In this app requirements are stored per entry

          const payload = {
            user_id: user.id,
            date: new Date(),
            date_key: todayKey,
            nutrient_totals: totalsSnapshot,
            requirements: requirementsSnapshot,
            foods: foodQuantities
          };

          console.log("Payload:", payload);

          // 5. Upsert to history table
          const { error: upsertError } = await supabase
            .from("history")
            .upsert(payload, {
              onConflict: "user_id,date_key"
            });

          if (upsertError) {
            console.error("Supabase save error:", upsertError);
            return;
          }

          console.log("Save successful");

          // 6. Reload history from Supabase
          const { data: historyData, error: fetchError } = await supabase
            .from("history")
            .select("*")
            .eq("user_id", user.id)
            .order("date", { ascending: false });

          if (fetchError || !historyData) {
            console.error("Refetch error:", fetchError);
            return;
          }

          // 7. Map to local interfaces
          const mappedHistory: HistoryEntry[] = historyData.map(item => ({
            userId: item.user_id,
            dateKey: item.date_key || format(new Date(item.date), "yyyy-MM-dd"),
            date: new Date(item.date).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "short",
              year: "numeric"
            }),
            nutrients: item.nutrient_totals,
            foods: item.foods || {}
          }));

          // 8. Recalculate streak
          const streakData = calculateStreak(mappedHistory);

          // 9. Update Zustand store
          set({
            history: mappedHistory,
            currentStreak: streakData.currentStreak,
            longestStreak: streakData.longestStreak,
            foodQuantities: {} // Reset day progress AFTER successful save
          });

          console.log("--- SaveDay Operation Completed Successfully ---");
        } catch (err) {
          console.error("FATAL ERROR in saveDay:", err);
        }
      },
      migrateLegacyHistory: (userId) => {
        set((state) => ({
          history: state.history.map((entry) => ({
            ...entry,
            userId: entry.userId || userId,
          })),
        }));
      },
      reset: () => set({ foodQuantities: {}, userProfile: null, currentStreak: 0, longestStreak: 0 }),
      resetFoodQuantities: () => set({ foodQuantities: {} }),
      logout: () => set({ userProfile: null, foodQuantities: {}, currentStreak: 0, longestStreak: 0 }),
    }),
    {
      name: "microtrack-storage",
    }
  )
);


