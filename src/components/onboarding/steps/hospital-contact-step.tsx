"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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

export function HospitalContactStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromQuery = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+234");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (emailFromQuery) setEmail(emailFromQuery);
  }, [emailFromQuery]);

  const canContinue = email.trim() && phone.trim();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canContinue) {
      toast.error("Please enter your email and phone number.");
      return;
    }
    router.push(ROUTES.onboarding.hospital.basics);
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Hospital onboarding" carouselActiveIndex={0} />
      }
      beforeTitle={<CircleStepper totalSteps={4} currentStep={0} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Step 1 of 4: Contact details for your administrator account"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <InputField
            id="contact-email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            requiredIndicator
          />
          <PhoneField
            idPrefix="contact-phone"
            countryValue={countryCode}
            onCountryChange={setCountryCode}
            phoneProps={{
              value: phone,
              onChange: (e) => setPhone(e.target.value),
              name: "phone",
              autoComplete: "tel",
              required: true,
            }}
          />
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
