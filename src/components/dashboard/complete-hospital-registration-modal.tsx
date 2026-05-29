"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import {
  allDocumentsUploaded,
  createEmptyDocumentUploads,
  DocumentsDetailsChevron,
  SequentialDocumentsUpload,
  type DocumentUploadsMap,
  type RequiredDocument,
} from "@/components/dashboard/sequential-documents-upload";
import { AppModal } from "@/components/ui/app-modal";
import { Button } from "@/components/ui/Button";
import { ModalFormField } from "@/components/ui/modal-form-field";
import { ModalStepProgress } from "@/components/ui/modal-step-progress";
import type { SelectOption } from "@/components/ui/select-field";
import {
  buildHospitalBasicInfoFromFormData,
  buildHospitalServiceCapacityFormData,
  hospitalService,
} from "@/services/hospital.service";
import type { APIError } from "@/types/api";
import type { HospitalOnboardingChoices } from "@/types/hospital";

const yesNoOptions: SelectOption[] = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

function documentSpecsFromChoices(
  choices: HospitalOnboardingChoices,
): RequiredDocument<string>[] {
  return choices.document_types.map((doc) => ({
    id: doc.value,
    label: doc.label,
    fieldName: `document_${doc.value}`,
  }));
}

export type CompleteHospitalRegistrationModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onComplete: () => void;
};

