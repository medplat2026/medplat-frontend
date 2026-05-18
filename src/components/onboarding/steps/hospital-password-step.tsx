"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { LabeledCheckbox } from "@/components/ui/labeled-checkbox";
import { PasswordField } from "@/components/ui/password-field";
import { PasswordStrengthMeter } from "@/components/ui/password-strength-meter";
import { ROUTES } from "@/constants/routes";
import { HOSPITAL_ONBOARDING_STORAGE } from "@/constants/onboarding";
import { markHospitalProfileNeedsCompletion } from "@/lib/hospital-profile-storage";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { cn } from "@/lib/utils";

type HospitalRegistrationDraft = {
  hospital_name: string;
  email: string;
  phone_number: string;
};

export function HospitalPasswordStep() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [registrationDraft, setRegistrationDraft] = useState<HospitalRegistrationDraft | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    if (window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.emailVerified) !== "true") {
      toast.error("Please verify your email before continuing.");
      router.replace(ROUTES.onboarding.hospital.email);
      return;
    }

    const raw = window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.registrationDraft);
    if (!raw) {
      toast.error("Please complete your hospital details first.");
      router.replace(ROUTES.onboarding.hospital.contact);
      return;
    }

    try {
      const parsed = JSON.parse(raw) as HospitalRegistrationDraft;
      if (!parsed.hospital_name?.trim() || !parsed.email?.trim() || !parsed.phone_number?.trim()) {
        throw new Error("Invalid draft");
      }
      setRegistrationDraft(parsed);
    } catch {
      window.sessionStorage.removeItem(HOSPITAL_ONBOARDING_STORAGE.registrationDraft);
      toast.error("Your registration details are invalid. Please try again.");
      router.replace(ROUTES.onboarding.hospital.contact);
    }
  }, [router]);

  const passwordRulesMet = useMemo(() => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }, [password]);

  const canSubmit = Boolean(registrationDraft) && passwordRulesMet && password === confirmPassword;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit || !registrationDraft) {
      toast.error("Please meet password requirements and ensure both fields match.");
      return;
    }

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(HOSPITAL_ONBOARDING_STORAGE.emailVerified);
      window.sessionStorage.removeItem(HOSPITAL_ONBOARDING_STORAGE.verifiedEmail);
      window.sessionStorage.removeItem(HOSPITAL_ONBOARDING_STORAGE.registrationDraft);
    }

    markHospitalProfileNeedsCompletion();
    toast.success("Hospital account created (demo).");
    router.push(ROUTES.dashboard);
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Secure your hospital account" carouselActiveIndex={1} />
      }
      beforeTitle={<CircleStepper totalSteps={2} currentStep={1} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Step 2 of 2: Choose a secure password"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <PasswordField
              id="account-password"
              label="Create Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordField
              id="account-password-confirm"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordStrengthMeter password={password} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <LabeledCheckbox
              id="remember-me"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link className="text-sm font-semibold text-foreground underline-offset-4 hover:underline" href="#">
              Forgot password?
            </Link>
          </div>
          <Button
            type="submit"
            fullWidth
            variant={canSubmit ? "brand" : "subtle"}
            disabled={!canSubmit}
            className={cn("py-3 text-xs", !canSubmit && "bg-[#F8FAFC]")}
          >
            Create account
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
