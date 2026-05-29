"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import {
  getPatientCaseDetailIdFromPathname,
  getPatientHomeSubtitle,
  getPatientPageSubtitle,
  getPatientPageTitle,
} from "@/constants/patient-navigation";
import { PatientCaseStatusBadge } from "@/components/patient/patient-case-status-badge";
import { getMockPatientCaseDetail } from "@/data/mock-patient-dashboard";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type PatientHeaderProps = {
  patientName: string;
  onMenuClick: () => void;
};

export function PatientHeader({ patientName, onMenuClick }: PatientHeaderProps) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, "") || pathname;
  const isPatientHome = normalizedPath === ROUTES.patient.dashboard.replace(/\/$/, "");
  const caseDetailId = getPatientCaseDetailIdFromPathname(pathname);
  const caseDetail = caseDetailId ? getMockPatientCaseDetail(caseDetailId) : undefined;

  const pageTitle = isPatientHome
    ? `Welcome, ${patientName}`
    : caseDetail
      ? caseDetail.title
      : getPatientPageTitle(pathname);
  const subtitle = isPatientHome
    ? getPatientHomeSubtitle()
    : caseDetail
      ? `Case ID: ${caseDetail.id}`
      : getPatientPageSubtitle(pathname);

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-white/95 px-4 py-4 backdrop-blur-sm md:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between gap-3 md:gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-xl p-0 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
            </span>
          </Button>
          <div className="min-w-0">
            <h1
              className={cn(
                "truncate tracking-tight text-foreground",
                caseDetail ? "text-lg font-bold md:text-2xl" : "text-lg md:text-xl",
                isPatientHome ? "font-semibold" : !caseDetail && "font-bold",
              )}
            >
              {pageTitle}
            </h1>
            {subtitle ? <p className="text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 sm:ml-0">
          {caseDetail ? <PatientCaseStatusBadge status={caseDetail.status} compact /> : null}
          <Link
            href={ROUTES.patient.notifications}
            className={cn(
              "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
              "border border-border bg-white text-foreground shadow-[0_4px_14px_rgba(15,23,42,0.08)]",
              "transition-colors hover:bg-muted",
            )}
            aria-label="Notifications"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </div>
      </div>
    </header>
  );
}
