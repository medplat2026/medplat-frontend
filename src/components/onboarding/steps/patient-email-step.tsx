"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { ROUTES } from "@/constants/routes";
import { PATIENT_ONBOARDING_STORAGE } from "@/constants/onboarding";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { isValidEmail } from "@/lib/contact-validation";

export function PatientEmailStep() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.emailVerified);
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.verifiedEmail);
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.registrationDraft);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      toast.error("Please enter your email address.");
      return;
    }
    if (!isValidEmail(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    router.push(`${ROUTES.onboarding.patient.verify}?email=${encodeURIComponent(trimmed)}`);
  };

  return (
    <OnboardingScaffold
      hero={<OnboardingHeroImage alt="Patient onboarding" carouselActiveIndex={0} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Patient Account"
          subtitle="Enter your email so we can send a verification code."
        />
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <InputField
            id="patient-start-email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth>
            Send verification code
          </Button>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.login}>
            Sign in
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
