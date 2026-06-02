/** User object returned on successful POST `/auth/login/`. */
export type AuthUser = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string;
  status: string;
  is_email_verified: boolean;
  user_type: string;
  entity_id: string | number | null;
  role: string | null;
  registration_stage?: string;
  /** When true, skip hospital dashboard completion modals. */
  hospital_profile_completed?: boolean;
  /** Some APIs expose this instead of `hospital_profile_completed` (same meaning). */
  profile_completed?: boolean;
  onboarding_completed?: boolean;
  next_required_step?: string | null;
  created_at: string;
  updated_at: string;
};

/** Successful POST `/auth/login/` body (JWT + profile). */
export type LoginResponse = {
  message?: string;
  access: string;
  refresh: string;
  user: AuthUser;
  must_change_password: boolean;
};
