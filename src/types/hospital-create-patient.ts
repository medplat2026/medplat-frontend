/** PATCH `/hospitals/create-patient/step-1/` — always `submit_case: false` (draft on server until step 2). */
export type HospitalCreatePatientStep1Payload = {
  submit_case: false;
  full_name: string;
  date_of_birth: string | null;
  gender: string | null;
  phone_number: string;
  email: string;
  home_address: string | null;
  support_for: string | null;
  hospital_receiving_treatment: string | null;
  is_urgent: boolean;
  treatment_description: string;
};

export type HospitalCreatePatientStep1Result = {
  patient_id: number;
  medical_case_id: number | null;
};
