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
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { axiosInstance } from "@/lib/axios";
import { cn } from "@/lib/utils";

const PATIENT_REGISTRATION_DRAFT_KEY = "patient-registration-draft";

type PatientRegistrationDraft = {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
};

export function PatientPasswordStep() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registrationDraft, setRegistrationDraft] = useState<PatientRegistrationDraft | null>(null);

  useEffect(() => {
    const serializedDraft = window.sessionStorage.getItem(PATIENT_REGISTRATION_DRAFT_KEY);
    if (!serializedDraft) {
      toast.error("Please complete your basic details first.");
      router.replace(ROUTES.onboarding.patient.details);
      return;
    }

    try {
      const parsedDraft = JSON.parse(serializedDraft) as PatientRegistrationDraft;
      if (!parsedDraft.first_name || !parsedDraft.last_name || !parsedDraft.email || !parsedDraft.phone_number) {
        throw new Error("Invalid registration draft");
      }
      setRegistrationDraft(parsedDraft);
    } catch {
      window.sessionStorage.removeItem(PATIENT_REGISTRATION_DRAFT_KEY);
      toast.error("Your registration details are invalid. Please try again.");
      router.replace(ROUTES.onboarding.patient.details);
    }
  }, [router]);

  const passwordRulesMet = useMemo(() => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }, [password]);

  const canSubmit = Boolean(registrationDraft) && passwordRulesMet && password === confirmPassword && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error("Please meet password requirements and ensure both fields match.");
      return;
    }

    if (!registrationDraft) {
      toast.error("Please complete your basic details first.");
      router.replace(ROUTES.onboarding.patient.details);
      return;
    }

    setIsSubmitting(true);
    try {
      await axiosInstance.post("/auth/auth/register/", {
        ...registrationDraft,
        password,
        password_confirm: confirmPassword,
      });
      window.sessionStorage.removeItem(PATIENT_REGISTRATION_DRAFT_KEY);
      toast.success("Patient account created successfully.");
      router.push(ROUTES.login);
    } catch {
      toast.error("Unable to create your account right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Secure your patient account" carouselActiveIndex={2} />
      }
      beforeTitle={<CircleStepper totalSteps={2} currentStep={1} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Patient Account"
          subtitle="Step 2 of 2: Create a secure password"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <PasswordField
              id="patient-account-password"
              label="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordField
              id="patient-account-password-confirm"
              label="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <PasswordStrengthMeter password={password} />
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <LabeledCheckbox
              id="patient-remember-me"
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            <Link
              className="text-sm font-semibold text-foreground underline-offset-4 hover:underline"
              href={ROUTES.login}
            >
              Sign in instead
            </Link>
          </div>
          <Button
            type="submit"
            fullWidth
            variant={canSubmit ? "brand" : "subtle"}
            disabled={!canSubmit}
            className={cn("py-3 text-xs", !canSubmit && "bg-[#F8FAFC]")}
          >
            {isSubmitting ? "Creating account..." : "Create account"}
          </Button>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.onboarding.patient.details}>
            Register now
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
