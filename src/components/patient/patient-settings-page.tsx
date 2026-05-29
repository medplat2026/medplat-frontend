"use client";

import { Button } from "@/components/ui/Button";

type PatientSettingsPageProps = {
  patientName: string;
};

export function PatientSettingsPage({ patientName }: PatientSettingsPageProps) {
  return (
    <div className="mt-6 max-w-xl space-y-8 pb-8">
      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground">Profile</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Signed in as <span className="font-medium text-foreground">{patientName}</span>. Profile editing will be
          available when your account is linked to the live API.
        </p>
      </section>

      <section className="rounded-2xl border border-border bg-white p-6 shadow-sm">
        <h2 className="text-base font-bold text-foreground">Notifications</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose how you want to hear about donations and case updates. Preferences will appear here in a future
          release.
        </p>
        <Button type="button" variant="outline" className="mt-4 rounded-xl" disabled>
          Manage preferences (soon)
        </Button>
      </section>
    </div>
  );
}
