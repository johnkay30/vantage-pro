import { useLocation } from "react-router-dom";

export default function ComingSoonPage() {
  const location = useLocation();
  const name = location.pathname.slice(1).replace(/-/g, " ");

  return (
    <div className="p-6 max-w-[1400px] mx-auto">
      <h1 className="text-xl font-semibold tracking-tight capitalize">{name || "Page"}</h1>
      <p className="text-sm text-muted-foreground mt-1">This feature is currently under development.</p>
      <div className="mt-8 glass-card p-12 flex items-center justify-center">
        <p className="text-muted-foreground/50 text-sm">Coming Soon</p>
      </div>
    </div>
  );
}
