export type CaseStatus =
  | "Approved"
  | "Completed"
  | "Submitted"
  | "Draft"
  | "Funded";

export type CaseRecord = {
  id: string;
  patientId: string;
  patientName: string;
  caseType: string;
  totalCost: number;
  /** Null when the case has no funding progress (e.g. draft). */
  progressPercent: number | null;
  status: CaseStatus;
};

export type CaseStatusFilter = CaseStatus | "all";

export function caseStatusToBadgeVariant(status: CaseStatus) {
  const map = {
    Approved: "approved",
    Funded: "funded",
    Completed: "completed",
    Submitted: "submitted",
    Draft: "draft",
  } as const;
  return map[status];
}
