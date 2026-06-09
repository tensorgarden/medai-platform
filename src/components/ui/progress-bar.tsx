import clsx from "clsx";

export function ProgressBar({
  value,
  max = 100,
  variant = "default",
}: {
  value: number;
  max?: number;
  variant?: "default" | "success" | "warning" | "danger";
}) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));

  const trackColors: Record<string, string> = {
    default: "bg-accent",
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    danger: "bg-red-500",
  };

  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className={clsx("h-full rounded-full transition-all", trackColors[variant])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
