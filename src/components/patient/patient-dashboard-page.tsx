"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ArrowRight02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  MOCK_PATIENT_ACTIVE_CASE,
  MOCK_PATIENT_FUNDING,
  MOCK_PATIENT_NOTIFICATIONS,
} from "@/data/mock-patient-dashboard";
import { formatCompactNaira } from "@/lib/format-currency";
import type { PatientActiveCase, PatientFundingOverview, PatientNotification } from "@/types/patient-dashboard";
import { ROUTES } from "@/constants/routes";

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

function CopyIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="9" y="9" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path
        d="M6 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v1"
        stroke="currentColor"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ActiveCasesSection({ activeCase }: { activeCase: PatientActiveCase }) {
  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 className="text-base font-bold text-foreground">Active Cases</h2>
      </div>
      <div className="p-5 md:p-6">
        <article className="rounded-2xl border border-[#e8ecf1] bg-white p-5 md:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-base font-bold text-onboarding-blue">{activeCase.title}</h3>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                <LocationIcon />
                <span>{activeCase.hospital}</span>
              </p>
            </div>
            <span className="inline-flex shrink-0 rounded-full bg-onboarding-blue px-3 py-1 text-xs font-semibold text-white">
              {activeCase.status}
            </span>
          </div>

          <div className="mt-6">
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-[#e8ecf1]">
              <div
                className="h-full rounded-full bg-onboarding-blue"
                style={{ width: `${activeCase.progressPercent}%` }}
              />
            </div>
            <p className="mt-2 text-center text-xs font-medium text-sky-500">
              {activeCase.progressPercent}% target reached
            </p>
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            <div>
              <p className="text-sm text-muted-foreground">Raised</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-onboarding-blue">
                {formatCompactNaira(activeCase.raised)}
              </p>
            </div>
            <div className="sm:text-center">
              <p className="text-sm text-muted-foreground">Target</p>
              <p className="mt-1 text-xl font-bold tabular-nums text-[#e6a817]">
                {formatCompactNaira(activeCase.target)}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-sm text-muted-foreground">Timeline</p>
              <p className="mt-1 flex items-center gap-1.5 text-base font-semibold text-[#e85d4c] sm:justify-end">
                <CalendarIcon />
                <span>{activeCase.daysLeft} days left</span>
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

function ShareCaseSection({ shareUrl }: { shareUrl: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard.");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Unable to copy link. Please try again.");
    }
  }

  return (
    <section className="rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 className="text-base font-bold text-foreground">Share Your Case</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share your case to receive support from donors
        </p>
      </div>
      <div className="flex w-full flex-col gap-4 px-5 pb-5 pt-2 sm:flex-row sm:items-center sm:justify-start sm:gap-3 sm:pb-6 md:px-6 md:pb-8">
        <div className="flex min-w-0 w-full max-w-full items-center justify-start rounded-xl border border-border bg-[#F5F4F4] px-4 py-4 text-left sm:max-w-sm sm:flex-none sm:px-5 sm:py-3.5 md:max-w-2xl">
          <p className="w-full min-w-0 truncate text-left text-sm text-muted-foreground">{shareUrl}</p>
        </div>
        <Button
          type="button"
          variant="brand"
          className="w-full shrink-0 rounded-xl px-6 py-3 sm:w-auto"
          onClick={handleCopy}
        >
          <CopyIcon />
          {copied ? "Copied" : "Copy"}
        </Button>
      </div>
    </section>
  );
}

