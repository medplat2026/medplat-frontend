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
  { label: "Patients", href: "/dashboard/patients", icon: "patients" },
  { label: "Cases", href: "/dashboard/cases", icon: "cases" },
  { label: "Update", href: "/dashboard/update", icon: "update" },
  { label: "Notification", href: "/dashboard/notifications", icon: "notification" },
  { label: "Profile & Setting", href: "/dashboard/settings", icon: "settings" },
  { label: "Logout", href: "/login", icon: "logout" },
];
