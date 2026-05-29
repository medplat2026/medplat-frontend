"use client";

import { useMemo, useState } from "react";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MOCK_PATIENT_FUNDING_BUBBLE_STATS,
  MOCK_PATIENT_FUNDING_DONATIONS,
} from "@/data/mock-patient-dashboard";
import { formatFullNaira, formatNairaSpaced } from "@/lib/format-currency";
import { cn } from "@/lib/utils";
import type { PatientFundingBubbleStats, PatientFundingDonation } from "@/types/patient-dashboard";

const TEAL = "#008B8B";
const CHART_GREEN = "#88C08E";
const CHART_PURPLE = "#9480C6";
const CHART_SLATE = "#9199B1";
const LEGEND_LARGEST = "#008B8B";

function DonationHeartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DonationRow({ donation }: { donation: PatientFundingDonation }) {
  return (
    <li className="border-b border-[#e8ecf1] py-5 last:border-b-0 last:pb-0 first:pt-0">
      <div className="flex gap-3">
        <div
          className={cn(
            "flex size-11 shrink-0 items-center justify-center rounded-xl",
            "bg-linear-to-b from-onboarding-teal-dark to-[#008B8B] shadow-sm",
          )}
          aria-hidden
        >
          <DonationHeartIcon />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-1">
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{donation.donorDisplayName}</p>
              <p className="mt-0.5 text-sm text-muted-foreground">{donation.dateLabel}</p>
            </div>
            <p
              className="shrink-0 text-lg font-bold tabular-nums md:text-xl"
              style={{ color: TEAL }}
            >
              {formatFullNaira(donation.amount)}
            </p>
          </div>
          {donation.message ? (
            <p className="mt-3 rounded-full bg-[#f1f5f9] px-4 py-2.5 text-sm leading-relaxed text-muted-foreground">
              &ldquo;{donation.message}&rdquo;
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

function FundingBubbleChart({ stats }: { stats: PatientFundingBubbleStats }) {
  return (
    <div
      className="flex w-max max-w-full shrink-0 flex-col items-stretch gap-8 sm:flex-row sm:items-center sm:gap-8 md:gap-12 lg:gap-16"
      aria-label="Funding statistics bubble chart"
    >
      {/* Cluster layout: green back (top-right), purple mid-left, grey front (bottom) — strong pairwise overlap */}
      <div className="-mx-1 overflow-x-auto px-1 pb-1 sm:mx-0 sm:overflow-visible sm:px-0 sm:pb-0">
        <div className="relative mx-auto h-[210px] w-[260px] shrink-0 sm:mx-0">
          {/* Largest — mint, top-right, lowest z */}
          <div
            className="absolute left-[96px] top-[4px] z-0 flex size-[144px] items-center justify-center rounded-full text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: CHART_GREEN }}
          >
            <span className="px-2 text-sm font-bold leading-tight tracking-tight text-white md:text-[15px]">
              {formatNairaSpaced(stats.largestAmount)}
            </span>
          </div>
          {/* Average — purple, left, overlaps green; sits under grey */}
          <div
            className="absolute left-0 top-[46px] z-10 flex size-[118px] items-center justify-center rounded-full text-center shadow-[0_2px_12px_rgba(0,0,0,0.08)]"
            style={{ backgroundColor: CHART_PURPLE }}
          >
            <span className="px-2 text-xs font-bold leading-tight tracking-tight text-white md:text-sm">
              {formatNairaSpaced(stats.averageAmount)}
            </span>
          </div>
          {/* Recent — steel, bottom, highest z; overlaps both purple and green */}
          <div
            className="absolute left-[84px] top-[112px] z-20 flex size-[92px] items-center justify-center rounded-full text-center shadow-[0_2px_12px_rgba(0,0,0,0.1)]"
            style={{ backgroundColor: CHART_SLATE }}
          >
            <span className="px-1.5 text-[11px] font-bold leading-tight tracking-tight text-white md:text-xs">
              {formatNairaSpaced(stats.recentAmount)}
            </span>
          </div>
        </div>
      </div>

      <ul className="flex flex-col gap-4 sm:min-w-[190px] sm:justify-center sm:pl-2 md:pl-4">
        <li className="flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: LEGEND_LARGEST }} aria-hidden />
          Largest Donation
        </li>
        <li className="flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: CHART_PURPLE }} aria-hidden />
          Average Donation
        </li>
        <li className="flex items-center gap-3 text-sm font-medium text-foreground">
          <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: CHART_SLATE }} aria-hidden />
          Recent Donation
        </li>
      </ul>
    </div>
  );
}

const INITIAL_DONATION_COUNT = 2;

export function PatientFundingPage() {
  const [expanded, setExpanded] = useState(false);
  const donations = MOCK_PATIENT_FUNDING_DONATIONS;
  const visibleDonations = useMemo(
    () => (expanded ? donations : donations.slice(0, INITIAL_DONATION_COUNT)),
    [donations, expanded],
  );
  const hasMore = donations.length > INITIAL_DONATION_COUNT;

  return (
    <div className="mt-10 pb-4">
      <section
        className={cn(
          "overflow-hidden rounded-2xl border border-[#e8ecf1] bg-white",
          "shadow-[0_4px_24px_rgba(15,23,42,0.06)]",
        )}
      >
        <div className="border-b border-[#e8ecf1] px-5 pb-3 pt-5 md:px-8 md:pb-4 md:pt-6">
          <h2 className="text-base font-semibold md:text-lg" style={{ color: TEAL }}>
            Recent donations
          </h2>
          <ul>{visibleDonations.map((d) => <DonationRow key={d.id} donation={d} />)}</ul>
          {hasMore ? (
            <div className="flex justify-end pt-1">
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="inline-flex items-center gap-1 text-sm font-semibold transition-opacity hover:opacity-80"
                style={{ color: TEAL }}
              >
                {expanded ? "Show fewer donations" : "See more donations"}
                <HugeiconsIcon
                  icon={ArrowRight02Icon}
                  size={14}
                  strokeWidth={1.75}
                  primaryColor="currentColor"
                  className={cn("shrink-0 transition-transform", expanded && "rotate-90")}
                  aria-hidden
                />
              </button>
            </div>
          ) : null}
        </div>

        <div className="relative px-5 pb-5 pt-0 md:px-8 md:pb-6 md:pt-0">
          <div className="flex flex-row items-start gap-2 sm:gap-3 md:gap-4">
            <div className="shrink-0 self-start">
              <div className="w-fit max-w-full border-b border-[#e8ecf1] pb-1.5 pr-6 md:pr-8">
                <h3 className="text-sm font-medium leading-snug text-muted-foreground">Funding Statistics</h3>
              </div>
            </div>
            <div className="min-w-0 flex-1 flex justify-start overflow-x-auto pb-0.5">
              <FundingBubbleChart stats={MOCK_PATIENT_FUNDING_BUBBLE_STATS} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
