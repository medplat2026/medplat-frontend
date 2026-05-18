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

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "dashboard" },
  { label: "Patients", href: "/patients", icon: "patients" },
  { label: "Cases", href: ROUTES.cases, icon: "cases" },
  { label: "Update", href: ROUTES.update, icon: "update" },
  {
    label: "Notification",
    href: "/dashboard/notifications",
    icon: "notification",
  },
  { label: "Profile & Setting", href: "/dashboard/settings", icon: "settings" },
  { label: "Logout", href: "/login", icon: "logout" },
];

const DASHBOARD_PAGE_NAV_ITEMS = DASHBOARD_NAV_ITEMS.filter(
  (item) => item.icon !== "logout",
);

const DASHBOARD_PAGE_TITLE_OVERRIDES: Record<string, string> = {
  [ROUTES.cases]: "Patient Cases",
  [ROUTES.update]: "Patient Treatment Update",
};

const DASHBOARD_PAGE_SUBTITLE_SUFFIX: Record<string, string> = {
  [ROUTES.update]: "Track and document patient treatment update",
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
    (item) => item.href !== "/dashboard",
  ).find((item) => pathname.startsWith(`${item.href}/`));
  if (nested) return nested.label;

  return "Dashboard";
}
