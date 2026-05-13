"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { PhoneField } from "@/components/ui/phone-field";
import { ROUTES } from "@/constants/routes";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";

const PATIENT_REGISTRATION_DRAFT_KEY = "patient-registration-draft";
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

function normalizeNigerianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const withoutLeadingZero = digits.startsWith("0") ? digits.slice(1) : digits;
  if (!/^[7-9]\d{9}$/.test(withoutLeadingZero)) return null;
  return withoutLeadingZero;
}

export function PatientDetailsStep() {
  const router = useRouter();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");

  const normalizedPhone = normalizeNigerianPhone(phone);
  const emailValid = isValidEmail(email);
  const canContinue = Boolean(
    firstName.trim() && lastName.trim() && email.trim() && phone.trim() && emailValid && normalizedPhone
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !phone.trim()) {
      toast.error("Please enter your first name, last name, email, and phone number.");
      return;
    }
    if (!emailValid) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!normalizedPhone) {
      toast.error("Please enter a valid Nigerian phone number.");
      return;
    }

    const payload = {
      first_name: firstName.trim(),
      last_name: lastName.trim(),
      email: email.trim(),
      phone_number: `${countryCode}${normalizedPhone}`,
    };

    if (typeof window !== "undefined") {
      window.sessionStorage.setItem(PATIENT_REGISTRATION_DRAFT_KEY, JSON.stringify(payload));
    }

    router.push(ROUTES.onboarding.patient.password);
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Patient onboarding" carouselActiveIndex={0} />
      }
      beforeTitle={<CircleStepper totalSteps={2} currentStep={0} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Patient Account"
          subtitle="Step 1 of 2: Your basic details"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            id="patient-first-name"
            label="First name"
            type="text"
            autoComplete="given-name"
            placeholder="Enter your first name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            requiredIndicator
          />
          <InputField
            id="patient-last-name"
            label="Last name"
            type="text"
            autoComplete="family-name"
            placeholder="Enter your last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            requiredIndicator
          />
          <InputField
            id="patient-details-email"
            label="Email address"
            type="email"
            autoComplete="email"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={email.trim() && !emailValid ? "Please enter a valid email address." : undefined}
            requiredIndicator
          />
          <PhoneField
            idPrefix="patient-details-phone"
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
          Already have an account?{" "}
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.login}>
            Sign in
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
