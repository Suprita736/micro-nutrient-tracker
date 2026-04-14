import React, { useMemo } from "react";
import {
  format,
  subDays,
  startOfToday,
  eachDayOfInterval,
  startOfWeek,
  startOfMonth,
  isSameDay
} from "date-fns";
import { HistoryEntry } from "@/store/trackingStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface StreakCalendarProps {
  history: HistoryEntry[];
}

export const StreakCalendar = ({ history }: StreakCalendarProps) => {
  const today = startOfToday();
  const startDate = subDays(today, 364); // Last 365 days

  // Map history to dateKey for easy lookup
  const historyMap = useMemo(() => {
    const map = new Map<string, number>();
    history.forEach((entry) => {
      const key = entry.dateKey || format(new Date(entry.date), "yyyy-MM-dd");

      const nutrientEntries = Object.entries(entry.nutrients).filter(([id]) => id !== "calories");
      if (nutrientEntries.length === 0) return;

      const totalCompletion = nutrientEntries.reduce((acc, [_, snap]) => {
        const pct = snap.required > 0 ? Math.min(snap.current / snap.required, 1) : 0;
        return acc + pct;
      }, 0);

      const avgCompletion = (totalCompletion / nutrientEntries.length) * 100;
      map.set(key, Math.round(avgCompletion));
    });
    return map;
  }, [history]);

  // Group dates into weeks (columns)
  const columns = useMemo(() => {
    const weeks: Date[][] = [];
    let currentWeek: Date[] = [];

    // Adjust grid start to the beginning of the week containing startDate
    const gridStart = startOfWeek(startDate);
    const allDays = eachDayOfInterval({ start: gridStart, end: today });

    allDays.forEach((day, i) => {
      currentWeek.push(day);
      if (currentWeek.length === 7 || i === allDays.length - 1) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    });

    return weeks;
  }, [startDate, today]);

  // Accent color logic
  const getDayColor = (score: number | undefined) => {

    if (score !== undefined && score > 0) {
      return "bg-primary/70"; // Logged day
    }

    return "bg-gray-200 dark:bg-muted/40"; // Inactive day

  };

  // Month labels and grid structure
  const { monthLabels, columnData } = useMemo(() => {
    const labels: { label: string; offset: number }[] = [];
    let currentX = 0;
    const SQUARE_SIZE = 11;
    const SQUARE_GAP = 3;
    const MONTH_GAP = 6;

    const data = columns.map((week, weekIdx) => {
      const firstDay = week[0];
      const isStartOfMonth = week.some(day => isSameDay(day, startOfMonth(day)));

      // Determine if this is the column where the month starts
      // or if it's the very first column
      let hasMonthStart = false;
      let monthLabel = "";

      week.forEach(day => {
        if (isSameDay(day, startOfMonth(day))) {
          hasMonthStart = true;
          monthLabel = format(day, "MMM");
        }
      });

      const needsMargin = weekIdx > 0 && hasMonthStart;
      if (needsMargin) {
        currentX += MONTH_GAP;
      }

      if (hasMonthStart || (weekIdx === 0 && labels.length === 0)) {
        const label = monthLabel || format(firstDay, "MMM");
        labels.push({ label, offset: currentX });
      }

      const columnInfo = {
        week,
        x: currentX,
        needsMargin
      };

      currentX += SQUARE_SIZE + SQUARE_GAP;
      return columnInfo;
    });

    return { monthLabels: labels, columnData: data };
  }, [columns]);

  return (
    <div className="bg-card border border-border p-6 w-full flex flex-col items-center">
      <div className="w-full max-w-5xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-serif text-lg font-semibold text-foreground uppercase tracking-tight">Consistency Timeline</h3>
        </div>

        <div className="overflow-x-auto pb-4 scrollbar-hide flex justify-center">
          <div className="relative" style={{ width: columnData.length > 0 ? columnData[columnData.length - 1].x + 14 : 'auto' }}>
            {/* Month Header */}
            <div className="h-6 mb-2 relative">
              {monthLabels.map((m, i) => (
                <span
                  key={i}
                  className="absolute text-[10px] text-muted-foreground/60 font-sans uppercase tracking-wider whitespace-nowrap"
                  style={{ left: `${m.offset}px` }}
                >
                  {m.label}
                </span>
              ))}
            </div>

            {/* Grid */}
            <div className="flex items-start">
              <TooltipProvider delayDuration={0}>
                {columnData.map((col, weekIdx) => (
                  <div
                    key={weekIdx}
                    className="flex flex-col gap-[3px]"
                    style={{
                      marginLeft: col.needsMargin ? '6px' : '0',
                      marginRight: weekIdx === columnData.length - 1 ? '0' : '3px'
                    }}
                  >
                    {col.week.map((day, dayIdx) => {
                      const key = format(day, "yyyy-MM-dd");
                      const score = historyMap.get(key);
                      const isOutside = day < startDate || day > today;

                      if (isOutside) {
                        return <div key={dayIdx} className="w-[11px] h-[11px]" />;
                      }

                      return (
                        <Tooltip key={dayIdx}>
                          <TooltipTrigger asChild>
                            <div
                              className={`w-[11px] h-[11px] rounded-[2px] ${getDayColor(score)} transition-colors hover:ring-1 hover:ring-primary/40 cursor-default`}
                            />
                          </TooltipTrigger>
                          <TooltipContent
                            side="top"
                            className="px-2 py-1 text-[10px] font-sans rounded-none border-border bg-popover shadow-md"
                          >
                            <div className="flex flex-col gap-0.5">
                              <span className="font-medium text-foreground">{format(day, "MMM d, yyyy")}</span>
                              <span className="text-muted-foreground">{score !== undefined && score > 0 ? 'Logged' : 'No Activity'}</span>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </div>
                ))}
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
