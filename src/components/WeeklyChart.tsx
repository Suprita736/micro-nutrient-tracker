import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface DailyScore {
  date: string;
  score: number;
}

interface WeeklyChartProps {
  data: DailyScore[];
}

const WeeklyChart = ({ data }: WeeklyChartProps) => {
  return (
    <div className="bg-card border border-border p-6 mb-10 w-full">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-semibold text-foreground">Weekly Progress</h2>
        <p className="text-muted-foreground font-sans text-xs">Last 7 days completion score</p>
      </div>
      
      <div className="h-[180px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="date" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10, fontFamily: "var(--font-sans)" }}
              dy={10}
            />
            <YAxis 
              hide={true} 
              domain={[0, 100]}
            />
            <Bar 
              dataKey="score" 
              fill="hsl(var(--primary))" 
              radius={[2, 2, 0, 0]} 
              barSize={window.innerWidth < 768 ? 12 : 8}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeeklyChart;
