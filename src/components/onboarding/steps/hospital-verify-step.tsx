"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { HOSPITAL_ONBOARDING_STORAGE, ONBOARDING_OTP_DIGITS } from "@/constants/onboarding";
import { OtpInputGroup } from "@/components/onboarding/otp-input-group";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { isValidEmail } from "@/lib/contact-validation";
import { authService } from "@/services/auth.service";
import type { APIError } from "@/types/api";

export function HospitalVerifyStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => (searchParams.get("email") ?? "").trim(), [searchParams]);
  const [otp, setOtp] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  useEffect(() => {
    if (!email || !isValidEmail(email)) {
      toast.error("Please start registration with a valid work email.");
      router.replace(ROUTES.onboarding.hospital.email);
      return;
    }
    if (typeof window === "undefined") return;
    const uidStored = window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.verifyEmailUid);
    if (!uidStored || !/^\d+$/.test(uidStored)) {
      toast.error("Please request a verification code first.");
      router.replace(ROUTES.onboarding.hospital.email);
    }
  }, [email, router]);

  const otpDigits = otp.replace(/\D/g, "");
  const otpComplete = otpDigits.length === ONBOARDING_OTP_DIGITS;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email || !isValidEmail(email)) {
      router.replace(ROUTES.onboarding.hospital.email);
      return;
    }
    const token = otpDigits;
    if (token.length !== ONBOARDING_OTP_DIGITS) {
      toast.error(`Please enter the ${ONBOARDING_OTP_DIGITS}-digit code from your email.`);
      return;
    }

    if (typeof window === "undefined") return;
    const uidRaw = window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.verifyEmailUid);
    const uid = uidRaw ? Number.parseInt(uidRaw, 10) : Number.NaN;
    if (!Number.isFinite(uid)) {
      toast.error("Please request a verification code first.");
      router.replace(ROUTES.onboarding.hospital.email);
      return;
    }

    if (isVerifying) return;
    setIsVerifying(true);
    try {
      const data = await authService.verifyEmail({ uid, token });
      const successMessage =
        typeof data.message === "string"
          ? data.message
          : "Email verified. Continue with your hospital details.";
      let registerUid = uid;
      const maybeUid = data.uid;
      if (typeof maybeUid === "number" && Number.isFinite(maybeUid)) {
        registerUid = maybeUid;
      } else if (typeof maybeUid === "string" && /^\d+$/.test(maybeUid)) {
        registerUid = Number.parseInt(maybeUid, 10);
      }
      window.sessionStorage.setItem(HOSPITAL_ONBOARDING_STORAGE.registerHospitalUid, String(registerUid));
      window.sessionStorage.removeItem(HOSPITAL_ONBOARDING_STORAGE.verifyEmailUid);
      window.sessionStorage.setItem(HOSPITAL_ONBOARDING_STORAGE.emailVerified, "true");
      window.sessionStorage.setItem(HOSPITAL_ONBOARDING_STORAGE.verifiedEmail, email.toLowerCase());
      toast.success(successMessage);
      router.push(`${ROUTES.onboarding.hospital.contact}?email=${encodeURIComponent(email)}`);
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    if (!email || !isValidEmail(email)) return;
    setIsResending(true);
    try {
      const { uid, message } = await authService.hospitalInitiateEmail({ email });
      window.sessionStorage.setItem(HOSPITAL_ONBOARDING_STORAGE.verifyEmailUid, String(uid));
      toast.success(message ?? "Verification code resent. Check your inbox.");
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsResending(false);
    }
  };

  if (!email || !isValidEmail(email)) {
    return null;
  }

  return (
    <OnboardingScaffold
      hero={<OnboardingHeroImage alt="Verify your hospital email" carouselActiveIndex={0} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Verify your email"
          subtitle={`We sent a ${ONBOARDING_OTP_DIGITS}-digit code to ${email}. Enter it below to continue.`}
        />
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <OtpInputGroup value={otp} onChange={setOtp} />
          <Button type="submit" fullWidth disabled={!otpComplete || isVerifying}>
            {isVerifying ? "Verifying…" : "Verify and continue"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Didn&apos;t get a code?{" "}
            <button
              type="button"
              className="font-semibold text-onboarding-blue underline-offset-4 hover:underline disabled:opacity-50"
              onClick={handleResend}
              disabled={isResending || isVerifying}
            >
              {isResending ? "Sending…" : "Resend code"}
            </button>
          </p>
        </form>
        <OrDivider />
        <SocialLoginButtons />
        <p className="text-center text-sm text-muted-foreground">
          Wrong email?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.onboarding.hospital.email}>
            Go back
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
