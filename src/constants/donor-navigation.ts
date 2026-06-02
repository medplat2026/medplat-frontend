import { ROUTES } from "@/constants/routes";

export type DonorNavIcon = "caseOverview" | "viewDetails" | "makeDonations" | "logout";

export type DonorNavItem = {
  label: string;
  href: string;
  icon: DonorNavIcon;
};

const { donor } = ROUTES;

export const DONOR_NAV_ITEMS: DonorNavItem[] = [
  { label: "Case overview", href: donor.dashboard, icon: "caseOverview" },
  { label: "View details", href: donor.viewDetails, icon: "viewDetails" },
  { label: "Make donations", href: donor.makeDonations, icon: "makeDonations" },
  { label: "Logout", href: ROUTES.login, icon: "logout" },
];

const DONOR_PAGE_NAV_ITEMS = DONOR_NAV_ITEMS.filter((item) => item.icon !== "logout");

const DONOR_PAGE_TITLE_OVERRIDES: Record<string, string> = {};

export function getDonorPageTitle(pathname: string): string {
  const normalized = pathname.replace(/\/$/, "") || pathname;
  const override = DONOR_PAGE_TITLE_OVERRIDES[normalized];
  if (override) return override;

  const exact = DONOR_PAGE_NAV_ITEMS.find(
    (item) => item.href === pathname || item.href === normalized,
  );
  if (exact) return exact.label;

  return "Case overview";
}

export function getDonorHomeSubtitle(): string {
  return "Discover verified cases and make an impact with your support.";
}
