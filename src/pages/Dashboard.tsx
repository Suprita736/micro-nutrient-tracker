import { Link } from "react-router-dom";
import { nutrients, calculateCaloriesRequirement } from "@/data/nutrients";
import { useTrackingStore, type HistoryEntry } from "@/store/trackingStore";
import { CheckCircle2, History, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { format } from "date-fns";
import { CaloriesProgress } from "@/components/CaloriesProgress";
import { SmartFoodLogger } from "@/components/smart-logging/SmartFoodLogger";
import SupplementCard from "@/components/SupplementCard";
import { supplements } from "@/data/supplements";
const Dashboard = () => {
  const getNutrientTotal = useTrackingStore((s) => s.getNutrientTotal);
  const getNutrientRequirement = useTrackingStore((s) => s.getNutrientRequirement);
  const getCaloriesTotal = useTrackingStore((s) => s.getCaloriesTotal);
  const userProfile = useTrackingStore((s) => s.userProfile);
  const foodQuantities = useTrackingStore((s) => s.foodQuantities);
  const saveDay = useTrackingStore((s) => s.saveDay);
  const setHistory = useTrackingStore((s) => s.setHistory);
  const supplementsState = useTrackingStore((s) => s.supplements);

  const hasFoods = Object.values(foodQuantities)
    .some((q) => q > 0);

  const hasSupplements = Object.values(supplementsState)
    .some((q) => q > 0);

  const hasProgress = hasFoods || hasSupplements;

  useEffect(() => {

    async function loadHistoryFromSupabase() {

      const { data: userData } = await supabase.auth.getUser();

      if (!userData.user) return;

      const { data, error } = await supabase

        .from("history")

        .select("*")

        .eq("user_id", userData.user.id)

        .order("date", { ascending: false });

      if (error) {

        console.error(error);

        return;

      }

      if (data) {

        const formattedHistory: HistoryEntry[] = data.map(item => ({
          userId: item.user_id,
          dateKey: item.date_key || format(new Date(item.date), "yyyy-MM-dd"),
          date: new Date(item.date).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric"
          }),
          nutrients: item.nutrient_totals,
          foods: item.foods || {},
          supplements: item.supplements || {},
        }));

        setHistory(formattedHistory);

      }

    }

    loadHistoryFromSupabase();

  }, []);
  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10 pb-20">
      <div className="mb-10 text-center md:text-left">
        <h1 className="font-serif text-3xl font-semibold text-foreground">
          Your Progress
        </h1>
        <p className="text-muted-foreground font-sans mt-1">
          Tracking your daily micronutrient intake for optimal health.
        </p>
      </div>

      <CaloriesProgress
        current={getCaloriesTotal()}
        required={calculateCaloriesRequirement(userProfile)}
      />

      <SmartFoodLogger />

      {!hasProgress && (
        <div className="mb-10 py-10 bg-card border border-border border-dashed text-center">
          <p className="text-muted-foreground font-sans">
            Start adding foods to track your nutrient intake.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-16">
        {nutrients.filter(n => n.id !== "calories").map((n) => {
          let current = getNutrientTotal(n.id);

          // Convert mg → g for omega3 display
          const required = getNutrientRequirement(n.id);
          const pct = required > 0 ? Math.min((current / required) * 100, 100) : 0;
          const isCompleted = required > 0 && current >= required;

          return (
            <Link
              key={n.id}
              to={`/nutrient/${n.id}`}
              className="bg-card border border-border p-5 transition-all hover:shadow-md hover:border-foreground/20 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-serif text-lg font-semibold text-card-foreground">
                    {n.name}
                  </h3>
                  {isCompleted && (
                    <CheckCircle2 size={16} className="text-primary/70" />
                  )}
                </div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-sans font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  View Detail
                </span>
              </div>

              <div className="mb-4">
                <p className="font-sans text-xl font-medium text-foreground flex items-center gap-1">
                  {formatNum(current)}
                  <span className="text-muted-foreground text-xs font-normal">
                    / {formatNum(required)}{n.unit}
                  </span>
                  {isCompleted && (
                    <span className="text-[10px] font-sans font-bold uppercase tracking-tighter text-primary/70 ml-1">
                      ✓
                    </span>
                  )}
                </p>
              </div>

              <div className="h-1 bg-progress-track w-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-700 ease-out ${isCompleted ? "bg-[#2d4a6a]" : "bg-progress"
                    }`}
                  style={{ width: `${pct}%` }}
                />
              </div>

              {/* Subtle background highlight for completed state */}
              {isCompleted && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-primary/5 rounded-bl-full pointer-events-none" />
              )}
            </Link>
          );
        })}
      </div>
      <div className="mb-16">
        <h2 className="font-serif text-2xl font-semibold mb-6">
          Supplements
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {supplements.map((supplement) => (
            <SupplementCard
              key={supplement.id}
              supplement={supplement}
            />
          ))}
        </div>
      </div>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-border pt-12">
        <Button
          variant="hero"
          size="lg"
          onClick={async () => await saveDay()}
          className="min-w-[180px] group"
          disabled={!hasProgress}
        >
          <Save size={18} className="mr-2 group-hover:scale-110 transition-transform" />
          Save Day
        </Button>
        <Link to="/history">
          <Button
            variant="outline"
            size="lg"
            className="min-w-[180px] border-primary/20 text-primary hover:bg-primary/5"
          >
            <History size={18} className="mr-2" />
            View History
          </Button>
        </Link>
      </div>
    </div>
  );
};

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

export default Dashboard;


