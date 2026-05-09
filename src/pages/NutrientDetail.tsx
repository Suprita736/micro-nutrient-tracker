import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { nutrients, getFoodsForNutrient, getNutrientSuggestions } from "@/data/nutrients";
import { useTrackingStore } from "@/store/trackingStore";
import { ArrowLeft, Search, Lightbulb } from "lucide-react";
import FoodCard from "@/components/FoodCard";

const NutrientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const nutrient = nutrients.find((n) => n.id === id);
  const [searchTerm, setSearchTerm] = useState("");

  let current = useTrackingStore((s) => (id ? s.getNutrientTotal(id) : 0));
  let required = useTrackingStore((s) => (id ? s.getNutrientRequirement(id) : 0));


  const foodQuantities = useTrackingStore((s) => s.foodQuantities);
  const country = useTrackingStore((s) => s.userProfile?.country);

  if (!nutrient || !id) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-muted-foreground">Nutrient not found.</p>
      </div>
    );
  }

  const relevantFoods = getFoodsForNutrient(id, country).filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const remaining = Math.max(0, required - current);
  const suggestions = remaining > 0 ? getNutrientSuggestions(id, remaining, foodQuantities, country) : [];

  const pct = required > 0 ? Math.min((current / required) * 100, 100) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-sans mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="bg-card border border-border p-6 mb-10 overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-card-foreground">
              {nutrient.name}
            </h1>
          </div>
          <div className="text-left md:text-right">
            <p className="font-sans text-lg font-medium text-foreground">
              {formatNum(current)}
              <span className="text-muted-foreground text-sm ml-1">
                / {formatNum(required)}
                {nutrient.unit}
              </span>
            </p>
          </div>
        </div>
        <div className="h-2 bg-progress-track w-full overflow-hidden">
          <div
            className={`h-full transition-all duration-700 ease-out ${current >= required ? "bg-[#2d4a6a]" : "bg-progress"
              }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="font-serif text-xl font-semibold text-foreground">
            Recommended Foods
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Add these to your daily log to meet your {nutrient.name} goals.
          </p>
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search foods..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 bg-background border border-border text-xs font-sans focus:outline-none focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {relevantFoods.length === 0 ? (
        <div className="py-12 bg-card border border-border border-dashed text-center mb-12">
          <p className="text-muted-foreground font-sans text-sm">
            {searchTerm ? "No foods match your search." : "No foods added yet. Use the + button to begin tracking."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {relevantFoods.map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              nutrientId={nutrient.id}
              nutrientUnit={nutrient.unit}
            />
          ))}
        </div>
      )}

      {remaining > 0 && suggestions.length > 0 && (
        <div className="mt-16 border-t border-border pt-12">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb size={20} className="text-primary/70" />
            <h2 className="font-serif text-xl font-semibold text-foreground italic">
              Suggestions to complete {nutrient.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {suggestions.map((s) => (
              <div key={s.food.id} className="bg-card border border-border p-4 flex items-center gap-4">
                <div className="w-12 h-12 bg-muted overflow-hidden flex-shrink-0">
                  <img
                    src={s.food.image}
                    alt={s.food.name}
                    className="w-full h-full object-cover opacity-80"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/64?text=Food")}
                  />
                </div>
                <div>
                  <h4 className="font-serif text-sm font-medium text-foreground">{s.food.name}</h4>
                  <p className="text-xs font-sans text-muted-foreground mt-0.5">
                    Add <span className="font-bold text-foreground">{formatNum(s.neededServings * s.food.minQuantity)}{s.food.id === 'egg' || s.food.id === 'banana' ? '' : 'g'}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

export default NutrientDetail;

