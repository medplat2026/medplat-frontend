"use client";

import { useMemo, useRef, useState } from "react";
import { CaseCard } from "@/components/dashboard/case-card";
import { CreatePatientModal } from "@/components/dashboard/create-patient-modal";
import { Button } from "@/components/ui/Button";
import {
  DataTableBody,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { MOCK_CASES } from "@/data/mock-cases";
import { useOutsidePointerDismiss } from "@/hooks/use-outside-pointer-dismiss";
import { cn } from "@/lib/utils";
import type { CaseStatus, CaseStatusFilter } from "@/types/case";

const TOTAL_PAGES = 25;
const PAGE_SIZE = 4;

const STATUS_FILTER_OPTIONS: { value: CaseStatusFilter; label: string; dotClassName?: string }[] =
  [
    { value: "all", label: "All Status", dotClassName: "bg-onboarding-teal-dark" },
    { value: "Approved", label: "Approved" },
    { value: "Funded", label: "Funded" },
    { value: "Submitted", label: "Submitted" },
    { value: "Draft", label: "Draft" },
  ];

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

function StatusFilterDropdown({
  value,
  onChange,
}: {
  value: CaseStatusFilter;
  onChange: (value: CaseStatusFilter) => void;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useOutsidePointerDismiss(open, panelRef, () => setOpen(false));

  const selectedLabel =
    STATUS_FILTER_OPTIONS.find((option) => option.value === value)?.label ?? "All Status";

  return (
    <div ref={panelRef} className="relative w-full sm:w-auto sm:shrink-0">
      <Button
        type="button"
        variant="outline"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        aria-haspopup="listbox"
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-input-border bg-white py-2.5 text-sm font-semibold text-foreground shadow-sm sm:w-auto"
      >
        <FilterIcon className="text-muted-foreground" />
        Filter
      </Button>

      {open ? (
        <ul
          role="listbox"
          aria-label="Filter by status"
          className="absolute right-0 z-30 mt-2 min-w-[180px] overflow-hidden rounded-xl border border-border bg-white py-1 shadow-[0_8px_24px_rgba(15,23,42,0.12)]"
        >
          {STATUS_FILTER_OPTIONS.map((option) => {
            const active = option.value === value;
            return (
              <li key={option.value} role="option" aria-selected={active}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:bg-muted",
                    active && "bg-muted/60 font-medium",
                  )}
                >
                  {option.dotClassName ? (
                    <span
                      className={cn("size-2 shrink-0 rounded-full", option.dotClassName)}
                      aria-hidden
                    />
                  ) : null}
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}

      <span className="sr-only">Selected filter: {selectedLabel}</span>
    </div>
  );
}

export function CasesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<CaseStatusFilter>("all");
  const [page, setPage] = useState(1);

  const filteredCases = useMemo(() => {
    const query = search.trim().toLowerCase();
    return MOCK_CASES.filter((caseRecord) => {
      const matchesStatus =
        statusFilter === "all" || caseRecord.status === (statusFilter as CaseStatus);
      if (!matchesStatus) return false;
      if (!query) return true;
      return (
        caseRecord.patientName.toLowerCase().includes(query) ||
        caseRecord.caseType.toLowerCase().includes(query)
      );
    });
  }, [search, statusFilter]);

  const paginatedCases = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredCases.slice(start, start + PAGE_SIZE);
  }, [filteredCases, page]);

  return (
    <div className="mt-12 space-y-8">
      <DataTableToolbar
        className="pb-0"
        primaryAction={<CreatePatientModal triggerClassName="rounded-lg px-4 py-2.5" />}
          searchPlaceholder="Search cases by..."
          searchValue={search}
          onSearchChange={(value) => {
            setSearch(value);
            setPage(1);
          }}
          showFilter={false}
          filterControl={
            <StatusFilterDropdown
              value={statusFilter}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />
          }
      />

      <DataTableBody>
        <ul className="space-y-5 p-8">
          {paginatedCases.length === 0 ? (
            <li className="py-10 text-center text-sm text-muted-foreground">
              No cases match your search or filter.
            </li>
          ) : (
            paginatedCases.map((caseRecord) => (
              <li key={caseRecord.id}>
                <CaseCard caseRecord={caseRecord} />
              </li>
            ))
          )}
        </ul>
        <DataTablePagination page={page} totalPages={TOTAL_PAGES} onPageChange={setPage} />
      </DataTableBody>
    </div>
  );
}
