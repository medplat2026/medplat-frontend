"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
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
import { cn } from "@/lib/utils";

export function HospitalPasswordStep() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const passwordRulesMet = useMemo(() => {
    return password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
  }, [password]);

  const canSubmit = passwordRulesMet && password === confirmPassword;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canSubmit) {
      toast.error("Please meet password requirements and ensure both fields match.");
      return;
    }
    toast.success("Hospital account created (demo).");
    router.push("/");
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Secure your hospital account" carouselActiveIndex={2} />
      }
      beforeTitle={<CircleStepper totalSteps={4} currentStep={3} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Step 4 of 4: Choose a secure password"
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
