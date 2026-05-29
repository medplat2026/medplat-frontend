"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { CreatePatientModal } from "@/components/dashboard/create-patient-modal";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { formatCompactNaira, formatFullNaira } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import { hospitalDashboardQueryKey, hospitalService } from "@/services/hospital.service";
import type { APIError } from "@/types/api";
import type { HospitalDashboardData, HospitalDashboardRecentCase } from "@/types/hospital-dashboard";

const CASE_AVATAR_PLACEHOLDER = "/assets/dashboard/case-avatar-placeholder.svg";

const STAT_CARD_META = [
  {
    label: "Total Patients",
    field: "total_patients" as const,
    tone: "blue" as const,
    image: "/assets/dashboard/stat-card1.jpg",
  },
  {
    label: "Total Cases",
    field: "total_cases" as const,
    tone: "violet" as const,
    image: "/assets/dashboard/stat-card2.jpg",
  },
  {
    label: "Active Cases",
    field: "active_cases" as const,
    tone: "green" as const,
    image: "/assets/dashboard/stat-card3.jpg",
  },
  {
    label: "Pending Cases",
    field: "pending_cases" as const,
    tone: "amber" as const,
    image: "/assets/dashboard/stat-card4.jpg",
  },
];

function caseCountLabel(n: number): string {
  return `${n} ${n === 1 ? "case" : "cases"}`;
}

function pickString(row: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = row[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
}

function patientNameFromRow(row: Record<string, unknown>): string {
  const nested = row.patient;
  if (nested && typeof nested === "object" && !Array.isArray(nested)) {
    const p = nested as Record<string, unknown>;
    const combined = [pickString(p, ["first_name"]), pickString(p, ["last_name"])]
      .filter(Boolean)
      .join(" ")
      .trim();
    const fromNested =
      pickString(p, ["full_name", "name"]) ?? (combined.length > 0 ? combined : undefined);
    if (fromNested) return fromNested;
  }
  return (
    pickString(row, ["patient_name", "patient_full_name", "full_name", "name"]) ?? "Patient"
  );
}

function formatAmountField(row: Record<string, unknown>): string {
  const raw = row.amount ?? row.funding_goal ?? row.target_amount ?? row.goal;
  if (typeof raw === "number" && Number.isFinite(raw)) return formatFullNaira(raw);
  if (typeof raw === "string" && raw.trim()) return raw.trim();
  return "—";
}

function progressFromRow(row: Record<string, unknown>): number | null {
  const keys = ["progress", "funding_progress_percent", "progress_percent", "percent_funded"];
  for (const k of keys) {
    const v = row[k];
    const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
    if (Number.isFinite(n) && n >= 0 && n <= 100) return Math.round(n);
  }
  return null;
}

function daysLeftFromRow(row: Record<string, unknown>): string | null {
  const v = row.days_left ?? row.days_remaining ?? row.days_left_to_fund;
  const n = typeof v === "number" ? v : typeof v === "string" ? Number(v) : NaN;
  if (!Number.isFinite(n) || n < 0) return null;
  return `${Math.round(n)} days left`;
}

function statusFromRow(row: Record<string, unknown>): string | null {
  const s = row.status ?? row.case_status;
  if (typeof s === "string" && s.trim()) return s.trim();
  return null;
}

function procedureVerifiedFromRow(row: Record<string, unknown>): boolean {
  const v =
    row.procedure_verified ??
    row.procedureVerified ??
    row.procedure_verified_flag ??
    row.is_procedure_verified;
  return v === true || v === "true" || v === 1;
}

function procedureFromRow(row: Record<string, unknown>): string {
  return (
    pickString(row, [
      "procedure",
      "procedure_type",
      "medical_case_type",
      "treatment",
      "title",
    ]) ?? "—"
  );
}

function rowKey(row: Record<string, unknown>, index: number): string {
  const id = row.id ?? row.case_id ?? row.uuid;
  if (typeof id === "string" && id) return id;
  if (typeof id === "number" && Number.isFinite(id)) return String(id);
  return `recent-case-${index}`;
}

type RecentCaseUi = {
  key: string;
  name: string;
  procedure: string;
  procedureVerified: boolean;
  amount: string;
  daysLeft: string | null;
  progress: number | null;
  status: string | null;
};

function mapRecentCaseForUi(row: HospitalDashboardRecentCase, index: number): RecentCaseUi {
  return {
    key: rowKey(row, index),
    name: patientNameFromRow(row),
    procedure: procedureFromRow(row),
    procedureVerified: procedureVerifiedFromRow(row),
    amount: formatAmountField(row),
    daysLeft: daysLeftFromRow(row),
    progress: progressFromRow(row),
    status: statusFromRow(row),
  };
}

function apiErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as APIError).message;
    if (typeof m === "string" && m.trim()) return m.trim();
  }
  return "Failed to load dashboard.";
}

