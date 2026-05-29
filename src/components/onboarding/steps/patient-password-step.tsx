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
import { PATIENT_ONBOARDING_STORAGE } from "@/constants/onboarding";
import { registerPatient } from "@/services/auth.service";
import type { APIError } from "@/types/api";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { cn } from "@/lib/utils";

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
    if (typeof window === "undefined") return;

    if (window.sessionStorage.getItem(PATIENT_ONBOARDING_STORAGE.emailVerified) !== "true") {
      toast.error("Please verify your email before continuing.");
      router.replace(ROUTES.onboarding.patient.email);
      return;
    }

    const serializedDraft = window.sessionStorage.getItem(PATIENT_ONBOARDING_STORAGE.registrationDraft);
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

      const uidRaw = window.sessionStorage.getItem(PATIENT_ONBOARDING_STORAGE.registerPatientUid);
      if (!uidRaw || !/^\d+$/.test(uidRaw)) {
        toast.error("Please verify your email again to continue.");
        router.replace(
          `${ROUTES.onboarding.patient.verify}?email=${encodeURIComponent(parsedDraft.email.trim())}`,
        );
        return;
      }

      setRegistrationDraft(parsedDraft);
    } catch {
      window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.registrationDraft);
      toast.error("Your registration details are invalid. Please try again.");
      router.replace(ROUTES.onboarding.patient.details);
    }
  }, [router]);

  const passwordRulesMet = useMemo(() => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }, [password]);

  const formValid =
    Boolean(registrationDraft) && passwordRulesMet && password === confirmPassword;
  const canSubmit = formValid && !isSubmitting;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formValid || !registrationDraft) {
      toast.error("Please meet password requirements and ensure both fields match.");
      return;
    }
    if (isSubmitting) return;

    if (typeof window === "undefined") return;
    const uidRaw = window.sessionStorage.getItem(PATIENT_ONBOARDING_STORAGE.registerPatientUid);
    const uid = uidRaw ? Number.parseInt(uidRaw, 10) : Number.NaN;
    if (!Number.isFinite(uid)) {
      toast.error("Please verify your email again to continue.");
      router.replace(
        `${ROUTES.onboarding.patient.verify}?email=${encodeURIComponent(registrationDraft.email.trim())}`,
      );
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await registerPatient({
        uid,
        first_name: registrationDraft.first_name,
        last_name: registrationDraft.last_name,
        phone_number: registrationDraft.phone_number,
        password,
        password_confirm: confirmPassword,
      });
      window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.emailVerified);
      window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.verifiedEmail);
      window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.verifyEmailUid);
      window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.registerPatientUid);
      window.sessionStorage.removeItem(PATIENT_ONBOARDING_STORAGE.registrationDraft);
      const successMessage =
        typeof data.message === "string" ? data.message : "Patient account created successfully.";
      toast.success(successMessage);
      router.push(ROUTES.login);
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <OnboardingScaffold
      hero={<OnboardingHeroImage alt="Secure your patient account" carouselActiveIndex={2} />}
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
            variant={formValid ? "brand" : "subtle"}
            disabled={!canSubmit}
            className={cn("py-3 text-xs", !formValid && "bg-[#F8FAFC]")}
          >
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.onboarding.patient.email}>
            Register now
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
