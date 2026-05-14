"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { PATIENT_ONBOARDING_STORAGE } from "@/constants/onboarding";
import { OtpInputGroup } from "@/components/onboarding/otp-input-group";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { isValidEmail } from "@/lib/contact-validation";

const OTP_LENGTH = 5;

export function PatientVerifyStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => (searchParams.get("email") ?? "").trim(), [searchParams]);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      toast.error("Please start registration with a valid email.");
      router.replace(ROUTES.onboarding.patient.email);
    }
  }, [email, router]);

  const canSubmit = otp.replace(/\D/g, "").length === OTP_LENGTH;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !isValidEmail(email)) {
      router.replace(ROUTES.onboarding.patient.email);
      return;
    }
    if (!canSubmit) {
      toast.error(`Please enter the ${OTP_LENGTH}-digit code from your email.`);
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(PATIENT_ONBOARDING_STORAGE.emailVerified, "true");
      window.sessionStorage.setItem(PATIENT_ONBOARDING_STORAGE.verifiedEmail, email.toLowerCase());
    }

    toast.success("Email verified. Continue with your details.");
    router.push(`${ROUTES.onboarding.patient.details}?email=${encodeURIComponent(email)}`);
  };

  const handleResend = () => {
    toast.message("Verification code resent (demo). Check your inbox.");
  };

  if (!email || !isValidEmail(email)) {
    return null;
  }

  return (
    <OnboardingScaffold
      hero={<OnboardingHeroImage alt="Verify your email" carouselActiveIndex={0} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Verify your email"
          subtitle={`We sent a ${OTP_LENGTH}-digit code to ${email}. Enter it below to continue.`}
        />
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <OtpInputGroup value={otp} onChange={setOtp} />
          <Button type="submit" fullWidth disabled={!canSubmit}>
            Verify and continue
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              className="font-semibold text-onboarding-blue underline-offset-4 hover:underline"
              onClick={handleResend}
            >
              Resend code
            </button>
          </p>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.onboarding.patient.email}>
            Go back
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
