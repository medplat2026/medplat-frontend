import Link from "next/link";
import { ROUTES } from "@/constants/routes";
import type { PatientCaseDetail } from "@/types/patient-dashboard";
import { formatCompactNaira } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { ArrowLeft02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      className={cn("shrink-0", className)}
      aria-hidden
    >
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

function DocumentListIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CheckCircleIcon() {
  return (
    <span
      className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-onboarding-blue text-white"
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function detailProgressPercent(detail: PatientCaseDetail): number {
  if (typeof detail.progressPercent === "number") {
    return Math.min(100, Math.max(0, detail.progressPercent));
  }
  if (detail.target <= 0) return 0;
  return Math.min(100, Math.round((detail.raised / detail.target) * 100));
}

type PatientCaseDetailPageProps = {
  detail: PatientCaseDetail;
};

export function PatientCaseDetailPage({ detail }: PatientCaseDetailPageProps) {
  const progress = detailProgressPercent(detail);

  return (
    <div className="space-y-10 pb-6 pt-2 md:pt-0">
      <Link
        href={ROUTES.patient.cases}
        className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-onboarding-blue transition-colors hover:text-onboarding-blue-hover hover:underline"
      >
        <span aria-hidden>
          <HugeiconsIcon icon={ArrowLeft02Icon} size={14} className="shrink-0" />
        </span>
        Back to my cases
      </Link>

      <section className="rounded-2xl border border-border bg-white p-5 md:p-6">
        <h2 className="text-base font-bold text-foreground">Hospital Information</h2>
        <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <LocationIcon className="text-muted-foreground" />
          <span>{detail.hospital}</span>
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-[#fefdf0] p-5 md:p-6">
        <h2 className="text-base font-bold text-foreground">My Story</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{detail.story}</p>
      </section>

      <section className="rounded-2xl border border-[#e2e8f0] bg-[#ebf3ff] p-5 md:p-6">
        <h2 className="text-base font-bold text-foreground">Treatment Plan</h2>
        <p className="mt-3 text-sm leading-relaxed text-foreground/90">{detail.treatmentPlan}</p>
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
          <div className="mb-4 flex items-center gap-3">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-sky-100 text-onboarding-blue">
              <DocumentListIcon />
            </span>
            <h2 className="text-base font-bold text-foreground">Uploaded Documents</h2>
          </div>
          <ul className="space-y-3">
            {detail.documents.map((doc) => (
              <li
                key={doc.name}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#f3f4f6] px-4 py-3"
              >
                <span className="min-w-0 truncate text-sm font-medium text-foreground">{doc.name}</span>
                <CheckCircleIcon />
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
          <h2 className="text-base font-semibold text-onboarding-blue">Funding Progress</h2>

          <div className="mt-5">
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e8ecf1]">
              <div
                className="h-full rounded-full bg-onboarding-blue"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs font-medium text-onboarding-blue">
              {progress}% target reached
            </p>
          </div>

          <div className="mt-6 space-y-5">
            <div>
              <p className="text-sm text-muted-foreground">Raised</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-onboarding-blue">
                {formatCompactNaira(detail.raised)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-[#e6a817]">
                {formatCompactNaira(detail.target)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Days left</p>
              <p className="mt-1 flex items-center gap-2 text-base font-semibold text-[#e85d4c]">
                <CalendarIcon />
                <span>{detail.daysLeft} days left</span>
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
