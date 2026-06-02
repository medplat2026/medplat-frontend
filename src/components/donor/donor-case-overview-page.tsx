"use client";

import Link from "next/link";
import { useState } from "react";
import type { DonorImpactTier } from "@/types/donor-case-overview";
import { MOCK_DONOR_CASE_OVERVIEW } from "@/data/mock-donor-case-overview";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

const tabKeys = ["aboutCase", "hospitalInfo", "update"] as const;
type TabKey = (typeof tabKeys)[number];

const tabLabels: Record<TabKey, string> = {
  aboutCase: "About Case",
  hospitalInfo: "Hospital Info",
  update: "Update",
};

function NairaMark({ className, strokeWidth = 2 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={cn("shrink-0", className)} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3v18M17 3v18M7 9.5h10M7 14.5h10"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}

function ImpactTierCard({ tier }: { tier: DonorImpactTier }) {
  if (tier.emphasized) {
    return (
      <li className="rounded-xl border border-amber-100/90 bg-[#fff9e6] p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-[#ea580c] shadow-sm">
            <NairaMark className="size-4.5 text-white" strokeWidth={2.35} />
          </span>
          <span className="text-lg font-bold tracking-tight text-[#c2410c]">{tier.amountFigure}</span>
        </div>
        <p className="mt-2.5 text-xs leading-relaxed text-[#64748b]">{tier.description}</p>
      </li>
    );
  }
  if (tier.tone === "blue") {
    return (
      <li className="rounded-xl border border-sky-100/90 bg-[#eff8ff] p-4 shadow-sm">
        <div className="flex flex-col gap-2.5">
          <span className="inline-flex size-8 items-center justify-center rounded-md bg-sky-300/35">
            <NairaMark className="size-4 text-white" strokeWidth={2.1} />
          </span>
          <p className="text-xs leading-relaxed text-[#64748b]">{tier.description}</p>
        </div>
      </li>
    );
  }
  return (
    <li className="rounded-xl border border-emerald-100/90 bg-[#ecfdf7] p-4 shadow-sm">
      <div className="flex items-start gap-2.5">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-emerald-300/35">
          <NairaMark className="size-3.5 text-white opacity-95" strokeWidth={2} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold tracking-wide text-emerald-400/75">{tier.amountFigure}</p>
          <p className="mt-1 text-xs leading-relaxed text-[#64748b]">{tier.description}</p>
        </div>
      </div>
    </li>
  );
}

export function DonorCaseOverviewPage() {
  const m = MOCK_DONOR_CASE_OVERVIEW;
  const [activeTab, setActiveTab] = useState<TabKey>("aboutCase");

  const tabBody: Record<TabKey, string> = {
    aboutCase: m.tabs.aboutCase,
    hospitalInfo: m.tabs.hospitalInfo,
    update: m.tabs.update,
  };

  return (
    <div className="space-y-6 pb-4">
      {/* Top overview row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Patient profile — Figma: icon column left (avatar, heart, verified); text column right */}
        <div className="rounded-3xl border border-sky-200/70 bg-[#E8F1FD] p-6 shadow-sm">
          <div className="grid grid-cols-[4rem_minmax(0,1fr)] gap-x-4 gap-y-4">
            <div className="col-start-1 row-start-1 row-span-2 flex justify-center self-start pt-0.5">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-full border border-sky-200/90 bg-white text-slate-900 shadow-sm">
                <svg className="size-9" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4 0-8 2-8 4v2h16v-2c0-2-4-4-8-4Z" />
                </svg>
              </div>
            </div>
            <div className="col-start-2 row-start-1 row-span-2 flex min-w-0 flex-col gap-1 self-start pt-0.5">
              <p className="text-base font-bold text-foreground">{m.patient.name}</p>
              <p className="text-sm leading-snug text-[#757575]">{m.patient.ageLabel}</p>
            </div>

            <div className="col-start-1 row-start-3 flex justify-center self-center" aria-hidden>
              <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#4A90E2"
                  strokeWidth="1.65"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="col-start-2 row-start-3 self-center text-sm leading-snug text-[#757575]">{m.patient.condition}</p>

            {m.patient.verified ? (
              <>
                <div className="col-start-1 row-start-4 flex justify-center self-center" aria-hidden>
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#4A90E2] shadow-sm">
                    <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M6 12.5 10 16.5 18 8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
                    </svg>
                  </span>
                </div>
                <p className="col-start-2 row-start-4 self-center text-sm leading-snug text-[#757575]">Verified Case</p>
              </>
            ) : null}
          </div>
        </div>

        {/* Recent donations — Figma: mint icon well, blue outline heart, blue amounts */}
        <div className="rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-[#6B7280]">
            Recent donations
          </p>
          <ul className="space-y-4">
            {m.recentDonations.map((row) => (
              <li key={row.donorLabel + row.timeAgo} className="flex items-center gap-3">
                <span
                  className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#E6F9F1]"
                  aria-hidden
                >
                  <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                      stroke="#2563EB"
                      strokeWidth="1.65"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-black">{row.donorLabel}</p>
                  <p className="text-xs text-[#6B7280]">{row.timeAgo}</p>
                </div>
                <span className="shrink-0 text-sm font-bold text-[#2563EB]">{row.amountLabel}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Trending — Figma: pale yellow, no border/shadow; block centered; copy aligns under title */}
        <div className="flex min-h-[200px] items-center justify-center rounded-2xl bg-[#FEF9C3] px-6 py-10">
          <div className="w-full max-w-68">
            <div className="grid grid-cols-[auto_1fr] items-start gap-x-2.5 gap-y-2">
              <span className="col-start-1 row-start-1 mt-0.5 flex shrink-0" aria-hidden>
                <svg className="size-6" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 16h3l3-6 4 4 5-9h3"
                    stroke="#EAB308"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 6h4v4"
                    stroke="#EAB308"
                    strokeWidth="1.85"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <p className="col-start-2 row-start-1 text-base font-bold text-black">{m.trending.title}</p>
              <p className="col-start-2 row-start-2 text-sm leading-relaxed text-[#4B5563]">{m.trending.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Funding progress */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
        <h2 className="text-md font-bold text-foreground">{m.funding.title}</h2>
        <div className="mt-4 rounded-xl border border-border bg-muted/30 p-4 md:p-5">
          <div className="flex flex-wrap items-end justify-between gap-2">
            <div>
              <p className="text-xl font-bold tracking-tight text-onboarding-blue md:text-3xl">
                {m.funding.raisedDisplay}
              </p>
              <p className="text-sm text-muted-foreground">{m.funding.goalDisplay}</p>
            </div>
          </div>
          <div className="mt-4">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
              <div
                className="h-full rounded-full bg-onboarding-blue transition-all"
                style={{ width: `${m.funding.percent}%` }}
              />
            </div>
            <p className="mt-2 text-center text-sm font-medium text-onboarding-blue">{m.funding.percentLabel}</p>
          </div>
          <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-border/80 pt-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Donors</p>
              <p className="text-2xl font-bold text-onboarding-blue">{m.funding.donorCount}</p>
            </div>
            <div className="text-right">
              <p className="text-xs font-medium text-muted-foreground">Timeline</p>
              <p className="mt-0.5 flex items-center justify-end gap-1.5 text-lg font-semibold text-orange-600">
                <svg className="size-5 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M7 4h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                  <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                {m.funding.daysLeft} days left
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main + impact sidebar */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-[#f4f5f7] px-8 py-10 shadow-[0_2px_12px_rgba(15,23,42,0.07)]">
              <div className="flex size-22 items-center justify-center rounded-full border border-slate-100/90 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
                <svg className="size-11" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="9" r="3.25" stroke="#0f172a" strokeWidth="1.75" />
                  <path
                    d="M6.5 20.25v-.5a4.25 4.25 0 0 1 4.25-4.25h2.5a4.25 4.25 0 0 1 4.25 4.25v.5"
                    stroke="#0f172a"
                    strokeWidth="1.75"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="mt-5 text-sm font-medium text-slate-600">Patient Photo</p>
            </div>
            <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
              <h3 className="text-xl font-bold text-foreground">{m.patient.name}</h3>
              <p className="mt-1 text-sm font-semibold text-teal-600">{m.patient.condition}</p>
              <p className="mt-3 text-sm leading- text-muted-foreground">{m.summaryShort}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
            <div className="flex gap-6 border-b border-border">
              {tabKeys.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveTab(key)}
                  className={cn(
                    "-mb-px border-b-2 pb-3 text-sm font-semibold transition-colors",
                    activeTab === key
                      ? "border-teal-500 text-teal-700"
                      : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {tabLabels[key]}
                </button>
              ))}
            </div>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{tabBody[activeTab]}</p>
            <div className="mt-5 flex justify-end">
              <Link
                href={ROUTES.donor.viewDetails}
                className="text-sm font-semibold text-teal-600 underline-offset-4 hover:underline"
              >
                View full case details →
              </Link>
            </div>
          </div>
        </div>

        <aside className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6">
          <h3 className="text-lg font-bold text-foreground">Impact of Your Donation</h3>
          <ul className="mt-4 space-y-3">
            {m.impactTiers.map((tier) => (
              <ImpactTierCard key={`${tier.tone}-${tier.amountFigure}`} tier={tier} />
            ))}
          </ul>
          <Link
            href={ROUTES.donor.makeDonations}
            className="mt-5 flex w-full items-center justify-center rounded-full bg-onboarding-blue py-3.5 text-sm font-bold text-white shadow-[0_4px_14px_rgba(37,99,235,0.35)] transition-colors hover:bg-onboarding-blue-hover"
          >
            Make a Donation
          </Link>
          <ul className="mt-4 space-y-2 border-t border-slate-200/90 pt-4 text-xs text-[#64748b]">
            {m.trustBullets.map((line) => (
              <li key={line} className="flex gap-2 pl-0.5">
                <span className="text-slate-400" aria-hidden>
                  •
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
