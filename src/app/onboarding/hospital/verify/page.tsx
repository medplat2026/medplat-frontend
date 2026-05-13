import { Suspense } from "react";
import { HospitalVerifyStep } from "@/components/onboarding/steps/hospital-verify-step";

function VerifyFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-muted-foreground">
      Loading verification…
    </div>
  );
}

export default function HospitalVerifyPage() {
  return (
    <Suspense fallback={<VerifyFallback />}>
      <HospitalVerifyStep />
    </Suspense>
  );
}
