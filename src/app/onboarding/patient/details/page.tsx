import { Suspense } from "react";
import { PatientDetailsStep } from "@/components/onboarding/steps/patient-details-step";

function DetailsFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

export default function PatientDetailsPage() {
  return (
    <Suspense fallback={<DetailsFallback />}>
      <PatientDetailsStep />
    </Suspense>
  );
}
