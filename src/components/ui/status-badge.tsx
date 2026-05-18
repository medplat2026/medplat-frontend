import { cn } from "@/lib/utils";

export type StatusBadgeVariant =
  | "high"
  | "medium"
  | "low"
  | "approved"
  | "funded"
  | "completed"
  | "submitted"
  | "draft";

const variantClasses: Record<StatusBadgeVariant, string> = {
  high: "bg-[#fef2f2] text-[#dc2626]",
  medium: "bg-[#fef9c3] text-[#a16207]",
  low: "bg-[#f0fdf4] text-[#15803d]",
  approved: "bg-[#f0fdf4] text-[#15803d]",
  funded: "bg-[#ecfdf5] text-[#047857]",
  completed: "bg-[#f3f4f6] text-[#4b5563]",
  submitted: "bg-[#e0f2fe] text-[#0369a1]",
  draft: "bg-[#f3f4f6] text-[#4b5563]",
};

type StatusBadgeProps = {
  variant: StatusBadgeVariant;
  children: React.ReactNode;
  className?: string;
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}
