"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { ROUTES } from "@/constants/routes";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";

export function HospitalValidationStep() {
  const router = useRouter();
  const [licenceNumber, setLicenceNumber] = useState("");
  const [facilityRegNumber, setFacilityRegNumber] = useState("");

  const canContinue = licenceNumber.trim().length >= 3;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) {
      toast.error("Please enter your hospital licence number.");
      return;
    }
    router.push(ROUTES.onboarding.hospital.password);
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Hospital compliance" carouselActiveIndex={2} />
      }
      beforeTitle={<CircleStepper totalSteps={4} currentStep={2} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Step 3 of 4: Regulatory and licence information"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            id="hospital-licence"
            label="Hospital licence number"
            placeholder="e.g. MLSCN/LG/XXXX"
            value={licenceNumber}
            onChange={(e) => setLicenceNumber(e.target.value)}
            requiredIndicator
            hint="Issued by your state or federal medical board."
          />
          <InputField
            id="facility-registration"
            label="Facility registration number (optional)"
            placeholder="CAC / NHIS / other registration ID"
            value={facilityRegNumber}
            onChange={(e) => setFacilityRegNumber(e.target.value)}
          />
          <Button type="submit" fullWidth disabled={!canContinue}>
            Continue
          </Button>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.onboarding.hospital.email}>
            Register now
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
