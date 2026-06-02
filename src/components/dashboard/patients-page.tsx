"use client";

import Link from "next/link";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import { CreateCaseModal } from "@/components/dashboard/create-case-modal";
import { CreatePatientModal } from "@/components/dashboard/create-patient-modal";
import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTablePagination,
  DataTableToolbar,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import {
  HOSPITAL_MY_PATIENTS_PAGE_SIZE,
  hospitalMyPatientsQueryKeyRoot,
  hospitalService,
  mapHospitalMyPatientRowToPatientRecord,
} from "@/services/hospital.service";
import type { APIError } from "@/types/api";
import {
  formatNairaAmount,
  statusToBadgeVariant,
  urgencyToBadgeVariant,
  type PatientRecord,
} from "@/types/patient";

const ORDERING_OPTIONS: SelectOption[] = [
  { value: "", label: "Default sort" },
  { value: "-created_at", label: "Newest first" },
  { value: "created_at", label: "Oldest first" },
];

function queryErrorMessage(err: unknown): string {
  if (err && typeof err === "object" && "message" in err) {
    const m = (err as APIError).message;
    if (typeof m === "string" && m.trim()) return m.trim();
  }
  return "Could not load patients.";
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function PatientActions({ patient }: { patient: PatientRecord }) {
  const numericId = Number.parseInt(patient.id, 10);
  const serverPatientId =
    Number.isFinite(numericId) && numericId > 0 ? numericId : undefined;

  return (
    <div className="flex flex-nowrap items-center justify-end gap-2 sm:gap-3">
      <Link
        href={ROUTES.hospital.patientDetail(patient.id)}
        aria-label={`View ${patient.name}`}
        className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-xs font-medium text-foreground transition-colors hover:text-onboarding-blue"
      >
        <EyeIcon className="text-muted-foreground" />
        View
      </Link>
      <CreateCaseModal
        patientId={serverPatientId}
        triggerLabel="Create case"
        triggerVariant="outline"
        triggerClassName="h-auto shrink-0 whitespace-nowrap rounded-lg border-input-border px-2.5 py-1 text-xs font-medium text-foreground hover:text-onboarding-blue"
      />
    </div>
  );
}

const patientColumns: DataTableColumn<PatientRecord>[] = [
  {
    id: "name",
    header: "Patient Name",
    cell: (row) => <span className="font-medium">{row.name}</span>,
  },
  {
    id: "caseType",
    header: "Case Type",
    cell: (row) => row.caseType,
  },
  {
    id: "email",
    header: "Email",
    cell: (row) => (
      <a
        href={`mailto:${row.email}`}
        className="text-onboarding-blue underline decoration-onboarding-blue/40 underline-offset-2 hover:decoration-onboarding-blue"
      >
        {row.email}
      </a>
    ),
  },
  {
    id: "amountNeeded",
    header: "Amount Needed",
    cell: (row) => <span className="tabular-nums">{formatNairaAmount(row.amountNeeded)}</span>,
  },
  {
    id: "urgency",
    header: "Urgency Level",
    cell: (row) => (
      <StatusBadge variant={urgencyToBadgeVariant(row.urgency)}>{row.urgency}</StatusBadge>
    ),
  },
  {
    id: "status",
    header: "Status",
    cell: (row) => (
      <StatusBadge variant={statusToBadgeVariant(row.status)}>{row.status}</StatusBadge>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cellClassName: "min-w-[10.5rem]",
    cell: (row) => <PatientActions patient={row} />,
  },
];

export function PatientsPage() {
  const orderingFieldId = useId();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [ordering, setOrdering] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = window.setTimeout(() => {
      setDebouncedSearch(search.trim());
    }, 350);
    return () => window.clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, ordering]);

  const query = useQuery({
    queryKey: [...hospitalMyPatientsQueryKeyRoot, { search: debouncedSearch, ordering, page }] as const,
    queryFn: () =>
      hospitalService.getMyPatients({
        search: debouncedSearch || undefined,
        ordering: ordering || undefined,
        page,
      }),
    placeholderData: keepPreviousData,
  });

  const { data, isPending, isError, error, refetch, isFetching, isPlaceholderData } = query;

  const totalPages = useMemo(() => {
    const count = data?.count ?? 0;
    if (count <= 0) return 1;
    return Math.max(1, Math.ceil(count / HOSPITAL_MY_PATIENTS_PAGE_SIZE));
  }, [data?.count]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const rows = useMemo(
    () => (data?.results ?? []).map(mapHospitalMyPatientRowToPatientRecord),
    [data?.results],
  );

  const showInitialLoading = isPending && !data;
  const showFatalListError = isError && data === undefined;

  return (
    <div className="mt-12">
      {isError ? (
        <div
          className="mb-4 flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-900 sm:flex-row sm:items-center sm:justify-between"
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

      <DataTableCard>
        <DataTableToolbar
          primaryAction={<CreatePatientModal triggerClassName="rounded-lg px-4 py-2.5" />}
          searchPlaceholder="Search patients"
          searchValue={search}
          onSearchChange={setSearch}
          showFilter={false}
          filterControl={
            <SelectField
              id={orderingFieldId}
              label="Sort by"
              labelClassName="sr-only"
              className="w-full sm:w-auto sm:min-w-[200px]"
              selectClassName="h-10.5 text-xs shadow-none text-foreground"
              value={ordering}
              onChange={(e) => setOrdering(e.target.value)}
              options={ORDERING_OPTIONS}
            />
          }
        />
        <DataTableBody>
          {showInitialLoading ? (
            <div className="flex min-h-[200px] items-center justify-center px-5 py-12 text-sm text-muted-foreground">
              Loading patients…
            </div>
          ) : showFatalListError ? (
            <div className="flex min-h-[200px] items-center justify-center px-5 py-12 text-center text-sm text-muted-foreground">
              Patient list could not be loaded. Use Retry above, then refresh the page if the problem
              continues.
            </div>
          ) : (
            <>
              <div
                className={
                  isFetching && isPlaceholderData ? "pointer-events-none opacity-60" : undefined
                }
              >
                <DataTable
                  columns={patientColumns}
                  data={rows}
                  keyExtractor={(row) => (row.caseRef ? `${row.id}-${row.caseRef}` : row.id)}
                  emptyMessage="No patients match your search."
                />
              </div>
              <DataTablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </DataTableBody>
      </DataTableCard>
    </div>
  );
}
