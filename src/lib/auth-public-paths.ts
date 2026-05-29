/**
 * Auth endpoints that must not include `Authorization` (central-auth pattern:
 * anonymous client until login returns fresh tokens).
 */
const PUBLIC_AUTH_PATHS = [
  "/auth/login/",
  "/auth/register_patient/",
  "/auth/register_hospital/",
  "/auth/patient_initiate/",
  "/auth/hospital_initiate/",
  "/auth/verify_email/",
  "/auth/token/refresh/",
] as const;

export function isPublicAuthRequest(url?: string): boolean {
  if (!url) return false;
  const path = url.split("?")[0];
  return PUBLIC_AUTH_PATHS.some((segment) => path.includes(segment));
}
