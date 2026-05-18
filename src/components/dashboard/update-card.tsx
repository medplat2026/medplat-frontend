import type { TreatmentUpdate } from "@/types/treatment-update";

type UpdateCardProps = {
  update: TreatmentUpdate;
};

function UserIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M8 5h7l3 3v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M15 5v4h4" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

function formatUpdateTimestamp(isoDate: string): string {
  const date = new Date(isoDate);
  const datePart = date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
  const timePart = date
    .toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit", hour12: true })
    .replace(/\s/g, "");
  return `${datePart} at ${timePart}`;
}

export function UpdateCard({ update }: UpdateCardProps) {
  const hasAttachments = update.attachments && update.attachments.length > 0;

  return (
    <article className="rounded-xl border border-[#e8ecf1] bg-white p-5 md:p-6">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm font-bold text-foreground">
          <UserIcon className="shrink-0 text-muted-foreground" />
          <span>{update.authorName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CalendarIcon className="shrink-0" />
          <time dateTime={update.createdAt}>{formatUpdateTimestamp(update.createdAt)}</time>
        </div>
      </header>

      <p className="mt-4 text-sm leading-relaxed text-foreground">{update.body}</p>

      {hasAttachments ? (
        <div className="mt-5 rounded-lg bg-[#eef6fc] px-4 py-3.5">
          <p className="text-sm font-medium text-muted-foreground">Attached Document</p>
          <ul className="mt-2 space-y-2">
            {update.attachments!.map((attachment) => (
              <li key={attachment.id}>
                {attachment.href ? (
                  <a
                    href={attachment.href}
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground transition-colors hover:text-onboarding-teal-dark"
                  >
                    <DocumentIcon className="shrink-0 text-onboarding-teal-dark" />
                    {attachment.fileName}
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-foreground">
                    <DocumentIcon className="shrink-0 text-onboarding-teal-dark" />
                    {attachment.fileName}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </article>
  );
}
