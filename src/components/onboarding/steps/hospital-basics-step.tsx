"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { ROUTES } from "@/constants/routes";
import { FACILITY_TYPE_OPTIONS } from "@/constants/onboarding";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";

export function HospitalBasicsStep() {
  const router = useRouter();
  const [hospitalName, setHospitalName] = useState("");
  const [facilityType, setFacilityType] = useState("");
  const [bedCapacity, setBedCapacity] = useState("");

  const canContinue = hospitalName.trim() && facilityType && bedCapacity.trim();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) {
      toast.error("Please complete all required fields.");
      return;
    }
    router.push(ROUTES.onboarding.hospital.validation);
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Hospital technology and surgical care" carouselActiveIndex={1} />
      }
      beforeTitle={<CircleStepper totalSteps={4} currentStep={1} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Step 2 of 4: Basic information about your hospital"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            id="hospital-name"
            label="Hospital Name"
            placeholder="Enter hospital name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            requiredIndicator
          />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <SelectField
              id="facility-type"
              label="Type of facility"
              placeholder="Select facility type"
              options={[...FACILITY_TYPE_OPTIONS]}
              value={facilityType}
              onChange={(e) => setFacilityType(e.target.value)}
              requiredIndicator
            />
            <InputField
              id="bed-capacity"
              label="Bed Capacity"
              type="number"
              min={1}
              inputMode="numeric"
              placeholder="120"
              value={bedCapacity}
              onChange={(e) => setBedCapacity(e.target.value)}
              requiredIndicator
            />
          </div>
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
