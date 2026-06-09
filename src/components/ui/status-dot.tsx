import clsx from "clsx";

type Status =
  | "active"
  | "inactive"
  | "on-hold"
  | "discharged"
  | "scheduled"
  | "checked-in"
  | "in-progress"
  | "completed"
  | "cancelled"
  | "no-show"
  | "draft"
  | "reviewed"
  | "finalized"
  | "pending"
  | "needs-review"
  | "open";

const statusColors: Record<string, string> = {
  active: "bg-emerald-400",
  inactive: "bg-gray-300",
  "on-hold": "bg-amber-400",
  discharged: "bg-blue-400",
  scheduled: "bg-blue-400",
  "checked-in": "bg-violet-400",
  "in-progress": "bg-accent",
  completed: "bg-emerald-400",
  cancelled: "bg-gray-300",
  "no-show": "bg-red-400",
  draft: "bg-amber-400",
  reviewed: "bg-blue-400",
  finalized: "bg-emerald-400",
  pending: "bg-amber-400",
  "needs-review": "bg-red-400",
  open: "bg-sky-400",
};

const statusLabels: Record<string, string> = {
  active: "Active",
  inactive: "Inactive",
  "on-hold": "On Hold",
  discharged: "Discharged",
  scheduled: "Scheduled",
  "checked-in": "Checked In",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  "no-show": "No Show",
  draft: "Draft",
  reviewed: "Reviewed",
  finalized: "Finalized",
  pending: "Pending",
  "needs-review": "Needs Review",
  open: "Open",
};

export function StatusDot({
  status,
  label,
}: {
  status: Status;
  label?: string;
}) {
  const displayLabel = label ?? statusLabels[status] ?? status;

  return (
    <span className="inline-flex items-center gap-1.5 text-sm">
      <span
        className={clsx(
          "inline-block h-2 w-2 rounded-full",
          statusColors[status] ?? "bg-gray-300"
        )}
      />
      <span className="text-gray-600">{displayLabel}</span>
    </span>
  );
}
