"use client";

import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect, useId, useMemo, useState } from "react";
import { CaseCard } from "@/components/dashboard/case-card";
import { CreatePatientModal } from "@/components/dashboard/create-patient-modal";
import { Button } from "@/components/ui/Button";
import {
  DataTableBody,
  DataTableCard,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { SelectField, type SelectOption } from "@/components/ui/select-field";
import type { APIError } from "@/types/api";
import {
  HOSPITAL_MEDICAL_CASES_PAGE_SIZE,
  hospitalMedicalCasesQueryKeyRoot,
  hospitalService,
  mapMedicalCaseRowToCaseRecord,
} from "@/services/hospital.service";

/** `ordering` query: ascending = field name, descending = `-` + field (e.g. `created_at`, `-created_at`). */
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
  return "Could not load cases.";
}

export function CasesPage() {
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
    queryKey: [
      ...hospitalMedicalCasesQueryKeyRoot,
      { search: debouncedSearch, ordering, page },
    ] as const,
    queryFn: () =>
      hospitalService.getMedicalCases({
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
    return Math.max(1, Math.ceil(count / HOSPITAL_MEDICAL_CASES_PAGE_SIZE));
  }, [data?.count]);

  useEffect(() => {
    if (page > totalPages) setPage(totalPages);
  }, [page, totalPages]);

  const caseCards = useMemo(
    () => (data?.results ?? []).map(mapMedicalCaseRowToCaseRecord),
    [data?.results],
  );

  const showInitialLoading = isPending && !data;
  const showFatalListError = isError && data === undefined;

  return (
    <div className="mt-12 space-y-8">
      {isError ? (
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

      <DataTableCard>
        <DataTableToolbar
          className="pb-0"
          primaryAction={<CreatePatientModal triggerClassName="rounded-lg px-4 py-2.5" />}
          searchPlaceholder="Search cases by..."
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
              Loading cases…
            </div>
          ) : showFatalListError ? (
            <div className="flex min-h-[200px] items-center justify-center px-5 py-12 text-center text-sm text-muted-foreground">
              Case list could not be loaded. Use Retry above, then refresh the page if the problem
              continues.
            </div>
          ) : (
            <>
              <div
                className={
                  isFetching && isPlaceholderData ? "pointer-events-none opacity-60" : undefined
                }
              >
                <ul className="space-y-5 p-8">
                  {caseCards.length === 0 ? (
                    <li className="py-10 text-center text-sm text-muted-foreground">
                      No cases match your search or sort.
                    </li>
                  ) : (
                    caseCards.map((caseRecord) => (
                      <li key={caseRecord.id}>
                        <CaseCard caseRecord={caseRecord} />
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <DataTablePagination page={page} totalPages={totalPages} onPageChange={setPage} />
            </>
          )}
        </DataTableBody>
      </DataTableCard>
    </div>
  );
}
