import Link from "next/link";
import { PatientCaseStatusBadge } from "@/components/patient/patient-case-status-badge";
import { ROUTES } from "@/constants/routes";
import { MOCK_PATIENT_MY_CASES_SECTIONS } from "@/data/mock-patient-dashboard";
import { formatCompactNaira } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import type { PatientCaseListItem, PatientMyCasesSection } from "@/types/patient-dashboard";

function LocationIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
      <path
        d="M12 21s7-4.35 7-10a7 7 0 1 0-14 0c0 5.65 7 10 7 10Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="11" r="2.5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function caseProgressPercent(item: PatientCaseListItem): number {
  if (typeof item.progressPercent === "number") {
    return Math.min(100, Math.max(0, item.progressPercent));
  }
  if (item.target <= 0) return 0;
  return Math.min(100, Math.round((item.raised / item.target) * 100));
}

function CaseCard({ caseItem }: { caseItem: PatientCaseListItem }) {
  const progress = caseProgressPercent(caseItem);
  const href = ROUTES.patient.caseDetail(caseItem.id);

  return (
    <Link
      href={href}
      className={cn(
        "block rounded-2xl border border-[#e8ecf1] bg-white p-5 transition-shadow md:p-6",
        "hover:border-onboarding-blue/25 hover:shadow-md",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onboarding-blue/35",
      )}
    >
      <article>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-base font-bold text-onboarding-blue">{caseItem.title}</h3>
            <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <LocationIcon />
              <span>{caseItem.hospital}</span>
            </p>
          </div>
          <PatientCaseStatusBadge status={caseItem.status} />
        </div>

        <div className="mt-6">
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e8ecf1]">
            <div
              className="h-full rounded-full bg-onboarding-blue transition-[width]"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="mt-2 text-center text-xs font-medium text-sky-500">
            {progress}% target reached
          </p>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          <div>
            <p className="text-sm text-muted-foreground">Raised</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-onboarding-blue">
              {formatCompactNaira(caseItem.raised)}
            </p>
          </div>
          <div className="sm:text-center">
            <p className="text-sm text-muted-foreground">Target</p>
            <p className="mt-1 text-xl font-bold tabular-nums text-[#e6a817]">
              {formatCompactNaira(caseItem.target)}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-sm text-muted-foreground">Timeline</p>
            <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-[#e85d4c] sm:justify-end">
              <CalendarIcon />
              <span>{caseItem.daysLeft} days left</span>
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}

function CasesSection({ section }: { section: PatientMyCasesSection }) {
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 className="text-base font-bold text-foreground">{section.title}</h2>
        {section.dateLine ? (
          <p className="mt-0.5 text-sm text-muted-foreground">{section.dateLine}</p>
        ) : null}
      </div>
      <div className="space-y-4 p-5 md:p-6">
        {section.cases.map((item) => (
          <CaseCard key={item.id} caseItem={item} />
        ))}
      </div>
    </section>
  );
}

export function PatientMyCasesPage() {
  return (
    <div className="mt-10 space-y-6 pb-4">
      {MOCK_PATIENT_MY_CASES_SECTIONS.map((section) => (
        <CasesSection key={section.id} section={section} />
      ))}
    </div>
  );
}
