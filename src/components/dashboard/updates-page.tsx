"use client";

import { useMemo, useState } from "react";
import { UpdateCard } from "@/components/dashboard/update-card";
import { Button } from "@/components/ui/Button";
import {
  DataTableBody,
  DataTablePagination,
  DataTableToolbar,
} from "@/components/ui/data-table";
import { MOCK_TREATMENT_UPDATES } from "@/data/mock-treatment-updates";
import { cn } from "@/lib/utils";

const TOTAL_PAGES = 25;
const PAGE_SIZE = 2;

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function UpdatesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const filteredUpdates = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return MOCK_TREATMENT_UPDATES;
    return MOCK_TREATMENT_UPDATES.filter((update) => {
      const inBody = update.body.toLowerCase().includes(query);
      const inAuthor = update.authorName.toLowerCase().includes(query);
      const inAttachments = update.attachments?.some((attachment) =>
        attachment.fileName.toLowerCase().includes(query),
      );
      return inBody || inAuthor || inAttachments;
    });
  }, [search]);

  const paginatedUpdates = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredUpdates.slice(start, start + PAGE_SIZE);
  }, [filteredUpdates, page]);

  return (
    <div className="mt-12 space-y-8">
      <DataTableToolbar
        className="pb-0"
        primaryAction={
          <Button type="button" className="rounded-lg px-4 py-2.5">
            <PlusIcon />
            Add Update
          </Button>
        }
        searchPlaceholder="Search..."
        searchValue={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        showFilter={false}
      />

      <DataTableBody>
        <div className="p-6 md:p-8">
          {paginatedUpdates.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              No updates match your search.
            </p>
          ) : (
            <ol className="relative space-y-6">
              <div
                className="absolute left-3 top-[7px] bottom-2 w-px -translate-x-1/2 bg-onboarding-blue"
                aria-hidden
              />
              {paginatedUpdates.map((update, index) => (
                <li key={update.id} className="flex gap-4">
                  <div
                    className={cn(
                      "flex w-6 shrink-0 justify-center",
                      index > 0 && "pt-6",
                    )}
                  >
                    <span
                      className="size-3.5 shrink-0 rounded-full bg-onboarding-blue ring-4 ring-white"
                      aria-hidden
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <UpdateCard update={update} />
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
        <DataTablePagination page={page} totalPages={TOTAL_PAGES} onPageChange={setPage} />
      </DataTableBody>
    </div>
  );
}
