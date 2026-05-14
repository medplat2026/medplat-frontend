import { Suspense } from "react";
import { PatientVerifyStep } from "@/components/onboarding/steps/patient-verify-step";

function VerifyFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-muted-foreground">
      Loading verification…
    </div>
  );
}

export default function PatientVerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <PatientVerifyStep />
    </Suspense>
  );
}
