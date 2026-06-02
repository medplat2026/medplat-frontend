"use client";

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import { CreateCaseModal } from "@/components/dashboard/create-case-modal";
import { DataTablePagination } from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/search-input";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import type { APIError } from "@/types/api";
import {
  formatNairaAmount,
  statusToBadgeVariant,
  type LinkedCase,
  type PatientDetail,
} from "@/types/patient";
import {
  HOSPITAL_MY_PATIENT_LINKED_CASES_PAGE_SIZE,
  hospitalMyPatientDetailQueryKey,
  hospitalService,
  mapHospitalMyPatientDetailToPatientDetail,
} from "@/services/hospital.service";

const CASE_AVATAR_PLACEHOLDER = "/assets/dashboard/case-avatar-placeholder.svg";

const LINKED_CASE_ORDERING_OPTIONS: SelectOption[] = [
  { value: "", label: "Default sort" },
  { value: "-created_at", label: "Newest case first" },
  { value: "created_at", label: "Oldest case first" },
];

type PatientDetailPageProps = {
  patientId: string;
};

type InfoCardProps = {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
};

function queryErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as APIError).message;
    if (typeof m === "string" && m.trim()) return m.trim();
  }
  return "Could not load patient.";
}

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

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 7h16v10H4V7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
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

function DocumentActionLink({
  href,
  children,
}: {
  href: string | null | undefined;
  children: React.ReactNode;
}) {
  const url = href?.trim();
  if (!url) {
    return <span className="text-sm font-semibold text-muted-foreground">Not available</span>;
  }
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-sm font-semibold text-onboarding-teal-dark hover:underline"
    >
      {children}
    </a>
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
          "cursor-pointer hover:shadow-md hover:ring-2 hover:ring-onboarding-blue/25",
          linkedCaseToneStyles[linkedCase.status],
        )}
      >
        <div className="min-w-0">
          <p className="font-semibold text-foreground">{linkedCase.title}</p>
          <p className="mt-0.5 text-sm text-muted-foreground">{linkedCase.date}</p>
        </div>
        <div className="flex flex-wrap items-center gap-4 sm:gap-8">
          <p className="text-lg font-bold tabular-nums text-foreground">
            {formatNairaAmount(linkedCase.amount)}
          </p>
          <StatusBadge variant={statusToBadgeVariant(linkedCase.status)}>{linkedCase.status}</StatusBadge>
        </div>
      </button>
    </li>
  );
}

function PatientProfileCard({ patient }: { patient: PatientDetail }) {
  const serverPatientId = Number.parseInt(String(patient.id), 10);
  const createCasePatientId =
    Number.isFinite(serverPatientId) && serverPatientId > 0 ? serverPatientId : undefined;

  const avatarSrc =
    patient.avatarUrl && /^https?:\/\//i.test(patient.avatarUrl)
      ? patient.avatarUrl
      : CASE_AVATAR_PLACEHOLDER;

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-4 border-b border-border pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative size-16 shrink-0 overflow-hidden rounded-full ring-2 ring-border md:size-[42px]">
            <Image src={avatarSrc} alt="" fill className="object-cover" sizes="72px" />
          </div>
          <div>
            <h2 className="text-xl font-medium text-foreground">{patient.name}</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">Patient since {patient.patientSince}</p>
          </div>
        </div>
        <CreateCaseModal
          patientId={createCasePatientId}
          triggerVariant="brand"
          triggerClassName="w-full shrink-0 rounded-lg px-8 py-2 sm:w-auto"
        />
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <InfoCard icon={<UserIcon />} label="Patient Name" value={patient.name} />
        <InfoCard
          icon={<MailIcon />}
          label="Email"
          value={
            <a
              href={`mailto:${patient.email}`}
              className="text-onboarding-blue underline decoration-onboarding-blue/40 underline-offset-2 hover:decoration-onboarding-blue"
            >
              {patient.email}
            </a>
          }
        />
        <InfoCard icon={<PulseIcon />} label="Patient Diagnosis" value={patient.diagnosis} />
        <InfoCard icon={<ChartIcon />} label="Funding Progress" value={patient.fundingProgress} />
        <InfoCard icon={<ClockIcon />} label="Expected Treatment timeline" value={patient.treatmentTimeline} />
        <InfoCard
          icon={<DocumentIcon />}
          label="Patient ID"
          value={<DocumentActionLink href={patient.patientIdDocumentUrl}>View ID</DocumentActionLink>}
        />
        <InfoCard
          icon={<DocumentIcon />}
          label="Doctor's report"
          value={<DocumentActionLink href={patient.doctorReportUrl}>View Report</DocumentActionLink>}
        />
      </div>
    </section>
  );
}

