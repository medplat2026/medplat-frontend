export type HospitalFundedOverview = {
  total_funded: number;
  funds_raised: number;
  funds_remaining: number;
};

export type HospitalQuickActions = {
  awaiting_submission: number;
  missing_documents: number;
  pending_approval: number;
};

/**
 * Items in `recent_cases` from GET `/hospitals/dashboard/`.
 * The UI maps common field names (snake_case or nested patient objects).
 */
export type HospitalDashboardRecentCase = Record<string, unknown>;

export type HospitalDashboardData = {
  total_patients: number;
  total_cases: number;
  active_cases: number;
  pending_cases: number;
  funded_overview: HospitalFundedOverview;
  recent_cases: HospitalDashboardRecentCase[];
  quick_actions: HospitalQuickActions;
};
