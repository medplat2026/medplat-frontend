"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { ROUTES } from "@/constants/routes";
import { HOSPITAL_ONBOARDING_STORAGE } from "@/constants/onboarding";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";
import { isValidEmail, normalizeNigerianPhone } from "@/lib/contact-validation";

type HospitalRegistrationDraft = {
  hospital_name: string;
  email: string;
  phone_number: string;
};

export function HospitalContactStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryEmail = useMemo(() => (searchParams.get("email") ?? "").trim(), [searchParams]);

  const [hospitalName, setHospitalName] = useState("");
  const [verifiedEmail, setVerifiedEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    const ok = window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.emailVerified);
    const stored = window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.verifiedEmail) ?? "";

    if (ok !== "true" || !stored || !isValidEmail(stored)) {
      toast.error("Please verify your email before continuing.");
      router.replace(ROUTES.onboarding.hospital.email);
      return;
    }

    if (queryEmail && queryEmail.toLowerCase() !== stored.toLowerCase()) {
      toast.message("Using your verified email address.");
    }

    setVerifiedEmail(stored);
  }, [queryEmail, router]);

  const normalizedPhone = normalizeNigerianPhone(phone);
  const emailValid = verifiedEmail ? isValidEmail(verifiedEmail) : false;
  const canContinue = Boolean(
    hospitalName.trim() && verifiedEmail.trim() && phone.trim() && emailValid && normalizedPhone
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof window === "undefined") return;

    if (window.sessionStorage.getItem(HOSPITAL_ONBOARDING_STORAGE.emailVerified) !== "true") {
      toast.error("Please verify your email before continuing.");
      router.replace(ROUTES.onboarding.hospital.email);
      return;
    }

    if (!hospitalName.trim()) {
      toast.error("Please enter your hospital name.");
      return;
    }
    if (!emailValid || !verifiedEmail.trim()) {
      toast.error("Please use your verified email address.");
      return;
    }
    if (!normalizedPhone) {
      toast.error("Please enter a valid Nigerian phone number.");
      return;
    }

    const payload: HospitalRegistrationDraft = {
      hospital_name: hospitalName.trim(),
      email: verifiedEmail.trim(),
      phone_number: `${countryCode}${normalizedPhone}`,
    };

    window.sessionStorage.setItem(HOSPITAL_ONBOARDING_STORAGE.registrationDraft, JSON.stringify(payload));
    router.push(ROUTES.onboarding.hospital.password);
  };

  if (!verifiedEmail) {
    return null;
  }

  return (
    <OnboardingScaffold
      hero={<OnboardingHeroImage alt="Hospital onboarding" carouselActiveIndex={0} />}
      beforeTitle={<CircleStepper totalSteps={2} currentStep={0} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Step 1 of 2: Hospital name and contact details"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            id="hospital-name"
            label="Hospital name"
            type="text"
            autoComplete="organization"
            placeholder="Enter hospital name"
            value={hospitalName}
            onChange={(e) => setHospitalName(e.target.value)}
            requiredIndicator
          />
          <InputField
            id="contact-email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@hospital.org"
            value={verifiedEmail}
            readOnly
            hint="This is the address you verified. Contact support if you need to change it."
            requiredIndicator
          />
          <PhoneField
            idPrefix="contact-phone"
            countryValue={countryCode}
            onCountryChange={setCountryCode}
            phoneProps={{
              value: phone,
              onChange: (e) => setPhone(e.target.value.replace(/[^\d\s()-]/g, "")),
              name: "phone",
              autoComplete: "tel",
              required: true,
              maxLength: 15,
            }}
            className={phone.trim() && !normalizedPhone ? "[&_input]:border-destructive" : undefined}
          />
          {phone.trim() && !normalizedPhone ? (
            <p className="-mt-2 text-xs text-destructive">
              Enter a valid Nigerian number (for example: 8031234567 or 08031234567).
            </p>
          ) : null}
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
