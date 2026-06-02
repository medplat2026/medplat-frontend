export type PatientUrgency = "High" | "Medium" | "Low";

export type PatientStatus = "Approved" | "Completed" | "Submitted" | "Draft";

export type PatientRecord = {
  id: string;
  /** Present when the row is tied to a specific case (e.g. hospital my-patients list). */
  caseRef?: string;
  name: string;
  caseType: string;
  email: string;
  amountNeeded: number;
  urgency: PatientUrgency;
  status: PatientStatus;
};

export type LinkedCase = {
  id: string;
  title: string;
  date: string;
  amount: number;
  status: PatientStatus;
};

export type PatientDetail = PatientRecord & {
  patientSince: string;
  diagnosis: string;
  fundingProgress: string;
  treatmentTimeline: string;
  linkedCases: LinkedCase[];
  /** Populated from hospital patient detail API (e.g. Cloudinary). */
  avatarUrl?: string | null;
  patientIdDocumentUrl?: string | null;
  doctorReportUrl?: string | null;
};

export function formatNairaAmount(amount: number): string {
  return `₦ ${amount.toLocaleString("en-NG")}`;
}

export function urgencyToBadgeVariant(urgency: PatientUrgency) {
  const map = {
    High: "high",
    Medium: "medium",
    Low: "low",
  } as const;
  return map[urgency];
}

export function statusToBadgeVariant(status: PatientStatus) {
  const map = {
    Approved: "approved",
    Completed: "completed",
    Submitted: "submitted",
    Draft: "draft",
  } as const;
  return map[status];
}
