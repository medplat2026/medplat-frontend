export type DonorTimelineStatus = "completed" | "in_progress" | "upcoming";

export type DonorTimelineStep = {
  status: DonorTimelineStatus;
  statusLabel: string;
  title: string;
  description: string;
  /** Step number shown in circle for non-completed states */
  stepNumber?: string;
};

export type DonorDiagnosisRow = {
  kind: "diagnosis" | "procedure" | "prognosis";
  label: string;
  body: string;
};
