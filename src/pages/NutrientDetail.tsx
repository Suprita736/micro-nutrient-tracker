import { useParams, Link } from "react-router-dom";
import { nutrients, getFoodsForNutrient, foods } from "@/data/nutrients";
import { useTrackingStore } from "@/store/trackingStore";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { ArrowLeft } from "lucide-react";

const NutrientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const nutrient = nutrients.find((n) => n.id === id);
  const relevantFoods = id ? getFoodsForNutrient(id) : [];
  const foodLog = useTrackingStore((s) => s.foodLog);
  const addFood = useTrackingStore((s) => s.addFood);

  const getNutrientCurrent = () => {
    if (!id) return 0;
    let total = 0;
    for (const food of foods) {
      const qty = foodLog[food.id] ?? 0;
      total += (food.nutrients[id] ?? 0) * qty;
    }
    return total;
  };

  if (!nutrient) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10">
        <p className="text-muted-foreground">Nutrient not found.</p>
      </div>
    );
  }

  const current = getNutrientCurrent();
  const pct = Math.min((current / nutrient.dailyRequired) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-sans mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="bg-card border border-border p-6 mb-8">
        <h1 className="font-serif text-2xl font-semibold text-card-foreground mb-1">
          {nutrient.name}
        </h1>
        <p className="font-sans text-sm text-muted-foreground mb-4">
          {formatNum(current)}
          {nutrient.unit} / {formatNum(nutrient.dailyRequired)}
          {nutrient.unit}
        </p>
        <div className="h-2 bg-progress-track w-full">
          <div
            className="h-full bg-progress transition-all duration-700 ease-out"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
        Foods
      </h2>

      <div className="space-y-3">
        {relevantFoods.map((food) => (
          <FoodCard
            key={food.id}
            food={food}
            nutrientId={nutrient.id}
            nutrientUnit={nutrient.unit}
            quantity={foodLog[food.id] ?? 0}
            onAdd={(qty) => addFood(food.id, qty)}
          />
        ))}
      </div>
    </div>
  );
};

const FoodCard = ({
  food,
  nutrientId,
  nutrientUnit,
  quantity,
  onAdd,
}: {
  food: ReturnType<typeof getFoodsForNutrient>[0];
  nutrientId: string;
  nutrientUnit: string;
  quantity: number;
  onAdd: (qty: number) => void;
}) => {
  const [localQty, setLocalQty] = useState(0);
  const nutrientAmount = food.nutrients[nutrientId] ?? 0;

  return (
    <div className="bg-card border border-border p-4 flex gap-4 items-start">
      <div className="w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-muted overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-serif text-base font-semibold text-card-foreground">
          {food.name}
        </h3>
        <p className="text-xs text-muted-foreground font-sans mt-0.5">
          Minimum {food.minDailyQuantity}
        </p>
        <p className="text-xs text-muted-foreground font-sans mt-0.5">
          {nutrientAmount}
          {nutrientUnit} per serving
        </p>
        <div className="flex items-center gap-2 mt-3">
          <Button
            variant="quantity"
            size="icon"
            className="h-8 w-8"
            onClick={() => setLocalQty(Math.max(0, localQty - 1))}
          >
            −
          </Button>
          <span className="w-8 text-center text-sm font-sans text-foreground">
            {localQty}
          </span>
          <Button
            variant="quantity"
            size="icon"
            className="h-8 w-8"
            onClick={() => setLocalQty(localQty + 1)}
          >
            +
          </Button>
          <Button
            variant="default"
            size="sm"
            className="ml-2"
            onClick={() => {
              onAdd(quantity + localQty);
              setLocalQty(0);
            }}
            disabled={localQty === 0}
          >
            Add to log
          </Button>
        </div>
      </div>
    </div>
  );
};

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

export default NutrientDetail;
