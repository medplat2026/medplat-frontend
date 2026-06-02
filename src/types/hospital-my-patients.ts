/** Row from GET `/hospitals/my-patients/`. */
export type HospitalMyPatientApiRow = {
  patient_id: number;
  patient_name: string;
  email: string;
  case_ref: string;
  case_type: string;
  amount_needed: number;
  urgency_level: string;
  status: string;
};

/** Paginated body from GET `/hospitals/my-patients/`. */
export type HospitalMyPatientsResponse = {
  count: number;
  results: HospitalMyPatientApiRow[];
};

export type HospitalMyPatientsParams = {
  search?: string;
  ordering?: string;
  page?: number;
};
