"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type DashboardHeaderProps = {
  hospitalName: string;
  onMenuClick: () => void;
};

function formatDashboardDate(d: Date): string {
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DashboardHeader({ hospitalName, onMenuClick }: DashboardHeaderProps) {
  const today = new Date();

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-white/95 px-4 py-4 backdrop-blur-sm md:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-xl p-0 lg:hidden"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
          >
            <span className="flex flex-col gap-1">
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
              <span className="block h-0.5 w-4 rounded-full bg-foreground" />
            </span>
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold tracking-tight text-foreground md:text-xl">
              Welcome, {hospitalName}
            </h1>
            <p className="text-sm text-muted-foreground">{formatDashboardDate(today)}</p>
          </div>
        </div>
        <button
          type="button"
          className={cn(
            "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full",
            "border border-border bg-white text-foreground shadow-[0_4px_14px_rgba(15,23,42,0.08)]",
            "transition-colors hover:bg-muted",
          )}
          aria-label="Notifications"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </header>
  );
}