function LinkedCasesSection({
  patient,
  linkedSearch,
  onLinkedSearchChange,
  linkedOrdering,
  onLinkedOrderingChange,
  linkedPage,
  onLinkedPageChange,
  linkedTotalCount,
  orderingFieldId,
}: {
  patient: PatientDetail;
  linkedSearch: string;
  onLinkedSearchChange: (value: string) => void;
  linkedOrdering: string;
  onLinkedOrderingChange: (value: string) => void;
  linkedPage: number;
  onLinkedPageChange: (page: number) => void;
  linkedTotalCount: number | undefined;
  orderingFieldId: string;
}) {
  const firstName = patient.name.split(" ")[0] ?? patient.name;
  const linkedTotalPages =
    linkedTotalCount != null
      ? Math.max(1, Math.ceil(linkedTotalCount / HOSPITAL_MY_PATIENT_LINKED_CASES_PAGE_SIZE))
      : 1;
  const showLinkedPagination =
    linkedTotalCount != null && linkedTotalPages > 1;

  return (
    <section className="rounded-2xl border border-border bg-white p-5 shadow-sm md:p-6">
      <div className="border-b border-border pb-4">
        <h2 className="text-base font-bold text-foreground">Linked Cases</h2>
        <p className="mt-1 text-sm text-muted-foreground">All funding cases for {firstName.toLowerCase()}</p>
      </div>

      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end sm:justify-between">
        <SearchInput
          placeholder="Search linked cases"
          value={linkedSearch}
          onChange={onLinkedSearchChange}
          className="w-full sm:min-w-[240px] sm:max-w-md"
        />
        <SelectField
          id={orderingFieldId}
          label="Sort linked cases"
          labelClassName="sr-only"
          className="w-full sm:w-auto sm:min-w-[200px]"
          selectClassName="min-h-[42px]"
          value={linkedOrdering}
          onChange={(e) => onLinkedOrderingChange(e.target.value)}
          options={LINKED_CASE_ORDERING_OPTIONS}
        />
      </div>

      <ul className="mt-4 space-y-3">
        {patient.linkedCases.map((linkedCase) => (
          <LinkedCaseRow key={linkedCase.id} linkedCase={linkedCase} />
        ))}
      </ul>

      {showLinkedPagination ? (
        <DataTablePagination
          page={linkedPage}
          totalPages={linkedTotalPages}
          onPageChange={onLinkedPageChange}
        />
      ) : null}
    </section>
  );
}

export function PatientDetailPage({ patientId }: PatientDetailPageProps) {
  const linkedOrderingFieldId = useId();
  const serverId = useMemo(() => {
    const n = Number.parseInt(patientId, 10);
    return Number.isFinite(n) && n > 0 ? n : null;
  }, [patientId]);

  const [linkedSearch, setLinkedSearch] = useState("");
  const [debouncedLinkedSearch, setDebouncedLinkedSearch] = useState("");
  const [linkedOrdering, setLinkedOrdering] = useState("");
  const [linkedPage, setLinkedPage] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => setDebouncedLinkedSearch(linkedSearch.trim()), 350);
    return () => window.clearTimeout(t);
  }, [linkedSearch]);

  useEffect(() => {
    setLinkedPage(1);
  }, [debouncedLinkedSearch, linkedOrdering]);

  const listParams = useMemo(
    () => ({
      search: debouncedLinkedSearch,
      ordering: linkedOrdering,
      page: linkedPage,
    }),
    [debouncedLinkedSearch, linkedOrdering, linkedPage],
  );

  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = useQuery({
    queryKey:
      serverId != null ? hospitalMyPatientDetailQueryKey(serverId, listParams) : ["hospital", "my-patient", "off"],
    queryFn: () =>
      hospitalService.getMyPatientDetail(serverId!, {
        search: debouncedLinkedSearch || undefined,
        ordering: linkedOrdering || undefined,
        page: linkedPage,
      }),
    enabled: serverId != null,
    placeholderData: keepPreviousData,
  });

  const patient = useMemo(() => (data ? mapHospitalMyPatientDetailToPatientDetail(data) : null), [data]);

  const linkedTotalCount = data?.linked_cases_count;

  const linkedTotalPages =
    linkedTotalCount != null
      ? Math.max(1, Math.ceil(linkedTotalCount / HOSPITAL_MY_PATIENT_LINKED_CASES_PAGE_SIZE))
      : 1;

  useEffect(() => {
    if (linkedPage > linkedTotalPages) setLinkedPage(linkedTotalPages);
  }, [linkedPage, linkedTotalPages]);

  if (serverId == null) {
    notFound();
  }

  if (isError && (error as APIError).statusCode === 404) {
    notFound();
  }

  const showInitialLoading = isPending && !data;
  const showFatalError = isError && data === undefined;

  return (
    <div className="mt-4 space-y-4">
      <Link
        href={ROUTES.hospital.patients}
        className="inline-flex items-center gap-1 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span aria-hidden>←</span>
        Back to patients
      </Link>

      {isError && !showFatalError ? (
        <div
          className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"
          role="alert"
        >
          <p>{queryErrorMessage(error)}</p>
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

      {showInitialLoading ? (
        <div className="rounded-2xl border border-border bg-white px-5 py-16 text-center text-sm text-muted-foreground shadow-sm">
          Loading patient…
        </div>
      ) : showFatalError ? (
        <div className="rounded-2xl border border-border bg-white px-5 py-16 text-center text-sm text-muted-foreground shadow-sm">
          <p>{queryErrorMessage(error)}</p>
          <Button type="button" variant="outline" className="mt-4" onClick={() => void refetch()}>
            Retry
          </Button>
        </div>
      ) : patient ? (
        <div
          className={cn("space-y-4", isFetching && isPlaceholderData && "pointer-events-none opacity-60")}
        >
          <PatientProfileCard patient={patient} />
          <LinkedCasesSection
            patient={patient}
            linkedSearch={linkedSearch}
            onLinkedSearchChange={setLinkedSearch}
            linkedOrdering={linkedOrdering}
            onLinkedOrderingChange={setLinkedOrdering}
            linkedPage={linkedPage}
            onLinkedPageChange={setLinkedPage}
            linkedTotalCount={linkedTotalCount}
            orderingFieldId={linkedOrderingFieldId}
          />
        </div>
      ) : null}
    </div>
  );
}
