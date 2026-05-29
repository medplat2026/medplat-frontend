"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { ROUTES } from "@/constants/routes";
import { PATIENT_ONBOARDING_STORAGE } from "@/constants/onboarding";
import { isValidEmail } from "@/lib/contact-validation";
import { authService } from "@/services/auth.service";
import type { APIError } from "@/types/api";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";

export function PatientEmailStep() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.emailVerified);
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.verifiedEmail);
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.verifyEmailUid);
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.registerPatientUid);
    window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.registrationDraft);
  }, []);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
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

    setIsSubmitting(true);
    try {
      const { message, uid } = await authService.patientInitiateEmail({ email: trimmed });
      window.sessionStorage.setItem(PATIENT_ONBOARDING_STORAGE.verifyEmailUid, String(uid));
      toast.success(message ?? "Verification code sent. Check your inbox.");
      router.push(`${ROUTES.onboarding.patient.verify}?email=${encodeURIComponent(trimmed)}`);
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
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
          <Button type="submit" fullWidth disabled={isSubmitting}>
            {isSubmitting ? "Sending…" : "Send verification code"}
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
