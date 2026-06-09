import { Card } from "./card";
import clsx from "clsx";

export function StatCard({
  label,
  value,
  unit,
  change,
  trend,
}: {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: "up" | "down" | "stable";
}) {
  const trendColor =
    trend === "up"
      ? change > 0
        ? "text-emerald-600"
        : "text-red-600"
      : trend === "down"
        ? change < 0
          ? "text-emerald-600"
          : "text-red-600"
        : "text-gray-500";

  const arrow = trend === "up" ? "\u2191" : trend === "down" ? "\u2193" : "\u2192";

  return (
    <Card className="flex flex-col gap-1">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-400">
        {label}
      </span>
      <span className="text-3xl font-bold text-ink">
        {value.toLocaleString()}{" "}
        <span className="text-lg font-normal text-gray-400">{unit}</span>
      </span>
      <span className={clsx("text-sm font-medium", trendColor)}>
        {arrow} {Math.abs(change).toFixed(1)}%
      </span>
    </Card>
  );
}
