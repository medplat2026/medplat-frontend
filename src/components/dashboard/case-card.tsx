import Link from "next/link";
import { StatusBadge } from "@/components/ui/status-badge";
import { ROUTES } from "@/constants/routes";
import { caseStatusToBadgeVariant, type CaseRecord } from "@/types/case";
import { formatNairaAmount } from "@/types/patient";

type CaseCardProps = {
  caseRecord: CaseRecord;
};

export function CaseCard({ caseRecord }: CaseCardProps) {
  const showProgress = typeof caseRecord.progressPercent === "number";

  return (
    <article className="rounded-2xl border border-[#e8ecf1] bg-white p-6">
      <header>
        <div className="flex items-center justify-between gap-4">
          <h3 className="truncate text-base font-bold text-foreground">{caseRecord.patientName}</h3>
          <StatusBadge
            variant={caseStatusToBadgeVariant(caseRecord.status)}
            className="shrink-0 px-3 py-1"
          >
            {caseRecord.status}
          </StatusBadge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{caseRecord.caseType}</p>
      </header>

      <div className="mt-6 flex items-center justify-between gap-4 text-sm">
        <span className="text-muted-foreground">Total Cost</span>
        <span className="font-bold tabular-nums text-foreground">
          {formatNairaAmount(caseRecord.totalCost)}
        </span>
      </div>

      {showProgress ? (
        <div className="mt-6">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#e8ecf1]">
            <div
              className="h-full rounded-full bg-onboarding-blue"
              style={{ width: `${caseRecord.progressPercent}%` }}
            />
          </div>
          <p className="mt-1.5 text-xs font-medium text-onboarding-blue">
            {caseRecord.progressPercent}% target reached
          </p>
        </div>
      ) : null}

      <div className="mt-6 flex justify-end">
        <Link
          href={ROUTES.patientDetail(caseRecord.patientId)}
          className="inline-flex min-w-[9.5rem] items-center justify-center rounded-lg bg-onboarding-blue px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-onboarding-blue-hover"
        >
          View details
        </Link>
      </div>
    </article>
  );
}
