import { type ReactNode } from "react";

interface ChartContainerProps {
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
  delay?: number;
}

export function ChartContainer({ title, subtitle, children, className = "", delay = 0 }: ChartContainerProps) {
  return (
    <div
      className={`glass-card p-6 flex flex-col animate-fade-in ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-semibold">{title}</h3>
          {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-60" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
          <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/30" />
        </div>
      </div>
      <div className="flex-1 min-h-[200px]">
        {children || (
          <div className="h-full flex items-center justify-center text-muted-foreground/40 text-sm">
            Chart visualization
          </div>
        )}
      </div>
    </div>
  );
}
