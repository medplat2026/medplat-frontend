"use client";

import type { PatientNotification } from "@/types/patient-dashboard";

function NotificationIcon({ type }: { type: PatientNotification["type"] }) {
  if (type === "donation") {
    return (
      <div
        className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#e8f4fc] text-base font-bold text-onboarding-teal-dark"
        aria-hidden
      >
        ₦
      </div>
    );
  }
  return (
    <div
      className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#f3f4f6] text-muted-foreground"
      aria-hidden
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 22a2 2 0 0 0 2-2H10a2 2 0 0 0 2 2Zm6-6V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

type PatientNotificationsPageProps = {
  notifications: PatientNotification[];
};

export function PatientNotificationsPage({ notifications }: PatientNotificationsPageProps) {
  return (
    <div className="mt-6 space-y-4 pb-6">
      <ul className="space-y-3">
        {notifications.map((item) => (
          <li
            key={item.id}
            className="flex items-start gap-3 rounded-2xl border border-[#e8ecf1] bg-white p-4 shadow-sm"
          >
            <NotificationIcon type={item.type} />
            <div className="min-w-0">
              <p className="font-medium text-foreground">{item.message}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.timestamp}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
