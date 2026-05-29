export type PatientActiveCase = {
  id: string;
  title: string;
  hospital: string;
  status: "Active";
  progressPercent: number;
  raised: number;
  target: number;
  daysLeft: number;
  shareUrl: string;
};

export type PatientNotification = {
  id: string;
  type: "donation" | "approval";
  message: string;
  timestamp: string;
};

export type PatientFundingOverview = {
  centerAmount: number;
  centerLabel: string;
  raised: number;
  remaining: number;
  donorCount: number;
};

/** Bubble chart amounts on patient funding page */
export type PatientFundingBubbleStats = {
  largestAmount: number;
  averageAmount: number;
  recentAmount: number;
};

export type PatientFundingDonation = {
  id: string;
  donorDisplayName: string;
  dateLabel: string;
  amount: number;
  message?: string;
};

export type PatientCaseListItem = {
  id: string;
  title: string;
  hospital: string;
  status: "Active" | "Completed";
  raised: number;
  target: number;
  daysLeft: number;
  /** When set, overrides computed progress (0–100) for the bar and label */
  progressPercent?: number;
};

export type PatientMyCasesSection = {
  id: string;
  title: string;
  dateLine?: string;
  cases: PatientCaseListItem[];
};

export type PatientCaseDocument = {
  name: string;
};

export type PatientCaseDetail = {
  id: string;
  title: string;
  hospital: string;
  status: "Active" | "Completed";
  story: string;
  treatmentPlan: string;
  documents: PatientCaseDocument[];
  raised: number;
  target: number;
  daysLeft: number;
  progressPercent?: number;
};
