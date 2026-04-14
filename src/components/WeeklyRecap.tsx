import { useRef } from "react";
import { useTrackingStore } from "@/store/trackingStore";
import { nutrients } from "@/data/nutrients";
import { shareWeeklyReport } from "@/lib/shareWeeklyReport";
import { Button } from "@/components/ui/button";

export const WeeklyRecap = () => {
    const history = useTrackingStore((s) => s.history);
    const recapRef = useRef<HTMLDivElement>(null);
    
    if (history.length === 0) return null;
    
    const last7 = history.slice(0, 7);
    
    let totalScore = 0;
    let counts = 0;
    
    const nutrientAverages: Record<string, { sum: number; reqSum: number; days: number }> = {};
    
    nutrients.forEach(n => {
        if (n.id === 'calories') return;
        nutrientAverages[n.id] = { sum: 0, reqSum: 0, days: 0 };
    });
    
    last7.forEach(entry => {
        Object.keys(entry.nutrients).forEach(nId => {
            if (nId === 'calories' || !nutrientAverages[nId]) return;
            const cur = entry.nutrients[nId].current;
            const req = entry.nutrients[nId].required;
            if (req > 0) {
               nutrientAverages[nId].sum += cur;
               nutrientAverages[nId].reqSum += req;
               nutrientAverages[nId].days += 1;
            }
        });
    });
    
    const ratios: { id: string; name: string; ratio: number }[] = [];
    
    nutrients.forEach(n => {
        if (n.id === 'calories') return;
        const data = nutrientAverages[n.id];
        if (data && data.days > 0 && data.reqSum > 0) {
            const ratio = (data.sum / data.reqSum) * 100;
            ratios.push({ id: n.id, name: n.name, ratio: Math.min(100, ratio) });
            totalScore += ratio;
            counts += 1;
        }
    });
    
    const avgScore = counts > 0 ? Math.min(100, Math.round(totalScore / counts)) : 0;
    ratios.sort((a, b) => b.ratio - a.ratio);
    
    const topNutrient = ratios.length > 0 ? ratios[0] : null;
    const worstNutrient = ratios.length > 1 ? ratios[ratios.length - 1] : null;
    
    return (
        <div className="mb-10 w-full max-w-lg mx-auto">
          <div 
            ref={recapRef} 
            className="bg-card border border-border p-8 flex flex-col items-center text-center shadow-md relative overflow-hidden"
          >
            {/* Subtle aesthetic background stripe for luxury feel */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50"></div>
            
            <h3 className="font-serif text-xl font-semibold text-foreground mb-1 tracking-wide">Weekly Nutrition Summary</h3>
            <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-muted-foreground mb-8">MicroTrack Report</p>
            
            <div className="text-5xl font-serif font-bold text-primary mb-3">{avgScore}%</div>
            <div className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.2em] mb-8 border-b border-border pb-8 w-full">Overall Score</div>
            
            <div className="w-full flex justify-between px-4">
              <div className="flex flex-col items-center w-1/2">
                 <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-3">Top Nutrient</span>
                 <span className="font-serif text-lg font-medium text-foreground">{topNutrient ? topNutrient.name : '-'}</span>
              </div>
              <div className="w-px bg-border h-12 mx-2 self-center"></div>
              <div className="flex flex-col items-center w-1/2">
                 <span className="font-sans text-[10px] text-muted-foreground uppercase tracking-[0.1em] mb-3">Needs Work</span>
                 <span className="font-serif text-lg font-medium text-foreground">{worstNutrient ? worstNutrient.name : '-'}</span>
              </div>
            </div>
          </div>
          
          <Button 
            className="w-full mt-4 rounded-none font-sans uppercase tracking-[0.15em] text-xs h-12 hover:bg-primary hover:text-primary-foreground transition-all duration-300" 
            variant="hero"
            onClick={() => shareWeeklyReport(recapRef.current)}
          >
            Export/Share Weekly Recap
          </Button>
        </div>
    );
};