export function CompleteHospitalRegistrationModal({
  open,
  onOpenChange,
  onComplete,
}: CompleteHospitalRegistrationModalProps) {
  const [step, setStep] = useState(1);
  const stepRef = useRef(step);
  stepRef.current = step;
  const [choices, setChoices] = useState<HospitalOnboardingChoices | null>(null);
  const [choicesLoading, setChoicesLoading] = useState(false);
  const [hospitalDocuments, setHospitalDocuments] = useState<DocumentUploadsMap<string>>({});
  const [documentsValidationError, setDocumentsValidationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();
  const fileInputId = `${formId}-hospital-docs`;

  const requiredDocuments = useMemo(
    () => (choices ? documentSpecsFromChoices(choices) : []),
    [choices],
  );

  const documentTypeValues = useMemo(
    () => requiredDocuments.map((doc) => doc.id),
    [requiredDocuments],
  );

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setChoicesLoading(true);
    hospitalService
      .getOnboardingChoices()
      .then((data) => {
        if (!cancelled) {
          setChoices(data);
          setHospitalDocuments(createEmptyDocumentUploads(documentSpecsFromChoices(data)));
        }
      })
      .catch((error) => {
        if (!cancelled) {
          const { message } = error as APIError;
          toast.error(message);
        }
      })
      .finally(() => {
        if (!cancelled) setChoicesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open]);

  function resetDocuments() {
    if (choices) {
      setHospitalDocuments(createEmptyDocumentUploads(documentSpecsFromChoices(choices)));
    } else {
      setHospitalDocuments({});
    }
    setDocumentsValidationError(false);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setStep(1);
      resetDocuments();
      setIsSubmitting(false);
    }
  }

  async function submitBasicInfo(isDraft: boolean) {
    const form = formRef.current;
    if (!form) return;
    if (!choices) {
      toast.error("Registration options are still loading. Please wait.");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = buildHospitalBasicInfoFromFormData(new FormData(form), isDraft);
      const data = await hospitalService.patchMyHospitalBasicInfo(payload);
      const message =
        typeof data.message === "string"
          ? data.message
          : isDraft
            ? "Draft saved."
            : "Basic information saved.";
      toast.success(message);
      if (!isDraft) setStep(2);
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  const stepTitle =
    step === 1 ? "Basic Information *" : "Service capacity & Document verification *";

  const optionsReady = Boolean(choices) && !choicesLoading;

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      size="3xl"
      progress={<ModalStepProgress currentStep={step} totalSteps={2} />}
      title={stepTitle}
      footer={
        !optionsReady ? null : step === 1 ? (
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-input-border px-5"
              disabled={isSubmitting}
              onClick={() => submitBasicInfo(true)}
            >
              {isSubmitting ? "Saving…" : "Save as draft"}
            </Button>
            <Button
              type="button"
              className="rounded-xl px-6"
              disabled={isSubmitting}
              onClick={() => submitBasicInfo(false)}
            >
              {isSubmitting ? "Saving…" : "Continue"}
            </Button>
          </div>
        ) : (
          <div className="flex flex-wrap justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              className="rounded-xl border-input-border px-5"
              disabled={isSubmitting}
              onClick={() => setStep(1)}
            >
              Go back
            </Button>
            <Button type="submit" form={formId} className="rounded-xl px-6" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Submit"}
            </Button>
          </div>
        )
      }
    >
      {choicesLoading || !choices ? (
        <p className="py-8 text-center text-sm text-muted-foreground">Loading registration options…</p>
      ) : (
        <form
          ref={formRef}
          id={formId}
          className="space-y-5"
          onSubmit={async (e) => {
            e.preventDefault();
            if (stepRef.current !== 2) return;
            if (!choices) return;

            if (!allDocumentsUploaded(requiredDocuments, hospitalDocuments)) {
              setDocumentsValidationError(true);
              return;
            }
            setDocumentsValidationError(false);

            setIsSubmitting(true);
            try {
              const fd = buildHospitalServiceCapacityFormData(
                new FormData(e.currentTarget),
                hospitalDocuments as Record<string, File>,
                documentTypeValues,
              );
              const data = await hospitalService.postMyHospitalServiceCapacity(fd);
              const message =
                typeof data.message === "string"
                  ? data.message
                  : "Hospital registration submitted.";
              toast.success(message);
              onComplete();
            } catch (error) {
              const { message } = error as APIError;
              toast.error(message);
            } finally {
              setIsSubmitting(false);
            }
          }}
        >
          <div hidden={step !== 1}>
            <HospitalRegistrationStepOne formId={formId} hospitalTypes={choices.hospital_types} />
          </div>
          <div hidden={step !== 2}>
            <HospitalRegistrationStepTwo
              formId={formId}
              fileInputId={fileInputId}
              medicalCaseOptions={choices.medical_case_types}
              departmentOptions={choices.available_departments}
              requiredDocuments={requiredDocuments}
              uploads={hospitalDocuments}
              onUploadsChange={(next) => {
                setHospitalDocuments(next);
                if (allDocumentsUploaded(requiredDocuments, next)) {
                  setDocumentsValidationError(false);
                }
              }}
              showDocumentsError={documentsValidationError}
            />
          </div>
        </form>
      )}
    </AppModal>
  );
}

function HospitalRegistrationStepOne({
  formId,
  hospitalTypes,
}: {
  formId: string;
  hospitalTypes: SelectOption[];
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="input"
          id={`${formId}-hospital-name`}
          name="hospitalName"
          label="Hospital Name"
          placeholder="Enter your hospital's official name"
          autoComplete="organization"
          requiredIndicator
        />
        <ModalFormField
          control="select"
          id={`${formId}-facility-type`}
          name="facilityType"
          label="Type of Facility"
          placeholder="Select the type of healthcare facility"
          defaultValue=""
          options={hospitalTypes}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="input"
          id={`${formId}-license`}
          name="licenseNumber"
          label="Registration / License Number"
          placeholder="Enter your valid registration or license number"
        />
        <ModalFormField
          control="input"
          id={`${formId}-contact-person`}
          name="contactPerson"
          label="Contact Person Name"
          placeholder="Full name of the primary contact person"
          autoComplete="name"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="input"
          id={`${formId}-contact-email`}
          name="contactEmail"
          type="email"
          label="Contact Email"
          placeholder="hospital@email.com"
          autoComplete="email"
        />
        <ModalFormField
          control="input"
          id={`${formId}-contact-phone`}
          name="contactPhone"
          type="tel"
          label="Contact Phone No."
          placeholder="+(234)-0000-0000"
          autoComplete="tel"
        />
      </div>

      <ModalFormField
        control="input"
        id={`${formId}-street-address`}
        name="streetAddress"
        label="Street Address"
        placeholder="Enter your complete street address"
        autoComplete="street-address"
        requiredIndicator
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModalFormField
          control="input"
          id={`${formId}-city`}
          name="city"
          label="City"
          placeholder="City"
          autoComplete="address-level2"
          requiredIndicator
        />
        <ModalFormField
          control="input"
          id={`${formId}-state`}
          name="state"
          label="State"
          placeholder="State (optional)"
          autoComplete="address-level1"
        />
        <ModalFormField
          control="input"
          id={`${formId}-postal-code`}
          name="postalCode"
          label="Postal Code"
          placeholder="Postal code (optional)"
          autoComplete="postal-code"
        />
      </div>
    </div>
  );
}

function HospitalRegistrationStepTwo({
  formId,
  fileInputId,
  medicalCaseOptions,
  departmentOptions,
  requiredDocuments,
  uploads,
  onUploadsChange,
  showDocumentsError,
}: {
  formId: string;
  fileInputId: string;
  medicalCaseOptions: SelectOption[];
  departmentOptions: SelectOption[];
  requiredDocuments: RequiredDocument<string>[];
  uploads: DocumentUploadsMap<string>;
  onUploadsChange: (uploads: DocumentUploadsMap<string>) => void;
  showDocumentsError: boolean;
}) {
  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="select"
          id={`${formId}-medical-cases`}
          name="medicalCases"
          label="What medical cases do you handle?"
          placeholder="Select a case type"
          defaultValue=""
          options={medicalCaseOptions}
          requiredIndicator
        />
        <ModalFormField
          control="select"
          id={`${formId}-emergency-referrals`}
          name="emergencyReferrals"
          label="Emergency Referrals (Yes/No)"
          placeholder="Yes/No"
          defaultValue=""
          options={yesNoOptions}
          requiredIndicator
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="select"
          id={`${formId}-departments`}
          name="departments"
          label="Available Departments"
          placeholder="Select a department"
          defaultValue=""
          options={departmentOptions}
          requiredIndicator
        />
        <ModalFormField
          control="input"
          id={`${formId}-bed-capacity`}
          name="bedCapacity"
          type="number"
          min={0}
          label="Bed Capacity (Optional)"
          placeholder="Enter the number of available beds"
        />
      </div>

      <details className="group rounded-xl border border-input-border bg-white open:shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
          <span>Select documents</span>
          <span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden>
            <DocumentsDetailsChevron />
          </span>
        </summary>
        <div className="border-t border-border px-4 pb-4 pt-3">
          <SequentialDocumentsUpload
            documents={requiredDocuments}
            fileInputId={fileInputId}
            uploads={uploads}
            onUploadsChange={onUploadsChange}
            showError={showDocumentsError}
            completeMessage="You can submit your hospital registration."
          />
        </div>
      </details>
    </div>
  );
}
