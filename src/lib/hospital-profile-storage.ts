import { HOSPITAL_PROFILE_STORAGE } from "@/constants/onboarding";
import { getStoredAuthUser } from "@/lib/auth-session";
import type { AuthUser } from "@/types/auth";

export function hospitalProfileNeedsCompletion(): boolean {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.complete) === "true") return false;
  return window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.needsCompletion) === "true";
}

/**
 * Whether to show the hospital profile completion prompt on the dashboard.
 * Prefer login snapshot `hospital_profile_completed`; fall back to session flags from signup.
 */
export function shouldShowHospitalProfileCompletionModal(): boolean {
  if (typeof window === "undefined") return false;
  const u = getStoredAuthUser();
  if (!u || u.user_type !== "hospital") return false;
  if (u.hospital_profile_completed === true) return false;
  if (u.hospital_profile_completed === false) return true;
  return hospitalProfileNeedsCompletion();
}

/** Align sessionStorage flags with server after login (and clear stale state for completed hospitals). */
export function syncHospitalProfileFlagsFromLoginUser(user: AuthUser): void {
  if (typeof window === "undefined") return;
  if (user.user_type !== "hospital") {
    clearHospitalProfileCompletionFlags();
    return;
  }
  if (user.hospital_profile_completed === true) {
    markHospitalProfileComplete();
  } else {
    markHospitalProfileNeedsCompletion();
  }
}

export function markHospitalProfileNeedsCompletion(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(HOSPITAL_PROFILE_STORAGE.needsCompletion, "true");
  window.sessionStorage.removeItem(HOSPITAL_PROFILE_STORAGE.complete);
}

export function markHospitalProfileComplete(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(HOSPITAL_PROFILE_STORAGE.needsCompletion);
  window.sessionStorage.setItem(HOSPITAL_PROFILE_STORAGE.complete, "true");
}

export function clearHospitalProfileCompletionFlags(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(HOSPITAL_PROFILE_STORAGE.needsCompletion);
  window.sessionStorage.removeItem(HOSPITAL_PROFILE_STORAGE.complete);
}
