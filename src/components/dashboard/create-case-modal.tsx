"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useId, useRef, useState } from "react";
import { toast } from "sonner";
import {
  allDocumentsUploaded,
  createEmptyDocumentUploads,
  DocumentsDetailsChevron,
  SequentialDocumentsUpload,
  type DocumentUploadsMap,
} from "@/components/dashboard/sequential-documents-upload";
import { AppModal } from "@/components/ui/app-modal";
import { Button, type ButtonVariant } from "@/components/ui/Button";
import { ModalFormField } from "@/components/ui/modal-form-field";
import { SuccessConfirmModal } from "@/components/ui/success-confirm-modal";
import {
  CREATE_PATIENT_DOCUMENT_ERROR_KEY,
  firstFieldErrorMessage,
  validateCreatePatientStep2Draft,
  validateCreatePatientStep2Submit,
} from "@/lib/create-patient-validation";
import { cn } from "@/lib/utils";
import {
  buildHospitalCreatePatientStep2FormData,
  hospitalDashboardQueryKey,
  hospitalMyPatientDetailQueryKeyRoot,
  hospitalMyPatientsQueryKeyRoot,
  hospitalService,
} from "@/services/hospital.service";
import type { APIError } from "@/types/api";

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const urgencyOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "critical", label: "Critical" },
];

const visibilityOptions = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
];

const contactOptions = [
  { value: "phone", label: "Phone" },
  { value: "email", label: "Email" },
  { value: "whatsapp", label: "WhatsApp" },
];

const REQUIRED_CASE_DOCUMENTS = [
  { id: "doctors_report", label: "Doctor's report", fieldName: "doctors_report" },
  {
    id: "hospital_bill_estimate",
    label: "Hospital bill / estimate",
    fieldName: "hospital_bill_estimate",
  },
  { id: "valid_id_card", label: "Valid ID card", fieldName: "valid_id_card" },
] as const;

type CaseDocumentId = (typeof REQUIRED_CASE_DOCUMENTS)[number]["id"];

type CaseDocumentsMap = DocumentUploadsMap<CaseDocumentId>;

const EMPTY_CASE_DOCUMENTS = createEmptyDocumentUploads(REQUIRED_CASE_DOCUMENTS);

export type CreateCaseModalProps = {
  triggerClassName?: string;
  triggerVariant?: ButtonVariant;
  /** Button label; default "+ Create Case" */
  triggerLabel?: string;
  /** Existing patient id for `PATCH /hospitals/create-patient/medical-case/`. */
  patientId?: number;
};

