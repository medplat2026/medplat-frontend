"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { DASHBOARD_NAV_ITEMS, type DashboardNavIcon } from "@/constants/dashboard-navigation";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

function isNavActive(pathname: string, href: string): boolean {
  if (href === "/login") return false;
  if (href === "/dashboard") {
    return pathname === "/dashboard" || pathname === "/dashboard/";
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ name, className }: { name: DashboardNavIcon; className?: string }) {
  const common = cn("size-[18px] shrink-0", className);
  switch (name) {
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M4 10.5 12 3l8 7.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "patients":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M5 20v-1a4 4 0 0 1 4-4h6a4 4 0 0 1 4 4v1"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      );
    case "cases":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M8 6h12v14H8V6Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path d="M4 9h12v14H4V9Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "update":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 19V5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M8 17V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M12 17V7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M16 17V11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="M20 17V4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "notification":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "settings":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />
          <path
            d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V22a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0-.33-1.82 1.65 1.65 0 0 0-1.51-1H2a2 2 0 1 1 0-4h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V2a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0 .33 1.82V9c0 .69.28 1.31.74 1.76.45.46 1.07.74 1.76.74H22a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"
            stroke="currentColor"
            strokeWidth="1.2"
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

type DashboardSidebarProps = {
  hospitalName: string;
  open: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
};

export function DashboardSidebar({
  hospitalName,
  open,
  onClose,
  collapsed,
  onToggleCollapse,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [supportVisible, setSupportVisible] = useState(true);
  /** Keep full labels in the mobile drawer even when the desktop sidebar is collapsed. */
  const showExpandedCopy = !collapsed || open;

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
          "fixed inset-y-0 left-0 z-40 flex flex-col border-r border-[#e2e8f0] bg-[#eef3fb] px-4 py-5 text-foreground transition-all duration-300 lg:translate-x-0",
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
              <p className="truncate text-xs font-medium text-muted-foreground">{hospitalName}</p>
            </div>
          ) : (
            <div className="hidden pt-0.5 lg:flex lg:justify-center lg:w-full">
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
          {DASHBOARD_NAV_ITEMS.map((item) => {
            const active = isNavActive(pathname, item.href);
            const isLogout = item.href === "/login";
            const base = cn(
              "flex h-10 items-center gap-3 rounded-xl border px-3 text-sm transition-colors",
              collapsed && !open && "mx-auto w-10 justify-center gap-0 px-0",
              isLogout
                ? "border-transparent text-muted-foreground hover:bg-white/80 hover:text-foreground"
                : active
                  ? "border-border bg-white font-medium text-[#15803d] shadow-sm"
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
                    router.push("/login");
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
                  className={cn(active && !isLogout && "text-[#15803d]")}
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
              Contact with one of our experts to get supports
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
          <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-onboarding-blue/15 text-xs font-bold text-onboarding-blue">
            {hospitalName.slice(0, 2).toUpperCase()}
          </div>
          {showExpandedCopy ? (
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-foreground">{hospitalName}</p>
              <p className="text-xs text-muted-foreground">Hospital Account</p>
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
