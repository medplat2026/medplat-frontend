import { Suspense } from "react";
import { HospitalContactStep } from "@/components/onboarding/steps/hospital-contact-step";

function ContactFallback() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center px-6 text-sm text-muted-foreground">
      Loading…
    </div>
  );
}

export default function HospitalContactPage() {
  return (
    <Suspense fallback={<ContactFallback />}>
      <HospitalContactStep />
    </Suspense>
  );
}
