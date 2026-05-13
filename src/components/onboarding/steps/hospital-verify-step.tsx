"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OtpInputGroup } from "@/components/onboarding/otp-input-group";
import { cn } from "@/lib/utils";

export function HospitalVerifyStep() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = useMemo(() => searchParams.get("email") ?? "", [searchParams]);
  const [code, setCode] = useState("");
  const codeComplete = code.replace(/\D/g, "").length >= 5;

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!codeComplete) {
      toast.error("Enter the 5-digit verification code.");
      return;
    }
    router.push(
      email
        ? `${ROUTES.onboarding.hospital.contact}?email=${encodeURIComponent(email)}`
        : ROUTES.onboarding.hospital.contact
    );
  };

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Advanced medical care environment" carouselActiveIndex={0} />
      }
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Verify Your Account"
          subtitle={
            email ? (
              <>
                Enter the verification code we sent to <span className="font-semibold text-foreground">{email}</span>
              </>
            ) : (
              "Enter the verification code we sent to your email address."
            )
          }
        />
        <form className="w-full space-y-6" onSubmit={handleSubmit} noValidate>
          <OtpInputGroup value={code} onChange={setCode} />
          <Button
            type="submit"
            fullWidth
            variant={codeComplete ? "brand" : "subtle"}
            disabled={!codeComplete}
            className={cn("py-4 text-xs", !codeComplete && "bg-[#F8FAFC]")}
          >
            Verify now
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            className="font-semibold text-onboarding-blue hover:underline"
            onClick={() => toast.message("Verification code resent (demo).")}
          >
            Resend
          </button>
        </p>
        <p className="text-center text-sm">
          <Link className="font-semibold text-onboarding-blue hover:underline" href={ROUTES.onboarding.hospital.email}>
            Use a different email
          </Link>
        </p>
      </div>
    </OnboardingScaffold>
  );
}
