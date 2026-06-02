"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { getDonorPageTitle } from "@/constants/donor-navigation";
import { MOCK_DONOR_CASE_OVERVIEW } from "@/data/mock-donor-case-overview";
import { MOCK_DONOR_VIEW_DETAILS } from "@/data/mock-donor-view-details";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";

type DonorHeaderProps = {
  donorName: string;
  onMenuClick: () => void;
};

function DonateStarLink() {
  return (
    <Link
      href={ROUTES.donor.makeDonations}
      className="group relative flex h-12 w-12 shrink-0 items-center justify-center"
      aria-label="Donate"
    >
      <svg
        className="absolute inset-0 h-12 w-12 drop-shadow-md transition-transform group-hover:scale-105"
        viewBox="0 0 100 100"
        aria-hidden
      >
        <polygon
          points="50,6 61,38 95,38 68,58 79,94 50,74 21,94 32,58 5,38 39,38"
          fill="#991b1b"
          stroke="#7f1d1d"
          strokeWidth="1"
          strokeLinejoin="round"
        />
      </svg>
      <span className="relative z-1 max-w-10 text-center text-[8px] font-extrabold leading-tight tracking-wide text-white">
        DONATE
      </span>
    </Link>
  );
}

export function DonorHeader({ donorName: _donorName, onMenuClick }: DonorHeaderProps) {
  const pathname = usePathname();
  const normalizedPath = pathname.replace(/\/$/, "") || pathname;
  const isCaseOverview = normalizedPath === ROUTES.donor.dashboard.replace(/\/$/, "");
  const viewDetailsPath = ROUTES.donor.viewDetails.replace(/\/$/, "");
  const isViewDetails = normalizedPath === viewDetailsPath;
  const makeDonationsPath = ROUTES.donor.makeDonations.replace(/\/$/, "");
  const isMakeDonations = normalizedPath === makeDonationsPath;
  const m = MOCK_DONOR_CASE_OVERVIEW;
  const vd = MOCK_DONOR_VIEW_DETAILS;

  return (
    <header className="sticky top-0 z-20 border-b border-border/80 bg-white/95 px-4 py-4 backdrop-blur-sm md:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Button
            type="button"
            variant="outline"
            className="mt-0.5 h-11 w-11 shrink-0 rounded-xl p-0 lg:hidden"
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
            {isMakeDonations ? (
              <h1 className="sr-only">Make donation</h1>
            ) : isCaseOverview ? (
              <>
                <p className="text-sm text-muted-foreground">{m.headerWelcome}</p>
                <h1 className="mt-0.5 text-xl font-bold tracking-tight text-foreground md:text-2xl">
                  {m.fundTitle}
                </h1>
                <p className="mt-1 text-sm text-muted-foreground">{m.tagline}</p>
              </>
            ) : isViewDetails ? (
              <>
                <h1 className="text-xl font-bold tracking-tight text-foreground md:text-2xl">{vd.header.title}</h1>
                <p className="mt-1 text-sm text-muted-foreground md:text-base">{vd.header.subtitle}</p>
              </>
            ) : (
              <h1
                className={cn(
                  "truncate text-lg tracking-tight text-foreground md:text-xl",
                  "font-bold",
                )}
              >
                {getDonorPageTitle(pathname)}
              </h1>
            )}
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2 pt-0.5">
          {isCaseOverview || isViewDetails ? <DonateStarLink /> : null}
          <Link
            href={ROUTES.donor.notifications}
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
          </Link>
        </div>
      </div>
    </header>
  );
}
