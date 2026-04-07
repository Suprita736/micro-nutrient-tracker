import { Link } from "react-router-dom";
import { nutrients, foods } from "@/data/nutrients";
import { useTrackingStore } from "@/store/trackingStore";

const Dashboard = () => {
  const foodLog = useTrackingStore((s) => s.foodLog);

  const getNutrientCurrent = (nutrientId: string) => {
    let total = 0;
    for (const food of foods) {
      const qty = foodLog[food.id] ?? 0;
      total += (food.nutrients[nutrientId] ?? 0) * qty;
    }
    return total;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <h1 className="font-serif text-3xl font-semibold text-foreground mb-8">
        Dashboard
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {nutrients.map((n) => {
          const current = getNutrientCurrent(n.id);
          const pct = Math.min((current / n.dailyRequired) * 100, 100);
          return (
            <Link
              key={n.id}
              to={`/nutrient/${n.id}`}
              className="bg-card border border-border p-5 transition-colors hover:border-foreground/20 block"
            >
              <h3 className="font-serif text-lg font-semibold text-card-foreground mb-1">
                {n.name}
              </h3>
              <p className="font-sans text-sm text-muted-foreground mb-3">
                {formatNum(current)}
                {n.unit} / {formatNum(n.dailyRequired)}
                {n.unit}
              </p>
              <div className="h-1.5 bg-progress-track w-full">
                <div
                  className="h-full bg-progress transition-all duration-700 ease-out"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

export default Dashboard;
