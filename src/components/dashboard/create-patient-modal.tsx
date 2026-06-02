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
import { Button } from "@/components/ui/Button";
import { ModalFormField } from "@/components/ui/modal-form-field";
import { ModalStepProgress } from "@/components/ui/modal-step-progress";
import { SuccessConfirmModal } from "@/components/ui/success-confirm-modal";
import {
  CREATE_PATIENT_DOCUMENT_ERROR_KEY,
  firstFieldErrorMessage,
  validateCreatePatientStep1,
  validateCreatePatientStep2Draft,
  validateCreatePatientStep2Submit,
} from "@/lib/create-patient-validation";
import { cn } from "@/lib/utils";
import {
  buildHospitalCreatePatientStep1Payload,
  buildHospitalCreatePatientStep2FormData,
  hospitalDashboardQueryKey,
  hospitalMyPatientsQueryKeyRoot,
  hospitalService,
} from "@/services/hospital.service";
import type { APIError } from "@/types/api";

const genderOptions = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "other", label: "Other" },
  { value: "prefer_not", label: "Prefer not to say" },
];

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

const REQUIRED_PATIENT_DOCUMENTS = [
  { id: "doctors_report", label: "Doctor's report", fieldName: "doctors_report" },
  {
    id: "hospital_bill_estimate",
    label: "Hospital bill / estimate",
    fieldName: "hospital_bill_estimate",
  },
  { id: "valid_id_card", label: "Valid ID card", fieldName: "valid_id_card" },
] as const;

type PatientDocumentId = (typeof REQUIRED_PATIENT_DOCUMENTS)[number]["id"];

type PatientDocumentsMap = DocumentUploadsMap<PatientDocumentId>;

const EMPTY_PATIENT_DOCUMENTS = createEmptyDocumentUploads(REQUIRED_PATIENT_DOCUMENTS);

type CreatePatientModalProps = {
  triggerClassName?: string;
};

function firstNameFromFullName(fullName: string): string {
  const t = fullName.trim();
  if (!t) return "Patient";
  return t.split(/\s+/)[0] ?? t;
}

