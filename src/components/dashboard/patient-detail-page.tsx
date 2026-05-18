"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CreateCaseModal } from "@/components/dashboard/create-case-modal";
import { StatusBadge } from "@/components/ui/status-badge";
import { ROUTES } from "@/constants/routes";
import { getPatientDetail } from "@/data/mock-patients";
import { cn } from "@/lib/utils";
import {
  formatNairaAmount,
  statusToBadgeVariant,
  type LinkedCase,
  type PatientDetail,
} from "@/types/patient";

const CASE_AVATAR_PLACEHOLDER = "/assets/dashboard/case-avatar-placeholder.svg";

type PatientDetailPageProps = {
  patientId: string;
};

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

function InfoCard({ icon, label, value }: InfoCardProps) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-white p-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#E6E6E6] text-onboarding-blue">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="mt-1 text-sm font-semibold text-foreground">{value}</div>
      </div>
    </div>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M5 20c0-3.3 3.1-5 7-5s7 1.7 7 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function PulseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12h3l2-6 3 12 2-6h6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 18V10M12 18V6M18 18v-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 8v4l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 5h7l3 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 5v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function DetailLink({ children }: { children: React.ReactNode }) {
  return (
    <button type="button" className="text-sm font-semibold text-onboarding-teal-dark hover:underline">
      {children}
    </button>
  );
}

const linkedCaseToneStyles: Record<LinkedCase["status"], string> = {
  Approved:
    "bg-gradient-to-r from-[#fdf6e8] via-[#fef9ee] to-[#fff8f0] ring-1 ring-[#f0e4c8]/80",
  Submitted:
    "bg-gradient-to-r from-[#eef6ff] via-[#f3f8ff] to-[#f8fbff] ring-1 ring-[#d6e8f8]/80",
  Completed:
    "bg-gradient-to-r from-[#f8f9fa] via-[#fafbfc] to-[#ffffff] ring-1 ring-border",
  Draft: "bg-gradient-to-r from-[#f8f9fa] via-[#fafbfc] to-[#ffffff] ring-1 ring-border",
};

function LinkedCaseRow({ linkedCase }: { linkedCase: LinkedCase }) {
  return (
    <li>
      <button
        type="button"
        title="View case details"
        className={cn(
          "flex w-full flex-col gap-4 rounded-xl p-4 text-left transition-all sm:flex-row sm:items-center sm:justify-between",
          "cursor-pointer hover:shadow-md hover:translate-y-[-2px] hover:ring-onboarding-blue/25",
          linkedCaseToneStyles[linkedCase.status],
        )}
      >
      <div className="min-w-0">
        <p className="font-semibold text-foreground">{linkedCase.title}</p>
        <p className="mt-0.5 text-sm text-muted-foreground">{linkedCase.date}</p>
      </div>
      <div className="flex flex-wrap items-center gap-4 sm:gap-8">
        <p className="text-lg font-bold tabular-nums text-foreground">{formatNairaAmount(linkedCase.amount)}</p>
        <StatusBadge variant={statusToBadgeVariant(linkedCase.status)}>{linkedCase.status}</StatusBadge>
        </div>
      </button>
    </li>
  );
}

function PatientProfileCard({ patient }: { patient: PatientDetail }) {
  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-border md:size-[42px]">
            <Image src={CASE_AVATAR_PLACEHOLDER} alt="" fill className="object-cover" sizes="72px" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-foreground">{patient.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Patient since {patient.patientSince}</p>
          </div>
        </div>
        <CreateCaseModal
          triggerVariant="brand"
          triggerClassName="w-full shrink-0 rounded-lg px-8 py-2 sm:w-auto"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoCard icon={<UserIcon />} label="Patient Name" value={patient.name} />
        <InfoCard icon={<PulseIcon />} label="Patient Diagnosis" value={patient.diagnosis} />
        <InfoCard icon={<ChartIcon />} label="Funding Progress" value={patient.fundingProgress} />
        <InfoCard icon={<ClockIcon />} label="Expected Treatment timeline" value={patient.treatmentTimeline} />
        <InfoCard icon={<DocumentIcon />} label="Patient ID" value={<DetailLink>View ID</DetailLink>} />
        <InfoCard icon={<DocumentIcon />} label="Doctor's report" value={<DetailLink>View Report</DetailLink>} />
      </div>
    </section>
  );
}

function LinkedCasesSection({ patient }: { patient: PatientDetail }) {
  const firstName = patient.name.split(" ")[0] ?? patient.name;

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-base font-bold text-foreground">Linked Cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">All funding cases for {firstName.toLowerCase()}</p>
      </div>
      <ul className="mt-4 space-y-3">
        {patient.linkedCases.map((linkedCase) => (
          <LinkedCaseRow key={linkedCase.id} linkedCase={linkedCase} />
        ))}
      </ul>
    </section>
  );
}

export function PatientDetailPage({ patientId }: PatientDetailPageProps) {
  const patient = getPatientDetail(patientId);

  if (!patient) {
    notFound();
  }

  return (
    <div className="mt-4 space-y-4">
      <Link
        href={ROUTES.patients}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden>←</span>
        Back to patients
      </Link>

      <PatientProfileCard patient={patient} />
      <LinkedCasesSection patient={patient} />
    </div>
  );
}
