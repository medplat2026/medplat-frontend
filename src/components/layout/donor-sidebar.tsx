"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DONOR_NAV_ITEMS, type DonorNavIcon } from "@/constants/donor-navigation";
import { ROUTES } from "@/constants/routes";
import { clearAuthSession } from "@/lib/auth-session";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string): boolean {
  if (href === ROUTES.login) return false;
  const normalized = pathname.replace(/\/$/, "") || pathname;
  const hrefNorm = href.replace(/\/$/, "") || href;
  if (href === ROUTES.donor.dashboard) {
    return normalized === hrefNorm;
  }
  return normalized === hrefNorm || normalized.startsWith(`${hrefNorm}/`);
}

function NavIcon({ name, className }: { name: DonorNavIcon; className?: string }) {
  const common = cn("size-[18px] shrink-0", className);
  switch (name) {
    case "caseOverview":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 4h8l4 4v12a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M16 4v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 12h6M9 15h6M9 18h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "viewDetails":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M9 9h6M9 12h6M9 15h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      );
    case "makeDonations":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 3v18"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
          <path
            d="M15 7.5A4 4 0 0 0 9 8.25c0 2.25 2.25 2.75 4.5 3.5s4.5 1.75 4.5 4.25a4 4 0 0 1-7.5 1.25"
            stroke="currentColor"
            strokeWidth="1.65"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "logout":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M10 17v-3H3v-4h7V7l5 5-5 5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M14 7h5a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return null;
  }
}

type DonorSidebarProps = {
  donorName: string;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function DonorSidebar({
  donorName,
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: DonorSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [supportVisible, setSupportVisible] = useState(true);
  const showExpandedCopy = !collapsed || open;
  const initials = donorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#e2e8f0] bg-linear-to-b from-[#eef3fb] to-[#e8eef8] px-4 py-5 text-foreground transition-all duration-300 lg:translate-x-0",
          collapsed ? "w-[260px] lg:w-[84px] lg:px-3" : "w-[260px]",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div
          className={cn(
            "mb-6 flex items-start gap-2",
            showExpandedCopy ? "justify-between" : "flex-col items-center",
          )}
        >
          {showExpandedCopy ? (
            <div className="min-w-0 pl-0.5">
              <p className="text-lg font-bold tracking-tight text-foreground">Medplat</p>
              <p className="truncate text-xs font-medium text-muted-foreground">{donorName}</p>
            </div>
          ) : (
            <div className="hidden pt-0.5 lg:flex lg:w-full lg:justify-center">
              <span className="text-sm font-bold text-onboarding-blue" aria-hidden>
                M
              </span>
            </div>
          )}
          <div
            className={cn(
              "flex items-center gap-1",
              showExpandedCopy ? "ml-auto" : "hidden w-full justify-center lg:flex",
            )}
          >
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white bg-white text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:hidden"
              aria-label="Close navigation"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
            <button
              type="button"
              onClick={onToggleCollapse}
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-white bg-white text-muted-foreground shadow-sm transition-colors hover:text-foreground lg:inline-flex"
              aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden
                className={cn("transition-transform", collapsed && "rotate-180")}
              >
                <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>

        {showExpandedCopy ? (
          <p className="mb-2 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Main</p>
        ) : (
          <div className="mb-2 hidden h-px w-full bg-border lg:block" />
        )}

        <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
          {DONOR_NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href);
            const isLogout = item.href === ROUTES.login;
            const base = cn(
              "flex h-10 items-center gap-3 rounded-xl border px-3 text-sm transition-colors",
              collapsed && !open && "mx-auto w-10 justify-center gap-0 px-0",
              isLogout
                ? "border-transparent text-muted-foreground hover:bg-white/80 hover:text-foreground"
                : active
                  ? "border-border bg-white font-medium text-onboarding-blue shadow-sm"
                  : "border-transparent text-muted-foreground hover:bg-white/60 hover:text-foreground",
            );

            if (isLogout) {
              return (
                <button
                  key={item.label}
                  type="button"
                  className={base}
                  title={collapsed && !open ? item.label : undefined}
                  onClick={() => {
                    onClose();
                    clearAuthSession();
                    router.push(ROUTES.login);
                  }}
                >
                  <NavIcon name={item.icon} />
                  {showExpandedCopy ? item.label : null}
                </button>
              );
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                onClick={onClose}
                className={base}
                title={collapsed && !open ? item.label : undefined}
              >
                <NavIcon
                  name={item.icon}
                  className={cn(active && !isLogout && "text-onboarding-blue")}
                />
                {showExpandedCopy ? item.label : null}
              </Link>
            );
          })}
        </nav>

        {supportVisible && showExpandedCopy ? (
          <div className="relative mt-4 rounded-2xl border border-border bg-white p-4 shadow-sm">
            <button
              type="button"
              className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Dismiss support card"
              onClick={() => setSupportVisible(false)}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
            <div className="mb-2 flex items-center gap-2 pr-6">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-onboarding-blue" aria-hidden>
                <path
                  d="M4 11a8 8 0 0 1 16 0v5l2 2H2l2-2v-5Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
              </svg>
              <p className="text-sm font-semibold text-foreground">Need Support?</p>
            </div>
            <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
              contact with one of our experts to get supports
            </p>
            <Button variant="outline" fullWidth className="rounded-xl py-2.5 text-sm font-semibold">
              Contact Us
            </Button>
          </div>
        ) : null}

        <div
          className={cn(
            "mt-4 flex items-center gap-3 rounded-2xl border border-transparent px-1 py-2",
            collapsed && !open && "justify-center px-0",
          )}
        >
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-violet-100 text-xs font-bold text-violet-800">
            {initials}
          </div>
          {showExpandedCopy ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{donorName}</p>
              <p className="text-xs text-muted-foreground">Donor Account</p>
            </div>
          ) : null}
        </div>
      </aside>

      {open ? (
        <button
          type="button"
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onClose}
          aria-label="Close navigation backdrop"
        />
      ) : null}
    </>
  );
}
