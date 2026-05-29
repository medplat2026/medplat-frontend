import { cn } from "@/lib/utils";

export type PatientCaseDisplayStatus = "Active" | "Completed";

type PatientCaseStatusBadgeProps = {
  status: PatientCaseDisplayStatus;
  /** Tighter padding for the patient shell header */
  compact?: boolean;
};

export function PatientCaseStatusBadge({ status, compact }: PatientCaseStatusBadgeProps) {
  const pad = compact ? "px-3 py-1.5" : "px-3 py-1";
  if (status === "Active") {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 rounded-lg bg-onboarding-blue text-xs font-semibold text-white",
          pad,
        )}
      >
        Active
      </span>
    );
  }
  return (
    <span
      className={cn(
        "inline-flex shrink-0 rounded-lg border border-onboarding-blue bg-[#f3f4f6] text-xs font-semibold text-onboarding-blue",
        pad,
      )}
    >
      Completed
    </span>
  );
}