export function CreateCaseModal({
  triggerClassName,
  triggerVariant = "outline",
  triggerLabel = "+ Create Case",
  patientId,
}: CreateCaseModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [caseDocuments, setCaseDocuments] = useState<CaseDocumentsMap>(EMPTY_CASE_DOCUMENTS);
  const [documentsValidationError, setDocumentsValidationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();
  const fileInputId = `${formId}-case-docs`;

  const patientIdValid = patientId != null && Number.isFinite(patientId) && patientId > 0;

  function resetDocuments() {
    setCaseDocuments(EMPTY_CASE_DOCUMENTS);
    setDocumentsValidationError(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      resetDocuments();
      setFieldErrors({});
      setIsSubmitting(false);
    }
  }

  async function submitCase(submitCase: boolean) {
    const form = formRef.current;
    if (!patientIdValid || !form) {
      toast.error("Patient ID is missing. Open Create Case from a patient profile.");
      return;
    }

    const formData = new FormData(form);
    const documentsComplete = allDocumentsUploaded(REQUIRED_CASE_DOCUMENTS, caseDocuments);
    const errors = submitCase
      ? validateCreatePatientStep2Submit(formData, documentsComplete)
      : validateCreatePatientStep2Draft(formData);

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setDocumentsValidationError(Boolean(errors[CREATE_PATIENT_DOCUMENT_ERROR_KEY]));
      const msg = firstFieldErrorMessage(errors);
      if (msg) toast.error(msg);
      return;
    }
    setFieldErrors({});
    setDocumentsValidationError(false);

    setIsSubmitting(true);
    try {
      const multipartBody = buildHospitalCreatePatientStep2FormData(
        formData,
        patientId,
        null,
        submitCase,
        {
          doctors_report: caseDocuments.doctors_report,
          hospital_bill_estimate: caseDocuments.hospital_bill_estimate,
          valid_id_card: caseDocuments.valid_id_card,
        },
        submitCase,
      );
      await hospitalService.patchCreatePatientMedicalCase(multipartBody);
      await queryClient.invalidateQueries({ queryKey: hospitalMyPatientsQueryKeyRoot });
      await queryClient.invalidateQueries({ queryKey: hospitalMyPatientDetailQueryKeyRoot });
      await queryClient.invalidateQueries({ queryKey: hospitalDashboardQueryKey });

      if (submitCase) {
        setOpen(false);
        resetDocuments();
        setSuccessOpen(true);
      } else {
        toast.success("Draft saved.");
      }
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <span className="inline-flex shrink-0">
        <Button
          type="button"
          variant={triggerVariant}
          className={cn(
            triggerVariant === "outline" && "rounded-xl border-onboarding-blue px-5 text-onboarding-blue",
            triggerClassName,
          )}
          onClick={() => setOpen(true)}
        >
          {triggerLabel}
        </Button>
      </span>

      <AppModal
        open={open}
        onOpenChange={handleOpenChange}
        size="3xl"
        title="Create New Case"
        subtitle="Fill in the medical case details and upload required documents"
        footer={
          <div className="space-y-4">
            <CaseSubmitConfirmationBanner />
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-input-border px-5"
                disabled={isSubmitting || !patientIdValid}
                onClick={() => void submitCase(false)}
              >
                {isSubmitting ? "Saving…" : "Save as draft"}
              </Button>
              <Button
                type="button"
                className="rounded-xl px-6"
                disabled={isSubmitting || !patientIdValid}
                onClick={() => void submitCase(true)}
              >
                {isSubmitting ? "Submitting…" : "Submit Case"}
              </Button>
            </div>
          </div>
        }
      >
        <form
          ref={formRef}
          id={formId}
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {!patientIdValid ? (
            <p className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950">
              A patient must be selected. Use <strong>Create Case</strong> from a patient’s profile so their
              server ID can be sent with the request.
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalFormField
              control="select"
              id={`${formId}-urgency`}
              name="urgency_level"
              label="Urgency level"
              placeholder="Select urgency level"
              defaultValue=""
              options={urgencyOptions}
              requiredIndicator
              error={fieldErrors.urgency_level}
            />
            <ModalFormField
              control="input"
              id={`${formId}-expected-start`}
              name="expected_start_date"
              type="date"
              label="Expected start date"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalFormField
              control="input"
              id={`${formId}-estimated-cost`}
              name="estimated_cost"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              label="Estimated treatment cost"
              placeholder="0.00"
              requiredIndicator
              error={fieldErrors.estimated_cost}
            />
            <ModalFormField
              control="input"
              id={`${formId}-amount-paid`}
              name="amount_already_paid"
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              label="Amount already paid"
              placeholder="0"
              defaultValue="0"
              error={fieldErrors.amount_already_paid}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalFormField
              control="select"
              id={`${formId}-visibility`}
              name="visibility"
              label="Case visibility"
              defaultValue="public"
              options={visibilityOptions}
            />
            <ModalFormField
              control="select"
              id={`${formId}-fundraising-approved`}
              name="patient_approved_fundraising"
              label="Patient/family approved fundraising?"
              defaultValue="no"
              options={yesNoOptions}
            />
          </div>

          <ModalFormField
            control="select"
            id={`${formId}-contact-method`}
            name="preferred_contact_method"
            label="Preferred contact method"
            defaultValue="phone"
            options={contactOptions}
            error={fieldErrors.preferred_contact_method}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalFormField
              control="input"
              id={`${formId}-family-name`}
              name="family_contact_name"
              label="Family contact name"
              placeholder="Enter name"
              autoComplete="name"
            />
            <ModalFormField
              control="input"
              id={`${formId}-family-phone`}
              name="family_contact_phone"
              type="tel"
              label="Family contact phone"
              placeholder="(+234)-5433-3472-7365"
              autoComplete="tel"
            />
          </div>

          <ModalFormField
            control="textarea"
            id={`${formId}-patient-story`}
            name="patient_story"
            label="Patient story"
            placeholder="Briefly describe the patient's story…"
            rows={5}
          />

          <details className="group rounded-xl border border-input-border bg-white open:shadow-sm">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
              <span>Upload documents</span>
              <span className="text-muted-foreground transition-transform group-open:rotate-180" aria-hidden>
                <DocumentsDetailsChevron />
              </span>
            </summary>
            <div className="border-t border-border px-4 pb-4 pt-3">
              <SequentialDocumentsUpload
                documents={REQUIRED_CASE_DOCUMENTS}
                fileInputId={fileInputId}
                uploads={caseDocuments}
                onUploadsChange={(next) => {
                  setCaseDocuments(next);
                  if (allDocumentsUploaded(REQUIRED_CASE_DOCUMENTS, next)) {
                    setDocumentsValidationError(false);
                  }
                  setFieldErrors((prev) => {
                    if (!prev[CREATE_PATIENT_DOCUMENT_ERROR_KEY]) return prev;
                    const { [CREATE_PATIENT_DOCUMENT_ERROR_KEY]: _, ...rest } = prev;
                    return rest;
                  });
                }}
                showError={documentsValidationError}
                completeMessage="You can submit the case."
              />
              {fieldErrors[CREATE_PATIENT_DOCUMENT_ERROR_KEY] ? (
                <p className="mt-2 text-xs text-destructive">{fieldErrors[CREATE_PATIENT_DOCUMENT_ERROR_KEY]}</p>
              ) : null}
            </div>
          </details>
        </form>
      </AppModal>

      <SuccessConfirmModal
        open={successOpen}
        onOpenChange={setSuccessOpen}
        title="Case Submitted Successfully"
        description="Your case has been submitted and is pending review."
      />
    </>
  );
}

function CaseSubmitConfirmationBanner() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-[#efe0bc] bg-[#fdfaf3] px-4 py-3">
      <span
        className="flex size-6 shrink-0 items-center justify-center rounded-full bg-onboarding-blue text-xs font-bold text-white"
        aria-hidden
      >
        ✓
      </span>
      <p className="text-sm leading-relaxed text-destructive">
        By submitting this case, you confirm that all information provided is accurate and complete
      </p>
    </div>
  );
}
