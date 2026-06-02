/** Linked case row from GET `/hospitals/my-patients/{patient_id}/`. */
export type HospitalMyPatientLinkedCaseApi = {
  case_ref: string;
  title: string;
  estimated_cost: number;
  status: string;
  created_at: string;
};

export type HospitalMyPatientTreatmentTimelineApi = {
  start_date: string | null;
  end_date: string | null;
  days_total: number | null;
};

/** Body from GET `/hospitals/my-patients/{patient_id}/`. */
export type HospitalMyPatientDetailResponse = {
  patient_id: number;
  patient_name: string;
  email: string;
  patient_since: string;
  latest_diagnosis: string | null;
  funding_progress: number;
  treatment_timeline: HospitalMyPatientTreatmentTimelineApi | null;
  patient_id_url: string | null;
  doctor_report_url: string | null;
  linked_cases: HospitalMyPatientLinkedCaseApi[];
  /** If the API paginates linked cases, total count for pagination UI. */
  linked_cases_count?: number;
};

export type HospitalMyPatientDetailParams = {
  search?: string;
  ordering?: string;
  page?: number;
};