export function CreatePatientModal({ triggerClassName }: CreatePatientModalProps) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [successOpen, setSuccessOpen] = useState(false);
  const [successPatientFirstName, setSuccessPatientFirstName] = useState("");
  const [patientDocuments, setPatientDocuments] = useState<PatientDocumentsMap>(EMPTY_PATIENT_DOCUMENTS);
  const [documentsValidationError, setDocumentsValidationError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patientId, setPatientId] = useState<number | null>(null);
  const [medicalCaseId, setMedicalCaseId] = useState<number | null>(null);
  const [step1FieldErrors, setStep1FieldErrors] = useState<Record<string, string>>({});
  const [step2FieldErrors, setStep2FieldErrors] = useState<Record<string, string>>({});
  const formRef = useRef<HTMLFormElement>(null);
  const formId = useId();

  function resetPatientDocuments() {
    setPatientDocuments(EMPTY_PATIENT_DOCUMENTS);
    setDocumentsValidationError(false);
  }

  function resetCreateFlow() {
    setOpen(false);
    setStep(1);
    setPatientId(null);
    setMedicalCaseId(null);
    resetPatientDocuments();
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStep(1);
      setPatientId(null);
      setMedicalCaseId(null);
      resetPatientDocuments();
      setIsSubmitting(false);
      setStep1FieldErrors({});
      setStep2FieldErrors({});
    }
  }

  function handleSuccessOpenChange(next: boolean) {
    setSuccessOpen(next);
    if (!next) setSuccessPatientFirstName("");
  }

  async function submitStep1(options: { advanceToStep2: boolean }) {
    const form = formRef.current;
    if (!form) return;
    const fd = new FormData(form);
    const step1Errors = validateCreatePatientStep1(fd);
    if (Object.keys(step1Errors).length > 0) {
      setStep1FieldErrors(step1Errors);
      const msg = firstFieldErrorMessage(step1Errors);
      if (msg) toast.error(msg);
      return;
    }
    setStep1FieldErrors({});

    const strictRequired = options.advanceToStep2;
    setIsSubmitting(true);
    try {
      const payload = buildHospitalCreatePatientStep1Payload(fd, strictRequired);
      const result = await hospitalService.patchCreatePatientStep1(payload);
      setPatientId(result.patient_id);
      setMedicalCaseId(result.medical_case_id);
      toast.success(options.advanceToStep2 ? "Step 1 saved." : "Draft saved.");
      if (options.advanceToStep2) {
        setStep(2);
        setStep2FieldErrors({});
      }
    } catch (error) {
      const { message } = error as APIError;
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitStep2(submitCase: boolean) {
    const form = formRef.current;
    if (!form || patientId == null) {
      toast.error("Patient data is missing. Please complete step 1 again.");
      return;
    }
    const formData = new FormData(form);
    const documentsComplete = allDocumentsUploaded(REQUIRED_PATIENT_DOCUMENTS, patientDocuments);
    const step2Errors = submitCase
      ? validateCreatePatientStep2Submit(formData, documentsComplete)
      : validateCreatePatientStep2Draft(formData);
    if (Object.keys(step2Errors).length > 0) {
      setStep2FieldErrors(step2Errors);
      setDocumentsValidationError(Boolean(step2Errors[CREATE_PATIENT_DOCUMENT_ERROR_KEY]));
      const msg = firstFieldErrorMessage(step2Errors);
      if (msg) toast.error(msg);
      return;
    }
    setStep2FieldErrors({});
    setDocumentsValidationError(false);
    const strictRequired = submitCase;
    setIsSubmitting(true);
    try {
      const multipartBody = buildHospitalCreatePatientStep2FormData(
        formData,
        patientId,
        medicalCaseId,
        submitCase,
        {
          doctors_report: patientDocuments.doctors_report,
          hospital_bill_estimate: patientDocuments.hospital_bill_estimate,
          valid_id_card: patientDocuments.valid_id_card,
        },
        strictRequired,
      );
      await hospitalService.postCreatePatientStep2(multipartBody);
      await queryClient.invalidateQueries({ queryKey: hospitalMyPatientsQueryKeyRoot });
      const fullName = String(formData.get("fullName") ?? "");
      if (submitCase) {
        await queryClient.invalidateQueries({ queryKey: hospitalDashboardQueryKey });
        setSuccessPatientFirstName(firstNameFromFullName(fullName));
        resetCreateFlow();
        setSuccessOpen(true);
      } else {
        toast.success("Draft saved.");
        setStep2FieldErrors({});
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
      <Button type="button" className={cn("rounded-xl px-5", triggerClassName)} onClick={() => setOpen(true)}>
        + Create Patient
      </Button>

      <AppModal
        open={open}
        onOpenChange={handleOpenChange}
        size="3xl"
        progress={<ModalStepProgress currentStep={step} totalSteps={2} />}
        title="Create New Patient"
        subtitle={
          step === 1
            ? "Enter patient personal details & medical need to create their profile"
            : "Enter funding request details & verification uploads"
        }
        footer={
          step === 1 ? (
            <div className="flex flex-wrap justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-input-border px-5"
                disabled={isSubmitting}
                onClick={() => submitStep1({ advanceToStep2: false })}
              >
                {isSubmitting ? "Saving…" : "Save as draft"}
              </Button>
              <Button
                type="button"
                className="rounded-xl px-6"
                disabled={isSubmitting}
                onClick={() => submitStep1({ advanceToStep2: true })}
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
                onClick={() => {
                  setStep2FieldErrors({});
                  setDocumentsValidationError(false);
                  setStep(1);
                }}
              >
                Go back
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-xl border-input-border px-5"
                disabled={isSubmitting}
                onClick={() => submitStep2(false)}
              >
                {isSubmitting ? "Saving…" : "Save to draft"}
              </Button>
              <Button
                type="button"
                className="rounded-xl px-6"
                disabled={isSubmitting}
                onClick={() => submitStep2(true)}
              >
                {isSubmitting ? "Submitting…" : "Submit"}
              </Button>
            </div>
          )
        }
      >
        <form ref={formRef} id={formId} className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div hidden={step !== 1}>
            <StepOneFields formId={formId} fieldErrors={step1FieldErrors} />
          </div>
          <div hidden={step !== 2}>
            <StepTwoFields
              formId={formId}
              fieldErrors={step2FieldErrors}
              uploads={patientDocuments}
              onUploadsChange={(next) => {
                setPatientDocuments(next);
                if (allDocumentsUploaded(REQUIRED_PATIENT_DOCUMENTS, next)) {
                  setDocumentsValidationError(false);
                  setStep2FieldErrors((prev) => {
                    if (!prev[CREATE_PATIENT_DOCUMENT_ERROR_KEY]) return prev;
                    const { [CREATE_PATIENT_DOCUMENT_ERROR_KEY]: _, ...rest } = prev;
                    return rest;
                  });
                }
              }}
              showDocumentsError={documentsValidationError}
            />
          </div>
        </form>
      </AppModal>

      <SuccessConfirmModal
        open={successOpen}
        onOpenChange={handleSuccessOpenChange}
        title="Patient Profile Successfully"
        description={`${successPatientFirstName}'s profile has been created and link sent successfully`}
      />
    </>
  );
}

function StepOneFields({ formId, fieldErrors }: { formId: string; fieldErrors: Record<string, string> }) {
  return (
    <div className="space-y-5">
      <ModalFormField
        control="input"
        id={`${formId}-full-name`}
        name="fullName"
        label="Full Name"
        placeholder="Enter full legal name"
        autoComplete="name"
        requiredIndicator
        error={fieldErrors.fullName}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="input"
          id={`${formId}-dob`}
          name="dateOfBirth"
          type="date"
          label="Date of Birth"
          placeholder="Select your date of birth"
          autoComplete="bday"
        />
        <ModalFormField
          control="select"
          id={`${formId}-gender`}
          name="gender"
          label="Gender"
          placeholder="Select your gender"
          defaultValue=""
          options={genderOptions}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="input"
          id={`${formId}-phone`}
          name="phone"
          type="tel"
          label="Phone Number"
          placeholder="(+234)-5433-3472-7365"
          autoComplete="tel"
          requiredIndicator
          error={fieldErrors.phone}
        />
        <ModalFormField
          control="input"
          id={`${formId}-email`}
          name="email"
          type="email"
          label="Email Address"
          placeholder="Patient@email.com"
          autoComplete="email"
          requiredIndicator
          error={fieldErrors.email}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="input"
          id={`${formId}-address`}
          name="homeAddress"
          label="Home Address"
          placeholder="Enter current residential address"
          autoComplete="street-address"
        />
        <ModalFormField
          control="input"
          id={`${formId}-support-for`}
          name="supportFor"
          label="Who is the support for?"
          placeholder="Who's the support for"
          error={fieldErrors.supportFor}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="select"
          id={`${formId}-urgent`}
          name="urgent"
          label="Is it urgent? (Yes/No)"
          placeholder="Yes/No"
          defaultValue="no"
          options={yesNoOptions}
        />
        <ModalFormField
          control="input"
          id={`${formId}-hospital`}
          name="hospital"
          label="Hospital receiving treatment"
          placeholder="Enter hospital name"
          error={fieldErrors.hospital}
        />
      </div>

      <ModalFormField
        control="textarea"
        id={`${formId}-treatment`}
        name="treatmentDescription"
        label="What type of treatment is needed?"
        placeholder="Briefly describe the treatment required (250 words max)..."
        rows={5}
        requiredIndicator
        error={fieldErrors.treatmentDescription}
      />
    </div>
  );
}

function StepTwoFields({
  formId,
  fieldErrors,
  uploads,
  onUploadsChange,
  showDocumentsError,
}: {
  formId: string;
  fieldErrors: Record<string, string>;
  uploads: PatientDocumentsMap;
  onUploadsChange: (uploads: PatientDocumentsMap) => void;
  showDocumentsError: boolean;
}) {
  const fileInputId = `${formId}-patient-docs`;
  const documentBlockError = fieldErrors[CREATE_PATIENT_DOCUMENT_ERROR_KEY];
  const documentsShowError = showDocumentsError || Boolean(documentBlockError);

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="select"
          id={`${formId}-urgency-level`}
          name="urgency_level"
          label="Urgency level"
          placeholder="Select urgency"
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
          label="Patient approved fundraising?"
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
        rows={4}
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
            documents={REQUIRED_PATIENT_DOCUMENTS}
            fileInputId={fileInputId}
            uploads={uploads}
            onUploadsChange={onUploadsChange}
            showError={documentsShowError}
            completeMessage="You can submit the patient profile."
          />
          {documentBlockError ? <p className="mt-2 text-xs text-destructive">{documentBlockError}</p> : null}
        </div>
      </details>
    </div>
  );
}
