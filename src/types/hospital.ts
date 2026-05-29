export type OnboardingChoice = {
  value: string;
  label: string;
};

export type HospitalOnboardingChoices = {
  hospital_types: OnboardingChoice[];
  available_departments: OnboardingChoice[];
  medical_case_types: OnboardingChoice[];
  document_types: OnboardingChoice[];
};

/** PATCH `/hospitals/my-hospital/` */
export type HospitalBasicInfoPayload = {
  name: string;
  hospital_type?: string | null;
  license_number?: string | null;
  contact_person_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address: string;
  city: string;
  state?: string | null;
  postal_code?: string | null;
  is_draft: boolean;
};
