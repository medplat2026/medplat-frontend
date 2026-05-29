"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { CompleteHospitalRegistrationModal } from "@/components/dashboard/complete-hospital-registration-modal";
import { HospitalRegistrationPromptModal } from "@/components/dashboard/hospital-registration-prompt-modal";
import { SuccessConfirmModal } from "@/components/ui/success-confirm-modal";
import { updateStoredHospitalProfileCompleted } from "@/lib/auth-session";
import {
  markHospitalProfileComplete,
  shouldShowHospitalProfileCompletionModal,
} from "@/lib/hospital-profile-storage";

/**
 * Orchestrates post-onboarding hospital profile completion on the dashboard:
 * prompt modal → two-step registration form → success confirmation.
 */
export function HospitalRegistrationFlow() {
  const [promptOpen, setPromptOpen] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  useEffect(() => {
    setPromptOpen(shouldShowHospitalProfileCompletionModal());
  }, []);

  function handleRegistrationComplete() {
    markHospitalProfileComplete();
    updateStoredHospitalProfileCompleted(true);
    setPromptOpen(false);
    setFormOpen(false);
    setSuccessOpen(true);
    toast.success("Hospital registration submitted.");
  }

  return (
    <>
      <HospitalRegistrationPromptModal
        open={promptOpen}
        onOpenChange={setPromptOpen}
        onKickstart={() => setFormOpen(true)}
      />
      <CompleteHospitalRegistrationModal
        open={formOpen}
        onOpenChange={setFormOpen}
        onComplete={handleRegistrationComplete}
      />
      <SuccessConfirmModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Registration submitted"
        description="Your hospital profile has been submitted for review. You can continue using the dashboard while we verify your details."
        confirmLabel="Continue to dashboard"
      />
    </>
  );
}
