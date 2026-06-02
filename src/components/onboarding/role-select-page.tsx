"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/constants/routes";
import { OnboardingHeading } from "@/components/onboarding/onboarding-heading";
import { OnboardingHeroImage } from "@/components/onboarding/onboarding-hero-image";
import { OnboardingScaffold } from "@/components/onboarding/onboarding-scaffold";
import { RoleOptionCard } from "@/components/onboarding/role-option-card";
import { DonorRoleIcon, HospitalRoleIcon, PatientRoleIcon } from "@/components/onboarding/role-select-icons";
import { cn } from "@/lib/utils";

type Role = "hospital" | "patient" | "donor";

export function RoleSelectPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role | null>(null);

  const handleNext = () => {
    if (!role) return;
    if (role === "hospital") {
      router.push(ROUTES.onboarding.hospital.email);
      return;
    }
    if (role === "patient") {
      router.push(ROUTES.onboarding.patient.email);
      return;
    }
    router.push(ROUTES.donor.dashboard);
  };

  return (
    <OnboardingScaffold
      contentWidthClass="max-w-4xl"
      hero={
        <OnboardingHeroImage alt="Medical professionals collaborating" carouselActiveIndex={0} />
      }
    >
      <div className="flex min-h-0 w-full flex-1 flex-col justify-center gap-8">
        <OnboardingHeading title="Welcome to MedPlat" subtitle="Let's setup your experience" />
        <div
          className={cn(
            "space-y-6 rounded-3xl border border-border bg-white p-5 shadow-onboarding-card sm:p-8"
          )}
        >
          <div className="space-y-0.5 text-left">
            <h2 className="text-base font-semibold text-foreground">Select Role</h2>
            <p className="text-xs text-muted-foreground sm:text-[13px]">
              Select your role to access the right dashboard.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <RoleOptionCard
              title="Hospital / Healthcare Provider"
              description="Register your facility, manage patients, and receive referrals."
              selected={role === "hospital"}
              onSelect={() => setRole("hospital")}
              icon={<HospitalRoleIcon />}
            />
            <RoleOptionCard
              title="Patient / Individual"
              description="Create a case, request support, and receive funding."
              selected={role === "patient"}
              onSelect={() => setRole("patient")}
              icon={<PatientRoleIcon />}
            />
            <RoleOptionCard
              title="Donor / Supporter"
              description="Browse verified cases, follow updates, and contribute to care."
              selected={role === "donor"}
              onSelect={() => setRole("donor")}
              icon={<DonorRoleIcon />}
            />
          </div>
          <Button
            type="button"
            variant={role ? "brand" : "subtle"}
            fullWidth
            className={cn("py-4 text-xs", !role && "bg-[#F8FAFC]")}
            disabled={!role}
            onClick={handleNext}
          >
            Next
          </Button>
        </div>
      </div>
    </OnboardingScaffold>
  );
}
