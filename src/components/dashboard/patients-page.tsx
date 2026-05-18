"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { CreatePatientModal } from "@/components/dashboard/create-patient-modal";
import { ROUTES } from "@/constants/routes";
import { MOCK_PATIENTS } from "@/data/mock-patients";
import {
  DataTable,
  DataTableBody,
  DataTableCard,
  DataTablePagination,
  DataTableToolbar,
  type DataTableColumn,
} from "@/components/ui/data-table";
import { StatusBadge } from "@/components/ui/status-badge";
import {
  formatNairaAmount,
  statusToBadgeVariant,
  urgencyToBadgeVariant,
  type PatientRecord,
} from "@/types/patient";

const TOTAL_PAGES = 25;

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
  return (
    <Link
      href={ROUTES.patientDetail(patient.id)}
      aria-label={`View ${patient.name}`}
      className="inline-flex items-center gap-1.5 text-xs font-medium text-foreground transition-colors hover:text-onboarding-blue"
    >
      <EyeIcon className="text-muted-foreground" />
      View
    </Link>
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
    cell: (row) => <PatientActions patient={row} />,
  },
];

export function PatientsPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredPatients = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_PATIENTS;
    return MOCK_PATIENTS.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.caseType.toLowerCase().includes(query) ||
        p.email.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <div className="mt-12">
      <DataTableCard>
        <DataTableToolbar
          primaryAction={<CreatePatientModal triggerClassName="rounded-lg px-4 py-2.5" />}
          searchPlaceholder="Search patients"
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
        />
        <DataTableBody>
          <DataTable
            columns={patientColumns}
            data={filteredPatients}
            keyExtractor={(row) => row.id}
            emptyMessage="No patients match your search."
          />
          <DataTablePagination
            page={page}
            totalPages={TOTAL_PAGES}
            onPageChange={setPage}
          />
        </DataTableBody>
      </DataTableCard>
    </div>
  );
}
