import { useTrackingStore } from "@/store/trackingStore";
import { Button } from "@/components/ui/button";
import { FoodItem } from "@/data/nutrients";

interface FoodCardProps {
  food: FoodItem;
  nutrientId?: string;
  nutrientUnit?: string;
}

const FoodCard = ({ food, nutrientId, nutrientUnit }: FoodCardProps) => {
  const quantity = useTrackingStore((s) => s.foodQuantities[food.id] ?? 0);
  const updateQuantity = useTrackingStore((s) => s.updateFoodQuantity);

  const nutrientAmount = nutrientId ? (food.nutrients[nutrientId] ?? 0) : null;
  const nutrientValue = nutrientAmount !== null ? nutrientAmount : 0;
  const totalNutrient = nutrientAmount !== null ? formatNum(nutrientAmount * quantity) : 0;

  return (
    <div className="bg-card border border-border p-4 flex gap-4 items-center h-fit">
      <div className="w-16 h-16 flex-shrink-0 bg-muted overflow-hidden">
        <img
          src={food.image}
          alt={food.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start gap-2 mb-1">
          <h4 className="font-serif text-base font-semibold text-card-foreground leading-tight truncate">
            {food.name}
          </h4>
          <span className="text-[10px] font-sans font-bold text-muted-foreground whitespace-nowrap">
            {nutrientValue}{nutrientUnit}
          </span>
        </div>

        <p className="text-[11px] text-muted-foreground font-sans mb-3">
          Per {food.minQuantity}{food.id === 'egg' || food.id === 'banana' ? ' unit' : 'g'}
        </p>

        <div className="flex items-center gap-3">
          <div className="flex items-center border border-border bg-background h-8">
            <button
              onClick={() => updateQuantity(food.id, quantity - 1)}
              className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors border-r border-border"
              aria-label="Decrease quantity"
              disabled={quantity === 0}
            >
              -
            </button>
            <span className="w-10 text-center text-xs font-sans font-medium">
              {quantity}
            </span>
            <button
              onClick={() => updateQuantity(food.id, quantity + 1)}
              className="w-8 h-full flex items-center justify-center hover:bg-muted transition-colors border-l border-border"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          <span className="text-[11px] font-sans text-muted-foreground italic">
            Total: {totalNutrient}{nutrientUnit}
          </span>
        </div>

        {food.maxQuantity && quantity >= (food.maxQuantity / food.minQuantity) && (
          <p className="text-[10px] text-muted-foreground/70 font-sans mt-2 italic animate-in fade-in slide-in-from-top-1 duration-300">
            Recommended max reached for today.
          </p>
        )}
      </div>
    </div>
  );
};

export default FoodCard;

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));
