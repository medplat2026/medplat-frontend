import { ROUTES } from "@/constants/routes";

export type PatientNavIcon =
  | "dashboard"
  | "cases"
  | "funding"
  | "notification"
  | "settings"
  | "logout";

export type PatientNavItem = {
  label: string;
  href: string;
  icon: PatientNavIcon;
};

const { patient } = ROUTES;

export const PATIENT_NAV_ITEMS: PatientNavItem[] = [
  { label: "Dashboard", href: patient.dashboard, icon: "dashboard" },
  { label: "My Cases", href: patient.cases, icon: "cases" },
  { label: "Funding", href: patient.funding, icon: "funding" },
  { label: "Notification", href: patient.notifications, icon: "notification" },
  { label: "Profile & Setting", href: patient.settings, icon: "settings" },
  { label: "Logout", href: ROUTES.login, icon: "logout" },
];

const PATIENT_PAGE_NAV_ITEMS = PATIENT_NAV_ITEMS.filter((item) => item.icon !== "logout");

const PATIENT_PAGE_TITLE_OVERRIDES: Record<string, string> = {
  [patient.funding.replace(/\/$/, "")]: "My Funding Update",
};

export function getPatientPageTitle(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "") || pathname;
  const override = PATIENT_PAGE_TITLE_OVERRIDES[normalized];
  if (override) return override;

  const exact = PATIENT_PAGE_NAV_ITEMS.find(
    (item) => item.href === pathname || item.href === normalized,
  );
  if (exact) return exact.label;

  const casesBase = ROUTES.patient.cases.replace(/\/$/, "");
  if (normalized.startsWith(`${casesBase}/`) && normalized !== casesBase) {
    return "Case details";
  }

  return "Dashboard";
}

export function getPatientHomeSubtitle(): string {
  return "Track your treatment and funding progress.";
}

/** Shown on the funding page header subtitle (mock). */
const MOCK_FUNDING_PAGE_SUBTITLE_DATE = "Tuesday, April 14, 2026";

export function getPatientPageSubtitle(pathname: string): string | undefined {
  const casesBase = ROUTES.patient.cases.replace(/\/$/, "");
  const fundingBase = ROUTES.patient.funding.replace(/\/$/, "");
  const normalized = pathname.replace(/\/$/, "") || pathname;
  if (normalized === casesBase) {
    return "View and manage all your medical cases";
  }
  if (normalized === fundingBase) {
    return `${MOCK_FUNDING_PAGE_SUBTITLE_DATE} — Track and document your treatment and funding.`;
  }
  return undefined;
}

/** Returns the case id when pathname is `/patient/dashboard/cases/:id` (not the list route). */
export function getPatientCaseDetailIdFromPathname(pathname: string): string | undefined {
  const normalized = pathname.replace(/\/$/, "") || pathname;
  const casesBase = ROUTES.patient.cases.replace(/\/$/, "");
  const prefix = `${casesBase}/`;
  if (!normalized.startsWith(prefix)) return undefined;
  const id = normalized.slice(prefix.length);
  if (!id || id.includes("/")) return undefined;
  return id;
}
