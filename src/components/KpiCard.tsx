import { ArrowUp, ArrowDown } from "lucide-react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  data: number[];
  delay?: number;
}

export function KpiCard({ title, value, change, data, delay = 0 }: KpiCardProps) {
  const isPositive = change >= 0;
  const chartData = data.map((v, i) => ({ v, i }));

  return (
    <div
      className="glass-card p-6 flex flex-col justify-between animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-semibold mt-1 tracking-tight">{value}</p>
        </div>
        <span
          className={`inline-flex items-center gap-0.5 text-xs font-medium px-2 py-0.5 rounded-full ${
            isPositive
              ? "bg-kpi-green/10 text-kpi-green"
              : "bg-kpi-red/10 text-kpi-red"
          }`}
        >
          {isPositive ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
          {Math.abs(change)}%
        </span>
      </div>
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id={`kpi-${title}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isPositive ? "hsl(var(--kpi-green))" : "hsl(var(--kpi-red))"} stopOpacity={0.3} />
                <stop offset="100%" stopColor={isPositive ? "hsl(var(--kpi-green))" : "hsl(var(--kpi-red))"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke={isPositive ? "hsl(var(--kpi-green))" : "hsl(var(--kpi-red))"}
              strokeWidth={1.5}
              fill={`url(#kpi-${title})`}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
