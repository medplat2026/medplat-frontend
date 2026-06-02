import { HOSPITAL_PROFILE_STORAGE } from "@/constants/onboarding";
import { getStoredAuthUser } from "@/lib/auth-session";
import type { AuthUser } from "@/types/auth";

/** Prefer `hospital_profile_completed`, else `profile_completed` from login / API user. */
export function hospitalProfileCompletedFromAuthUser(
  user: AuthUser,
): boolean | undefined {
  if (user.hospital_profile_completed === true || user.profile_completed === true) {
    return true;
  }
  if (user.hospital_profile_completed === false || user.profile_completed === false) {
    return false;
  }
  return undefined;
}

export function hospitalProfileNeedsCompletion(): boolean {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.complete) === "true") return false;
  return window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.needsCompletion) === "true";
}

/**
 * Whether to show the hospital profile completion prompt on the dashboard.
 * Hidden when the login snapshot says the profile is complete, or when this session already
 * finished the registration wizard (`complete` in sessionStorage). Otherwise shown if the server
 * marks the profile incomplete or onboarding set `needsCompletion`.
 */
export function shouldShowHospitalProfileCompletionModal(): boolean {
  if (typeof window === "undefined") return false;
  const u = getStoredAuthUser();
  if (!u || u.user_type !== "hospital") return false;
  if (u.hospital_profile_completed === true) return false;
  if (window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.complete) === "true") {
    return false;
  }
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
  const completed = hospitalProfileCompletedFromAuthUser(user);
  if (completed === true) {
    markHospitalProfileComplete();
  } else if (completed === false) {
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
