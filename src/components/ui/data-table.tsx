"use client";

import { Button } from "@/components/ui/Button";
import { SearchInput } from "@/components/ui/search-input";
import { cn } from "@/lib/utils";

export type DataTableColumn<T> = {
  id: string;
  header: string;
  cell: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
};

type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  className?: string;
};

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No results found.",
  className,
}: DataTableProps<T>) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="w-full min-w-[720px] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-border bg-input">
            {columns.map((col) => (
              <th
                key={col.id}
                scope="col"
                className={cn(
                  "whitespace-nowrap px-4 py-3 text-xs font-semibold text-foreground first:pl-5 last:pr-5",
                  col.headerClassName,
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-5 py-10 text-center text-sm text-muted-foreground"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={keyExtractor(row)}
                className="border-b border-border last:border-b-0 hover:bg-[#fafbfc]"
              >
                {columns.map((col) => (
                  <td
                    key={col.id}
                    className={cn(
                      "whitespace-nowrap px-4 py-3.5 text-sm text-foreground first:pl-5 last:pr-5",
                      col.cellClassName,
                    )}
                  >
                    {col.cell(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

type DataTableToolbarProps = {
  primaryAction?: React.ReactNode;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onFilterClick?: () => void;
  filterLabel?: string;
  showFilter?: boolean;
  /** Replaces the default filter button when provided. */
  filterControl?: React.ReactNode;
  className?: string;
};

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

export function DataTableToolbar({
  primaryAction,
  searchPlaceholder = "Search...",
  searchValue,
  onSearchChange,
  onFilterClick,
  filterLabel = "Filter",
  showFilter = true,
  filterControl,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 pb-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      {primaryAction ? <div className="shrink-0">{primaryAction}</div> : null}
      <div className="flex w-full flex-col gap-2 sm:ml-auto sm:w-auto sm:flex-row sm:items-center sm:justify-end">
        <SearchInput
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={onSearchChange}
          className="w-full sm:min-w-[240px] lg:min-w-[320px]"
        />
        {filterControl ? (
          filterControl
        ) : showFilter ? (
          <Button
            type="button"
            variant="outline"
            onClick={onFilterClick}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border-input-border bg-white py-2.5 text-sm font-semibold text-foreground shadow-sm sm:w-auto sm:shrink-0"
          >
            <FilterIcon className="text-muted-foreground" />
            {filterLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

type DataTablePaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
};

function PaginationButton({
  children,
  onClick,
  disabled,
  active,
  ariaLabel,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  ariaLabel: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      aria-current={active ? "page" : undefined}
      className={cn(
        "inline-flex size-9 items-center justify-center rounded-full border border-input-border text-sm font-medium text-foreground transition-colors",
        active ? "bg-[#f3f4f6]" : "bg-white hover:bg-muted",
        disabled && "pointer-events-none opacity-40",
      )}
    >
      {children}
    </button>
  );
}

function ChevronIcon({ direction }: { direction: "left" | "right" | "double-left" | "double-right" }) {
  const paths = {
    left: "M15 18l-6-6 6-6",
    right: "M9 18l6-6-6-6",
    "double-left": "M18 18l-6-6 6-6M12 18l-6-6 6-6",
    "double-right": "M6 6l6 6-6 6M12 6l6 6-6 6",
  };

  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d={paths[direction]}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DataTablePagination({
  page,
  totalPages,
  onPageChange,
  className,
}: DataTablePaginationProps) {
  const visiblePages = getVisiblePages(page, totalPages);

  return (
    <div
      className={cn(
        "flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <p className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </p>
      <div className="flex items-center gap-1.5">
        <PaginationButton
          ariaLabel="Go to first page"
          onClick={() => onPageChange(1)}
          disabled={page <= 1}
        >
          <ChevronIcon direction="double-left" />
        </PaginationButton>
        <PaginationButton
          ariaLabel="Go to previous page"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          <ChevronIcon direction="left" />
        </PaginationButton>
        {visiblePages.map((p) => (
          <PaginationButton
            key={p}
            ariaLabel={`Go to page ${p}`}
            onClick={() => onPageChange(p)}
            active={p === page}
          >
            {p}
          </PaginationButton>
        ))}
        <PaginationButton
          ariaLabel="Go to next page"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          <ChevronIcon direction="right" />
        </PaginationButton>
        <PaginationButton
          ariaLabel="Go to last page"
          onClick={() => onPageChange(totalPages)}
          disabled={page >= totalPages}
        >
          <ChevronIcon direction="double-right" />
        </PaginationButton>
      </div>
    </div>
  );
}

function getVisiblePages(current: number, total: number, maxVisible = 4): number[] {
  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  let start = Math.max(1, current - Math.floor(maxVisible / 2));
  const end = Math.min(total, start + maxVisible - 1);
  start = Math.max(1, end - maxVisible + 1);

  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
}

type DataTableCardProps = {
  children: React.ReactNode;
  className?: string;
};

/** Outer section: toolbar, search, and filter live here. */
export function DataTableCard({ children, className }: DataTableCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-white p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
}

type DataTableBodyProps = {
  children: React.ReactNode;
  className?: string;
};

/** Inner section: bordered container for the table and pagination. */
export function DataTableBody({ children, className }: DataTableBodyProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border bg-white",
        className,
      )}
    >
      {children}
    </div>
  );
}
