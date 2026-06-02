import { MOCK_DONOR_VIEW_DETAILS } from "@/data/mock-donor-view-details";
import type { DonorDiagnosisRow, DonorTimelineStep } from "@/types/donor-view-details";
import { cn } from "@/lib/utils";

function DiagnosisIcon({ kind }: { kind: DonorDiagnosisRow["kind"] }) {
  const common = "size-5 shrink-0 text-onboarding-blue";
  if (kind === "diagnosis") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 22s7-4.5 7-10c0-4-3-7-7-9-4 2-7 5-7 9 0 5.5 7 10 7 10Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M12 15v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "procedure") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path d="m8.5 12.5 2.5 2.5 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function TimelineStepRow({
  step,
  index,
  total,
}: {
  step: DonorTimelineStep;
  index: number;
  total: number;
}) {
  const isLast = index === total - 1;
  const lineAfterClass =
    index === 0 ? "bg-teal-500" : index === 1 ? "bg-slate-200" : "bg-transparent";

  const circleClass =
    step.status === "completed"
      ? "bg-onboarding-blue text-white"
      : step.status === "in_progress"
        ? "bg-orange-500 text-white"
        : "border-2 border-slate-300 bg-slate-100 text-slate-600";

  const statusColor =
    step.status === "completed"
      ? "text-onboarding-blue"
      : step.status === "in_progress"
        ? "text-orange-600"
        : "text-muted-foreground";

  return (
    <li className="flex gap-4">
      <div className="flex w-11 shrink-0 flex-col items-center">
        <div
          className={cn(
            "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-bold shadow-sm",
            circleClass,
          )}
        >
          {step.status === "completed" ? (
            <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path d="M6 12.5 10 16.5 18 8" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          ) : (
            <span>{step.stepNumber}</span>
          )}
        </div>
        {!isLast ? <div className={cn("mt-1 w-0.5 min-h-18", lineAfterClass)} aria-hidden /> : null}
      </div>
      <div className={cn("min-w-0 flex-1", !isLast && "pb-2")}>
        <p className={cn("text-xs font-semibold uppercase tracking-wide", statusColor)}>{step.statusLabel}</p>
        <p className="mt-1 text-base font-bold text-foreground">{step.title}</p>
        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{step.description}</p>
      </div>
    </li>
  );
}

export function DonorViewDetailsPage() {
  const d = MOCK_DONOR_VIEW_DETAILS;

  return (
    <div className="space-y-8 pb-6">
      {/* Patient story — Figma: grey image well + white circle / outlined heart; teal title + slate body */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 md:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-stretch lg:gap-8">
          <div
            className={cn(
              "flex w-full flex-2 flex-col items-center justify-center rounded-xl border border-slate-200/90 bg-[#f4f5f7] px-6 py-7 shadow-[0_2px_12px_rgba(15,23,42,0.07)]",
              "lg:max-w-[300px] lg:min-h-0 lg:shrink-0",
            )}
          >
            <div className="flex size-20 items-center justify-center rounded-full border border-slate-100/90 bg-white shadow-[0_1px_4px_rgba(15,23,42,0.08)]">
              <svg className="size-10" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
                  stroke="#0f172a"
                  strokeWidth="1.75"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <p className="mt-4 text-center text-sm font-medium text-slate-600">Patient Story Image</p>
          </div>
          <div className="flex min-h-0 min-w-0 flex-3 flex-col">
            <h2 className="text-lg font-semibold tracking-tight text-teal-600 md:text-xl">{d.patientStory.sectionTitle}</h2>
            <div className="mt-4 space-y-4 text-sm leading-relaxed text-[#64748b]">
              {d.patientStory.body.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Diagnosis + hospital */}
      <div className="grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl border border-sky-200/80 bg-[#e8f4fc] p-5 shadow-sm sm:p-6 lg:col-span-2">
          <h2 className="text-lg font-bold text-foreground">Diagnosis and Treatment Plan</h2>
          <ul className="mt-6 space-y-6">
            {d.diagnosisRows.map((row) => (
              <li key={row.label} className="flex gap-4">
                <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm">
                  <DiagnosisIcon kind={row.kind} />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-foreground">{row.label}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{row.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-muted/40 p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-start gap-2">
            <h2 className="text-lg font-bold text-foreground">{d.hospital.name}</h2>
            {d.hospital.verified ? (
              <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                <svg className="size-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                </svg>
                Verified
              </span>
            ) : null}
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
            <svg className="size-4 shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M12 21s-4-3.2-6-7.2C4 10.5 6.5 7 12 7s8 3.5 8 6.8c-2 4-6 7.2-6 7.2Z"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <circle cx="12" cy="11" r="2" fill="currentColor" />
            </svg>
            {d.hospital.location}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{d.hospital.description}</p>
        </section>
      </div>

      {/* Treatment timeline */}
      <section className="rounded-2xl border border-border bg-white p-5 shadow-sm sm:p-6 md:p-8">
        <h2 className="text-lg font-bold text-foreground">Treatment Timeline</h2>
        <ul className="mt-8">
          {d.timeline.map((step, index) => (
            <TimelineStepRow key={step.title} step={step} index={index} total={d.timeline.length} />
          ))}
        </ul>
      </section>
    </div>
  );
}
