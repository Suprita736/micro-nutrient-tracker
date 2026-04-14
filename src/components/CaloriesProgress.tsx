import { useTrackingStore } from "@/store/trackingStore";

interface CaloriesProgressProps {
  current?: number;
  required?: number;
}

export const CaloriesProgress = ({ current: propCurrent, required: propRequired }: CaloriesProgressProps) => {
  const getNutrientTotal = useTrackingStore((s) => s.getNutrientTotal);
  const getNutrientRequirement = useTrackingStore((s) => s.getNutrientRequirement);
  
  const current = propCurrent !== undefined ? propCurrent : getNutrientTotal("calories");
  const required = propRequired !== undefined ? propRequired : getNutrientRequirement("calories");
  
  // Guard against early render or blank profiles
  if (required === 0) return null;
  
  const percentage = Math.min(100, Math.max(0, (current / required) * 100));
  
  const radius = 70;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-card border border-border mb-8 shadow-sm">
      <h3 className="font-serif text-xl font-semibold text-foreground mb-8">Daily Calories</h3>
      
      <div className="relative flex items-center justify-center w-48 h-48">
        <svg className="w-full h-full transform -rotate-90 drop-shadow-md">
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-border"
          />
          <circle
            cx="96"
            cy="96"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center text-center">
          <span className="font-serif text-3xl font-bold text-foreground tracking-tight">{Math.round(current)}</span>
          <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em] mt-1">/ {Math.round(required)} kcal</span>
        </div>
      </div>
    </div>
  );
};