function StatCard({
  label,
  value,
  tone,
  image,
}: {
  label: string;
  value: string;
  tone: "blue" | "violet" | "green" | "amber";
  image: string;
}) {
  const toneStyle = {
    blue: {
      overlay:
        "bg-gradient-to-br from-sky-50/95 from-0% via-sky-100/65 via-45% to-sky-500/20 to-100%",
      label: "text-blue-600",
      value: "text-blue-600",
    },
    violet: {
      overlay:
        "bg-gradient-to-br from-violet-50/95 from-0% via-violet-100/60 via-45% to-violet-600/22 to-100%",
      label: "text-violet-500",
      value: "text-violet-500",
    },
    green: {
      overlay:
        "bg-gradient-to-br from-teal-50/95 from-0% via-emerald-100/58 via-45% to-teal-600/20 to-100%",
      label: "text-teal-700",
      value: "text-teal-700",
    },
    amber: {
      overlay:
        "bg-gradient-to-br from-orange-50/95 from-0% via-amber-100/58 via-45% to-orange-500/22 to-100%",
      label: "text-amber-600",
      value: "text-amber-600",
    },
  }[tone];

  return (
    <div
      className={cn(
        "relative h-[128px] overflow-hidden rounded-lg shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
        "ring-1 ring-black/[0.04]",
      )}
    >
      <div
        className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${image})` }}
        aria-hidden
      />
      <div className={cn("absolute inset-0", toneStyle.overlay)} aria-hidden />
      <div className="relative z-10 flex h-full flex-col justify-center px-5 py-4">
        <p
          className={cn(
            "text-base font-bold uppercase leading-tight tracking-[0.05em]",
            toneStyle.label,
          )}
        >
          {label}
        </p>
        <p className={cn("mt-2 text-xl font-bold tracking-tight tabular-nums", toneStyle.value)}>{value}</p>
      </div>
    </div>
  );
}

function StatCardSkeleton() {
  return (
    <div className="relative h-[128px] overflow-hidden rounded-lg bg-muted/50 ring-1 ring-black/[0.04]">
      <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-muted to-muted/30" />
    </div>
  );
}

function QuickActionIcon({ type }: { type: "question" | "document" }) {
  if (type === "question") {
    return (
      <div
        className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#E6CD68] text-lg font-bold leading-none text-white shadow-sm"
        aria-hidden
      >
        ?
      </div>
    );
  }
  return (
    <div
      className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-[#E68E68] text-white shadow-sm"
      aria-hidden
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="translate-y-px">
        <path
          d="M8 5h9a2 2 0 0 1 2 2v10a1 1 0 0 1-.55.89l-4 2a1 1 0 0 1-.9 0l-4-2A1 1 0 0 1 9 17V7a2 2 0 0 1 2-2Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="m10 10.5 1.8 1.7 3.2-3.2"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

const quickActionCtaClass =
  "shrink-0 rounded-xl border border-onboarding-teal-dark bg-transparent px-4 py-2 text-sm font-semibold text-onboarding-teal-dark shadow-none hover:bg-[#2a9d8f]/8";

type FundingOverviewProps = HospitalDashboardData["funded_overview"];

function FundingOverview({ total_funded, funds_raised, funds_remaining }: FundingOverviewProps) {
  const cx = 100;
  const cy = 100;
  const R = 88;
  const maxValue = Math.max(total_funded, funds_raised, funds_remaining, 1);

  const chartSegments = [
    {
      label: "Total funded",
      value: total_funded,
      display: formatCompactNaira(total_funded),
      fill: "#0D64C0",
      textFill: "#ffffff",
      startAngle: (2 * Math.PI) / 3,
      endAngle: (4 * Math.PI) / 3,
    },
    {
      label: "Funds raised",
      value: funds_raised,
      display: formatCompactNaira(funds_raised),
      fill: "#FFE748",
      textFill: "#121212",
      startAngle: (4 * Math.PI) / 3,
      endAngle: 2 * Math.PI,
    },
    {
      label: "Funds remaining",
      value: funds_remaining,
      display: formatCompactNaira(funds_remaining),
      fill: "#F67E7E",
      textFill: "#121212",
      startAngle: 0,
      endAngle: (2 * Math.PI) / 3,
    },
  ] as const;

  function wedgePath(r: number, a0: number, a1: number): string {
    const x0 = cx + r * Math.cos(a0);
    const y0 = cy + r * Math.sin(a0);
    const x1 = cx + r * Math.cos(a1);
    const y1 = cy + r * Math.sin(a1);
    const delta = a1 > a0 ? a1 - a0 : a1 + 2 * Math.PI - a0;
    const largeArc = delta > Math.PI ? 1 : 0;
    return `M ${cx} ${cy} L ${x0} ${y0} A ${r} ${r} 0 ${largeArc} 1 ${x1} ${y1} Z`;
  }

  function labelPoint(r: number, a0: number, a1: number): { x: number; y: number } {
    const mid = (a0 + a1) / 2;
    const rr = Math.max(r * 0.5, 16);
    return {
      x: cx + rr * Math.cos(mid),
      y: cy + rr * Math.sin(mid),
    };
  }

  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 pb-5 pt-5 shadow-sm">
      <div className="border-b border-[#E2E8F0] pb-3">
        <h2 className="text-center text-base font-medium text-[#717D8A]">Funding Overview</h2>
      </div>

      <div className="mt-5 flex flex-col gap-5">
        <div className="mx-auto w-full max-w-[220px]">
          <svg viewBox="0 0 200 200" className="h-auto w-full overflow-visible" aria-label="Funding polar area chart">
            <circle cx={cx} cy={cy} r={R} fill="#F1F5F9" stroke="#E2E8F0" strokeWidth={1} />
            {chartSegments.map((seg) => {
              const r = (R * seg.value) / maxValue;
              return (
                <path
                  key={seg.label}
                  d={wedgePath(r, seg.startAngle, seg.endAngle)}
                  fill={seg.fill}
                  stroke="white"
                  strokeWidth={1.5}
                  strokeLinejoin="round"
                />
              );
            })}
            {chartSegments.map((seg) => {
              const r = (R * seg.value) / maxValue;
              const { x, y } = labelPoint(r, seg.startAngle, seg.endAngle);
              return (
                <text
                  key={`t-${seg.label}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={seg.textFill}
                  className="pointer-events-none select-none"
                  style={{ fontSize: "12px", fontWeight: 700 }}
                >
                  {seg.display}
                </text>
              );
            })}
          </svg>
        </div>

        <ul className="flex flex-col gap-2.5 self-end text-left">
          {chartSegments.map((seg) => (
            <li key={seg.label} className="flex items-center gap-2.5 text-sm font-normal text-[#121212]">
              <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: seg.fill }} aria-hidden />
              {seg.label}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function FundingOverviewSkeleton() {
  return (
    <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 pb-5 pt-5 shadow-sm">
      <div className="border-b border-[#E2E8F0] pb-3">
        <div className="mx-auto h-5 w-40 animate-pulse rounded bg-muted" />
      </div>
      <div className="mx-auto mt-5 h-[200px] max-w-[220px] animate-pulse rounded-full bg-muted/60" />
    </div>
  );
}

function CaseAvatar({ name }: { name: string }) {
  return (
    <div className="relative w-[82px] shrink-0 self-stretch min-h-[52px] overflow-hidden rounded-lg ring-1 ring-black/[0.08]">
      <Image
        src={CASE_AVATAR_PLACEHOLDER}
        alt=""
        fill
        className="object-cover object-center"
        sizes="52px"
      />
      <span className="sr-only">Profile photo for {name}</span>
    </div>
  );
}

function ProcedureCheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" className="shrink-0 text-onboarding-blue" aria-hidden>
      <path
        d="m6 12 4 4 8-9"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function FilterIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M4 5h16l-6.5 8.2V19l-3 1.5v-7.3L4 5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const QUICK_ACTION_ROWS = [
  {
    id: "awaiting-submission",
    countField: "awaiting_submission" as const,
    buildTitle: (n: number) => `${caseCountLabel(n)} awaiting submission`,
    description: "Upload required medical reports to proceed",
    cta: "Submit now",
    icon: "question" as const,
    rowStyle: "highlight" as const,
  },
  {
    id: "missing-docs",
    countField: "missing_documents" as const,
    buildTitle: (n: number) => `${caseCountLabel(n)} missing documents`,
    description: "Awaiting admin review and approval",
    cta: "Upload",
    icon: "document" as const,
    rowStyle: "default" as const,
  },
  {
    id: "pending-approval",
    countField: "pending_approval" as const,
    buildTitle: (n: number) => `${caseCountLabel(n)} pending approval`,
    description: "Complete required details and submit for review",
    cta: "Review",
    icon: "question" as const,
    rowStyle: "default" as const,
  },
] as const;

const EMPTY_FUNDING: FundingOverviewProps = {
  total_funded: 0,
  funds_raised: 0,
  funds_remaining: 0,
};

const EMPTY_QUICK: HospitalDashboardData["quick_actions"] = {
  awaiting_submission: 0,
  missing_documents: 0,
  pending_approval: 0,
};

export function DashboardOverview() {
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    queryKey: hospitalDashboardQueryKey,
    queryFn: () => hospitalService.getDashboard(),
  });

  const dashboard = data;
  const showSkeleton = isPending && !dashboard;

  const stats = useMemo(() => {
    if (!dashboard) {
      const value = isError ? "—" : "0";
      return STAT_CARD_META.map((m) => ({
        label: m.label,
        value,
        tone: m.tone,
        image: m.image,
      }));
    }
    return STAT_CARD_META.map((m) => ({
      label: m.label,
      value: String(dashboard[m.field]),
      tone: m.tone,
      image: m.image,
    }));
  }, [dashboard, isError]);

  const quickActionsUi = useMemo(() => {
    const qa = dashboard?.quick_actions ?? EMPTY_QUICK;
    return QUICK_ACTION_ROWS.map((row) => ({
      ...row,
      title: row.buildTitle(qa[row.countField]),
    }));
  }, [dashboard]);

  const recentCasesUi = useMemo(() => {
    if (!dashboard?.recent_cases?.length) return [];
    return dashboard.recent_cases.map(mapRecentCaseForUi);
  }, [dashboard]);

  return (
    <div className="space-y-12">
      {isError ? (
        <div
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>{apiErrorMessage(error)}</p>
          <Button
            type="button"
            variant="outline"
            className="shrink-0 border-red-300 bg-white text-red-900 hover:bg-red-100"
            onClick={() => void refetch()}
            disabled={isFetching}
          >
            Retry
          </Button>
        </div>
      ) : null}

      <div className="flex flex-wrap items-center justify-end gap-3 mt-4">
        <CreatePatientModal />
        <Link
          href={ROUTES.hospital.patients}
          className={cn(
            "inline-flex items-center justify-center gap-2 rounded-xl border border-onboarding-blue bg-white px-5 py-2 text-sm font-semibold text-onboarding-blue shadow-sm transition-colors hover:bg-muted",
          )}
        >
          + Create Case
        </Link>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {showSkeleton
          ? STAT_CARD_META.map((m) => <StatCardSkeleton key={m.label} />)
          : stats.map((s) => <StatCard key={s.label} {...s} />)}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)]">
        <div className="min-w-0 rounded-2xl border border-border bg-white px-6 pb-6 pt-5 shadow-sm">
          <div className="border-b border-border pb-4">
            <h2 className="text-center text-base font-medium text-muted-foreground">Quick Action</h2>
          </div>
          {showSkeleton ? (
            <ul className="mt-5 flex flex-col gap-3">
              {[0, 1, 2].map((i) => (
                <li key={i} className="h-[100px] animate-pulse rounded-xl bg-muted/50" />
              ))}
            </ul>
          ) : isError && !dashboard ? (
            <p className="mt-5 text-center text-sm text-muted-foreground">Quick action counts unavailable.</p>
          ) : (
            <ul className="mt-5 flex flex-col gap-3">
              {quickActionsUi.map((row) => (
                <li
                  key={row.id}
                  className={cn(
                    "flex flex-col gap-3 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4",
                    row.rowStyle === "highlight"
                      ? "border-[#efe0bc] bg-[#fdfaf3]"
                      : "border-border bg-white",
                  )}
                >
                  <div className="flex min-w-0 flex-1 items-start gap-3 sm:items-center">
                    <QuickActionIcon type={row.icon} />
                    <div className="min-w-0">
                      <p className="font-bold text-foreground">{row.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{row.description}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    className={quickActionCtaClass + " text-xs rounded-sm text-[#105AA9] py-1"}
                  >
                    {row.cta}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="min-w-0">
          {showSkeleton ? (
            <FundingOverviewSkeleton />
          ) : isError && !dashboard ? (
            <div className="rounded-2xl border border-[#E2E8F0] bg-white px-5 py-10 text-center text-sm text-muted-foreground shadow-sm">
              Funding overview unavailable.
            </div>
          ) : (
            <FundingOverview {...(dashboard?.funded_overview ?? EMPTY_FUNDING)} />
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h2 className="text-base font-bold text-foreground">Recent Cases</h2>
            <p className="mt-1 text-sm text-muted-foreground">Latest funding activity</p>
          </div>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:items-center lg:w-auto lg:justify-end">
            <label className="relative block w-full sm:min-w-[200px] lg:min-w-[240px]">
              <span className="sr-only">Search cases</span>
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
                  <path d="M16 16 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
              </span>
              <input
                type="search"
                placeholder="Search..."
                className="w-full rounded-xl border border-input-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-onboarding-blue/25 placeholder:text-muted-foreground focus:ring-2"
              />
            </label>
            <Button
              type="button"
              variant="outline"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-input-border bg-white py-2.5 text-sm font-semibold text-foreground shadow-sm sm:w-auto sm:shrink-0"
            >
              <FilterIcon className="text-muted-foreground" />
              Filter
            </Button>
          </div>
        </div>

        {showSkeleton ? (
          <ul className="mt-6 space-y-3">
            {[0, 1, 2].map((i) => (
              <li key={i} className="h-24 animate-pulse rounded-2xl bg-muted/50" />
            ))}
          </ul>
        ) : isError && !dashboard ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">Unable to load recent cases.</p>
        ) : recentCasesUi.length === 0 ? (
          <p className="mt-6 text-center text-sm text-muted-foreground">No recent cases yet.</p>
        ) : (
          <ul className="mt-6 space-y-3">
            {recentCasesUi.map((c) => (
              <li
                key={c.key}
                className="rounded-2xl border border-[#e8ecf1] bg-white p-4 shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
              >
                <div className="flex items-stretch gap-3">
                  <CaseAvatar name={c.name} />
                  <div className="flex min-h-0 min-w-0 flex-1 flex-col justify-between gap-2">
                    <div className="min-w-0 shrink-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-bold text-foreground">{c.name}</p>
                          <p className="mt-1 flex items-center gap-1.5 text-xs font-light text-muted-foreground">
                            {c.procedureVerified ? <ProcedureCheckIcon /> : null}
                            <span>{c.procedure}</span>
                          </p>
                        </div>
                        <p className="shrink-0 text-sm font-bold text-foreground tabular-nums">{c.amount}</p>
                      </div>
                    </div>

                    {(typeof c.progress === "number" || c.status) && (
                      <div className="min-w-0 shrink-0 space-y-2">
                        {typeof c.progress === "number" ? (
                          <>
                            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#e8ecf1]">
                              <div
                                className="h-full rounded-full bg-onboarding-blue"
                                style={{ width: `${c.progress}%` }}
                              />
                            </div>
                            <div className="flex items-center justify-between gap-3 text-xs">
                              <span className="font-medium text-sky-500">{c.progress}% target reached</span>
                              {c.daysLeft ? (
                                <span className="shrink-0 text-muted-foreground">{c.daysLeft}</span>
                              ) : null}
                            </div>
                          </>
                        ) : null}
                        {c.status ? (
                          <div
                            className={cn(
                              "flex",
                              typeof c.progress === "number" ? "justify-end pt-1" : "justify-end",
                            )}
                          >
                            <span
                              className={cn(
                                "inline-flex rounded-full px-3 py-1 text-xs font-semibold",
                                c.status.toLowerCase() === "submitted"
                                  ? "bg-[#e0f2fe] text-[#0369a1]"
                                  : "bg-[#f3f4f6] text-[#4b5563]",
                              )}
                            >
                              {c.status}
                            </span>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex justify-end">
          <Link
            href={ROUTES.hospital.cases}
            className="inline-flex items-center justify-center rounded-xl bg-onboarding-blue px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-onboarding-blue-hover"
          >
            View all
          </Link>
        </div>
      </section>
    </div>
  );
}
