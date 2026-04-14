import { useMemo } from "react";
import { HistoryEntry } from "@/store/trackingStore";
import { nutrients as allNutrients, getFoodsForNutrient } from "@/data/nutrients";

interface DeficiencyInsightsProps {
  history: HistoryEntry[];
  country?: string;
}

const DeficiencyInsights = ({ history, country }: DeficiencyInsightsProps) => {
  const insights = useMemo(() => {
    if (history.length === 0) return [];

    const stats: Record<string, { count: number; nutrientName: string; nutrientId: string }> = {};
    
    // Take last 7 entries
    const recent = history.slice(0, 7);
    
    allNutrients.forEach(n => {
      let lowCount = 0;
      recent.forEach(entry => {
        const snap = entry.nutrients[n.id];
        if (snap) {
          const pct = snap.required > 0 ? (snap.current / snap.required) : 0;
          if (pct < 0.8) {
            lowCount++;
          }
        }
      });
      
      if (lowCount >= 4) {
        stats[n.id] = { count: lowCount, nutrientName: n.name, nutrientId: n.id };
      }
    });

    return Object.values(stats);
  }, [history]);

  if (insights.length === 0) return null;

  // Group food suggestions to avoid duplication
  const allSuggestedFoods = new Map<string, string>();
  insights.forEach(insight => {
    const foods = getFoodsForNutrient(insight.nutrientId, country).slice(0, 2);
    foods.forEach(f => {
      allSuggestedFoods.set(f.id, f.name);
    });
  });

  const uniqueFoods = Array.from(allSuggestedFoods.values()).slice(0, 5);

  return (
    <div className="bg-card border-l-2 border-primary border-y border-r p-6 mb-10">
      <h2 className="font-serif text-xl font-semibold text-foreground mb-4">Nutrition Insights</h2>
      <div className="space-y-3">
        {insights.map((insight) => (
          <p key={insight.nutrientId} className="text-sm font-sans text-muted-foreground">
            <span className="text-foreground font-medium">Low {insight.nutrientName}</span> on {insight.count} of last {Math.min(history.length, 7)} days.
          </p>
        ))}
        
        {uniqueFoods.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-xs font-sans text-muted-foreground uppercase tracking-widest mb-2 font-semibold">Consider increasing:</p>
            <div className="flex flex-wrap gap-2">
              {uniqueFoods.map(foodName => (
                <span key={foodName} className="text-sm font-serif italic text-primary">
                  {foodName}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeficiencyInsights;
