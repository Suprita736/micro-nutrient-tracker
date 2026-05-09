import { useTrackingStore } from "@/store/trackingStore";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Download } from "lucide-react";
import { nutrients as allNutrients } from "@/data/nutrients";
import { useEffect, useMemo } from "react";
import WeeklyChart from "@/components/WeeklyChart";
import DeficiencyInsights from "@/components/DeficiencyInsights";
import { generateNutritionReport } from "@/lib/pdfReport";
import { Button } from "@/components/ui/button";
import { WeeklyRecap } from "@/components/WeeklyRecap";

const NutritionHistory = () => {
  const history = useTrackingStore((s) => s.history);
  const userProfile = useTrackingStore((s) => s.userProfile);
  const currentStreak = useTrackingStore((s) => s.currentStreak);
  const migrateLegacyHistory = useTrackingStore((s) => s.migrateLegacyHistory);

  useEffect(() => {
    if (userProfile?.id) {
      migrateLegacyHistory(userProfile.id);
    }
  }, [userProfile?.id, migrateLegacyHistory]);

  const userHistory = history.filter((entry) => entry.userId === userProfile?.id);

  const chartData = useMemo(() => {
    // Take last 7 saved days and reverse to show oldest first
    const last7 = userHistory.slice(0, 7).reverse();
    return last7.map(entry => {
      const percentages = Object.values(entry.nutrients).map(n =>
        n.required > 0 ? Math.min((n.current / n.required), 1) : 0
      );
      const avg = percentages.length > 0
        ? (percentages.reduce((a, b) => a + b, 0) / percentages.length) * 100
        : 0;

      return {
        date: entry.date.split(' ')[0] + ' ' + entry.date.split(' ')[1], // Shorten date
        score: Math.round(avg)
      };
    });
  }, [userHistory]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground font-sans mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10 gap-4">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-foreground">
            Your History
          </h1>
          <p className="text-muted-foreground font-sans mt-1 mb-4">
            Review your past daily nutritional achievements.
          </p>
          {currentStreak > 0 ? (
            <div className="inline-flex items-center px-3 py-1 bg-primary/10 border border-primary/20 text-primary text-xs tracking-wider uppercase font-sans font-medium">
              🔥 {currentStreak} day streak
            </div>
          ) : (
            <div className="inline-flex items-center px-3 py-1 bg-border/50 text-muted-foreground text-xs uppercase tracking-wider font-sans italic">
              Log daily to maintain your streak
            </div>
          )}
        </div>
        {userHistory.length > 0 && (
          <Button
            variant="outline"
            onClick={() => generateNutritionReport(userProfile, userHistory)}
            className="rounded-none border-primary/20 text-primary hover:bg-primary/5 h-9 text-xs font-sans tracking-wide uppercase font-semibold gap-2"
          >
            <Download size={14} />
            Export Report
          </Button>
        )}
      </div>

      <WeeklyRecap />

      {userHistory.length > 0 && (
        <>
          <WeeklyChart data={chartData} />
          <DeficiencyInsights history={userHistory} country={userProfile?.country} />
        </>
      )}

      {userHistory.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border border-dashed">
          <p className="text-muted-foreground font-sans">No saved history yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userHistory.map((entry, idx) => (
            <div key={idx} className="bg-card border border-border p-6 flex flex-col h-full">
              <div className="flex justify-between items-start mb-6">
                <h3 className="font-serif text-xl font-medium text-foreground italic">
                  {entry.date}
                </h3>
              </div>

              <div className="space-y-4 flex-1">
                {allNutrients.map((n) => {
                  if (n.id === "calories") return null;
                  const snap = entry.nutrients[n.id];
                  let current = snap.current;

                  if (n.id === "omega3" && current > 50) {
                    current = current / 1000;
                  }

                  if (n.id === "vitaminD" && current > 100) {
                    current = current / 40;
                  }
                  if (!snap) return null;
                  const pct = snap.required > 0 ? Math.min((current / snap.required) * 100, 100) : 0;
                  const isCompleted = current >= snap.required;

                  return (
                    <div key={n.id}>
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-sans font-medium text-muted-foreground">
                            {n.name}
                          </span>
                          {isCompleted && (
                            <CheckCircle2 size={10} className="text-primary/70" />
                          )}
                        </div>
                        <span className="text-[10px] font-sans text-muted-foreground">
                          {formatNum(current)}{snap.unit} / {formatNum(snap.required)}{snap.unit}
                        </span>
                      </div>
                      <div className="h-1 bg-progress-track w-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-700 ease-out ${isCompleted ? "bg-[#2d4a6a]" : "bg-progress"
                            }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const formatNum = (n: number) => (Number.isInteger(n) ? n : n.toFixed(1));

export default NutritionHistory;
