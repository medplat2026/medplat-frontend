/** Browser keys for auth returned by POST `/auth/login/`. */

import type { LoginResponse } from "@/types/auth";

const ACCESS_KEYS = ["access", "access_token", "token", "auth_token"];
const REFRESH_KEYS = ["refresh", "refresh_token"];

const LS_ACCESS = "medplat_access_token";
const LS_REFRESH = "medplat_refresh_token";
const LS_USER = "medplat_current_user";

/** Subset of `AuthUser` kept for UI (sidebar / header / dashboard gating). */
export type StoredAuthUser = {
  id: number;
  email: string;
  full_name: string;
  user_type: string;
  /** Mirrors login `user.hospital_profile_completed`; drives hospital completion modal after refresh. */
  hospital_profile_completed?: boolean;
};

function firstNonEmptyString(
  obj: Record<string, unknown>,
  keys: readonly string[],
): string | null {
  for (const k of keys) {
    const v = obj[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

/** Persist access/refresh tokens when the login API returns them (e.g. SimpleJWT). */
export function persistTokensFromLoginPayload(
  data: Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  const access = firstNonEmptyString(data, ACCESS_KEYS);
  const refresh = firstNonEmptyString(data, REFRESH_KEYS);
  if (access) localStorage.setItem(LS_ACCESS, access);
  if (refresh) localStorage.setItem(LS_REFRESH, refresh);
}

/** Tokens + `user` snapshot from POST `/auth/login/`. */
export function persistLoginSession(
  data: LoginResponse | Record<string, unknown>,
): void {
  if (typeof window === "undefined") return;
  const record = data as Record<string, unknown>;
  persistTokensFromLoginPayload(record);
  const user = record.user;
  if (!user || typeof user !== "object" || Array.isArray(user)) return;
  const u = user as Record<string, unknown>;
  const id =
    typeof u.id === "number" && Number.isFinite(u.id)
      ? u.id
      : Number.parseInt(String(u.id ?? ""), 10);
  const email = typeof u.email === "string" ? u.email : "";
  const full_name = typeof u.full_name === "string" ? u.full_name : "";
  const user_type = typeof u.user_type === "string" ? u.user_type : "";
  if (!email || !Number.isFinite(id)) return;
  const hospital_profile_completed =
    u.hospital_profile_completed === true ? true : u.hospital_profile_completed === false ? false : undefined;
  const snapshot: StoredAuthUser = {
    id,
    email,
    full_name,
    user_type,
    ...(hospital_profile_completed !== undefined ? { hospital_profile_completed } : {}),
  };
  localStorage.setItem(LS_USER, JSON.stringify(snapshot));
}

/** Call after hospital registration API success so refresh does not reopen the modal. */
export function updateStoredHospitalProfileCompleted(completed: boolean): void {
  if (typeof window === "undefined") return;
  const u = getStoredAuthUser();
  if (!u) return;
  const next: StoredAuthUser = { ...u, hospital_profile_completed: completed };
  localStorage.setItem(LS_USER, JSON.stringify(next));
}

export function getStoredAuthUser(): StoredAuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(LS_USER);
    if (!raw) return null;
    return JSON.parse(raw) as StoredAuthUser;
  } catch {
    return null;
  }
}

export function getStoredAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(LS_ACCESS);
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_ACCESS);
  localStorage.removeItem(LS_REFRESH);
  localStorage.removeItem(LS_USER);
}

function normalizeRoleHint(value: unknown): "hospital" | "patient" | null {
  if (typeof value !== "string") return null;
  const s = value.toLowerCase();
  if (s.includes("patient") || s === "p") return "patient";
  if (s.includes("hospital") || s === "h" || s.includes("provider"))
    return "hospital";
  return null;
}

function portalFromObject(
  o: Record<string, unknown>,
): "hospital" | "patient" | null {
  if (o.user_type === "hospital") return "hospital";
  if (o.user_type === "patient") return "patient";
  if (o.is_patient === true) return "patient";
  if (o.is_hospital === true) return "hospital";
  return (
    normalizeRoleHint(o.user_type) ??
    normalizeRoleHint(o.account_type) ??
    normalizeRoleHint(o.role) ??
    normalizeRoleHint(o.type)
  );
}

/**
 * Best-effort portal from login JSON (shape varies by backend).
 * When unknown, the UI sends the user to home to pick hospital vs patient.
 */
export function inferPortalFromLoginData(
  data: Record<string, unknown>,
): "hospital" | "patient" | null {
  const direct = portalFromObject(data);
  if (direct) return direct;
  const user = data.user;
  if (user && typeof user === "object" && !Array.isArray(user)) {
    return portalFromObject(user as Record<string, unknown>);
  }
  return null;
}