function NotificationIcon({ type }: { type: PatientNotification["type"] }) {
  if (type === "donation") {
    return (
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f4fc] text-base font-bold text-onboarding-teal-dark"
        aria-hidden
      >
        ₦
      </div>
    );
  }
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-muted-foreground"
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function RecentNotificationsSection({ notifications }: { notifications: PatientNotification[] }) {
  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-white shadow-sm">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4 md:px-6">
        <h2 className="text-base font-medium text-muted-foreground">Recent Notification</h2>
        <Link
          href={ROUTES.patient.notifications}
          className="inline-flex items-center gap-1 text-sm font-semibold text-onboarding-teal-dark hover:underline"
        >
          View all
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            size={14}
            strokeWidth={1.75}
            primaryColor="currentColor"
            className="shrink-0"
            aria-hidden
          />
        </Link>
      </div>
      <ul className="flex flex-1 flex-col gap-3 p-5 md:p-6">
        {notifications.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-xl border border-[#e8ecf1] bg-white p-4"
          >
            <NotificationIcon type={item.type} />
            <div className="min-w-0">
              <p className="font-medium text-foreground">{item.message}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PatientFundingOverview({ funding }: { funding: PatientFundingOverview }) {
  const total = funding.raised + funding.remaining;
  const raisedPercent = total > 0 ? (funding.raised / total) * 100 : 0;
  const remainingPercent = total > 0 ? (funding.remaining / total) * 100 : 0;
  const donorPercent = 12;

  const size = 250;
  const stroke = 28;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { percent: raisedPercent, color: "#007bff" },
    { percent: remainingPercent, color: "#fde047" },
    { percent: donorPercent, color: "#d1d5db" },
  ];

  let offset = 0;
  const arcs = segments.map((seg, index) => {
    const length = (seg.percent / 100) * circumference;
    const dasharray = `${length} ${circumference - length}`;
    const dashoffset = -offset;
    offset += length;
    return { ...seg, dasharray, dashoffset, key: index };
  });

  return (
    <section className="flex h-full flex-col rounded-2xl border border-border bg-white shadow-sm">
      <div className="border-b border-border px-5 py-4 md:px-6">
        <h2 className="text-base font-medium text-muted-foreground">Funding Overview</h2>
      </div>
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-5 md:p-6">
        <div className="relative mx-auto w-full max-w-[220px]">
          <div
            className="absolute inset-4 rounded-full bg-[#eef3fb] blur-md"
            aria-hidden
          />
          <svg
            viewBox={`0 0 ${size} ${size}`}
            className="relative h-auto w-full -rotate-90"
            aria-label="Funding overview chart"
          >
            <circle
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke="#f1f5f9"
              strokeWidth={stroke}
            />
            {arcs.map((arc) => (
              <circle
                key={arc.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={arc.color}
                strokeWidth={stroke}
                strokeDasharray={arc.dasharray}
                strokeDashoffset={arc.dashoffset}
                strokeLinecap="butt"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-2xl font-bold tabular-nums text-foreground">
              {formatCompactNaira(funding.centerAmount)}
            </p>
            <p className="text-sm text-muted-foreground">{funding.centerLabel}</p>
          </div>
        </div>

        <ul className="flex w-full flex-col gap-2.5 self-end text-left sm:max-w-[200px]">
          <li className="flex items-center gap-2.5 text-sm text-foreground">
            <span className="size-2.5 shrink-0 rounded-full bg-onboarding-blue" aria-hidden />
            {formatCompactNaira(funding.raised)} Raised
          </li>
          <li className="flex items-center gap-2.5 text-sm text-foreground">
            <span className="size-2.5 shrink-0 rounded-full bg-[#fde047]" aria-hidden />
            {formatCompactNaira(funding.remaining)} Remaining
          </li>
          <li className="flex items-center gap-2.5 text-sm text-foreground">
            <span className="size-2.5 shrink-0 rounded-full bg-[#d1d5db]" aria-hidden />
            {funding.donorCount} Donors
          </li>
        </ul>
      </div>
    </section>
  );
}

export function PatientDashboardPage() {
  const activeCase = MOCK_PATIENT_ACTIVE_CASE;

  return (
    <div className="space-y-6 pb-4">
      <ActiveCasesSection activeCase={activeCase} />

      <section className="rounded-2xl border border-border bg-white px-5 py-4 shadow-sm md:px-6">
        <p className="text-sm text-muted-foreground">
          New funding cases are opened by your care team at the hospital. If you need another case, contact
          them directly.
        </p>
        <Link
          href={ROUTES.patient.cases}
          className="mt-3 inline-flex items-center justify-center gap-2 rounded-xl border border-input-border bg-white px-4 py-2 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
        >
          View my cases
        </Link>
      </section>

      <ShareCaseSection shareUrl={activeCase.shareUrl} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <RecentNotificationsSection notifications={MOCK_PATIENT_NOTIFICATIONS} />
        <PatientFundingOverview funding={MOCK_PATIENT_FUNDING} />
      </div>
    </div>
  );
}
