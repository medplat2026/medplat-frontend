"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { ROUTES } from "@/constants/routes";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";

export function HospitalEmailStep() {
  const router = useRouter();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    router.push(`${ROUTES.onboarding.hospital.verify}?email=${encodeURIComponent(email.trim())}`);
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Hospital onboarding" carouselActiveIndex={0} />
      }
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Hospital Account"
          subtitle="Enter your work email so we can send a verification code."
        />
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          <InputField
            id="hospital-email"
            label="Email Address"
            type="email"
            autoComplete="email"
            placeholder="you@hospital.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button type="submit" fullWidth>
            Send Verification Code
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
