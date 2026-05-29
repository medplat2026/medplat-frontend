import { ROUTES } from "@/constants/routes";

export type DashboardNavIcon =
  | "dashboard"
  | "patients"
  | "cases"
  | "update"
  | "notification"
  | "settings"
  | "logout";

export type DashboardNavItem = {
  label: string;
  href: string;
  icon: DashboardNavIcon;
};

const { hospital } = ROUTES;

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: "Dashboard", href: hospital.dashboard, icon: "dashboard" },
  { label: "Patients", href: hospital.patients, icon: "patients" },
  { label: "Cases", href: hospital.cases, icon: "cases" },
  { label: "Update", href: hospital.update, icon: "update" },
  {
    label: "Notification",
    href: hospital.notifications,
    icon: "notification",
  },
  { label: "Profile & Setting", href: hospital.settings, icon: "settings" },
  { label: "Logout", href: ROUTES.login, icon: "logout" },
];

const DASHBOARD_PAGE_NAV_ITEMS = DASHBOARD_NAV_ITEMS.filter(
  (item) => item.icon !== "logout",
);

const DASHBOARD_PAGE_TITLE_OVERRIDES: Record<string, string> = {
  [hospital.cases]: "Patient Cases",
  [hospital.update]: "Patient Treatment Update",
};

const DASHBOARD_PAGE_SUBTITLE_SUFFIX: Record<string, string> = {
  [hospital.update]: "Track and document patient treatment update",
};

/** Optional suffix appended after the formatted date in the dashboard header. */
export function getDashboardPageSubtitleSuffix(pathname: string): string | undefined {
  return DASHBOARD_PAGE_SUBTITLE_SUFFIX[pathname];
}

/** Resolves the dashboard header title from the current pathname. */
export function getDashboardPageTitle(pathname: string): string {
  const override = DASHBOARD_PAGE_TITLE_OVERRIDES[pathname];
  if (override) return override;

  const exact = DASHBOARD_PAGE_NAV_ITEMS.find((item) => item.href === pathname);
  if (exact) return exact.label;

  const nested = DASHBOARD_PAGE_NAV_ITEMS.filter(
    (item) => item.href !== hospital.dashboard,
  ).find((item) => pathname.startsWith(`${item.href}/`));
  if (nested) return nested.label;

  return "Dashboard";
}
