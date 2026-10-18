import * as React from "react";
import {
  AlertTriangle,
  UserCheck,
  Truck,
  Wrench,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type JobStatusType =
  | "unassigned"
  | "assigned"
  | "on_the_way"
  | "in_progress"
  | "completed"
  | "cancelled";

const STATUS_META: Record<
  JobStatusType,
  {
    label: string;
    bgClass: string;
    textClass: string;
    Icon: React.ComponentType<{ className?: string }>;
  }
> = {
  unassigned: {
    label: "Unassigned",
    bgClass: "bg-amber-500/15",
    textClass: "text-amber-900",
    Icon: AlertTriangle,
  },
  assigned: {
    label: "Assigned",
    bgClass: "bg-blue-500/15",
    textClass: "text-blue-900",
    Icon: UserCheck,
  },
  on_the_way: {
    label: "On The Way",
    bgClass: "bg-violet-500/15",
    textClass: "text-violet-900",
    Icon: Truck,
  },
  in_progress: {
    label: "In Progress",
    bgClass: "bg-orange-500/15",
    textClass: "text-orange-700",
    Icon: Wrench,
  },
  completed: {
    label: "Completed",
    bgClass: "bg-green-600/15",
    textClass: "text-green-900",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    bgClass: "bg-slate-400/20",
    textClass: "text-slate-700",
    Icon: XCircle,
  },
};

export interface StatusBadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: JobStatusType;
}

export function StatusBadge({ status, className, ...props }: StatusBadgeProps) {
  const meta = STATUS_META[status] ?? STATUS_META.unassigned;
  const Icon = meta.Icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium uppercase tracking-wider",
        meta.bgClass,
        meta.textClass,
        className
      )}
      {...props}
    >
      <Icon className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span>{meta.label}</span>
    </span>
  );
}
