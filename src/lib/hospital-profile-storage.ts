import { HOSPITAL_PROFILE_STORAGE } from "@/constants/onboarding";

export function hospitalProfileNeedsCompletion(): boolean {
  if (typeof window === "undefined") return false;
  if (window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.complete) === "true") return false;
  return window.sessionStorage.getItem(HOSPITAL_PROFILE_STORAGE.needsCompletion) === "true";
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
