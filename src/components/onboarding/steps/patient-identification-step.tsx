"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { InputField } from "@/components/ui/input-field";
import { SelectField } from "@/components/ui/select-field";
import { ROUTES } from "@/constants/routes";
import { PATIENT_IDENTIFICATION_DOC_OPTIONS } from "@/constants/onboarding";
import { CircleStepper } from "@/components/onboarding/circle-stepper";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { OrDivider } from "@/components/onboarding/or-divider";
import { SocialLoginButtons } from "@/components/onboarding/social-login-buttons";

function identificationNumberValid(docType: string, value: string): boolean {
  const v = value.trim();
  if (!v) return false;
  if (docType === "nin") return /^\d{11}$/.test(v);
  return v.length >= 5;
}

export function PatientIdentificationStep() {
  const router = useRouter();
  const [docType, setDocType] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [bvn, setBvn] = useState("");

  const canContinue = useMemo(() => {
    if (!docType) return false;
    if (!identificationNumberValid(docType, documentNumber)) return false;
    if (bvn.trim() && !/^\d{11}$/.test(bvn.trim())) return false;
    return true;
  }, [docType, documentNumber, bvn]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!docType) {
      toast.error("Please select how you will be identified.");
      return;
    }
    if (!identificationNumberValid(docType, documentNumber)) {
      toast.error(
        docType === "nin"
          ? "NIN must be exactly 11 digits."
          : "Please enter a valid identification number."
      );
      return;
    }
    if (bvn.trim() && !/^\d{11}$/.test(bvn.trim())) {
      toast.error("BVN must be exactly 11 digits.");
      return;
    }
    router.push(ROUTES.onboarding.patient.password);
  };

  const docHint =
    docType === "nin"
      ? "Enter your 11-digit National Identification Number."
      : docType === "passport"
        ? "Passport number as shown on the data page."
        : docType === "drivers"
          ? "Licence number on your driver’s licence."
          : docType === "voters"
            ? "VIN as printed on your voter’s card."
            : "Select a document type above, then enter the matching number.";

  return (
    <OnboardingScaffold
      hero={
        <OnboardingHeroImage alt="Verify your identity" carouselActiveIndex={1} />
      }
      beforeTitle={<CircleStepper totalSteps={3} currentStep={1} />}
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading
          title="Create Patient Account"
          subtitle="Step 2 of 3: Means of identification"
        />
        <form className="space-y-5" onSubmit={handleSubmit} noValidate>
          <SelectField
            id="patient-id-doc-type"
            label="Identification document"
            placeholder="Select document type"
            options={PATIENT_IDENTIFICATION_DOC_OPTIONS}
            value={docType}
            onChange={(e) => {
              setDocType(e.target.value);
              setDocumentNumber("");
            }}
            requiredIndicator
          />
          <InputField
            id="patient-id-document-number"
            label="Document number"
            placeholder={docType === "nin" ? "12345678901" : "Enter your document number"}
            inputMode={docType === "nin" ? "numeric" : undefined}
            autoComplete="off"
            value={documentNumber}
            onChange={(e) => setDocumentNumber(e.target.value)}
            requiredIndicator
            hint={docHint}
            maxLength={docType === "nin" ? 11 : undefined}
          />
          <InputField
            id="patient-bvn"
            label="BVN (optional)"
            placeholder="11-digit bank verification number"
            inputMode="numeric"
            autoComplete="off"
            value={bvn}
            onChange={(e) => setBvn(e.target.value.replace(/\D/g, "").slice(0, 11))}
            maxLength={11}
            hint="We may use this to confirm payouts. You can skip if you prefer."
          />
          <Button type="submit" fullWidth disabled={!canContinue}>
            Continue
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
