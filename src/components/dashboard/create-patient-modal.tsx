"use client";

import { useId, useRef, useState } from "react";
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
import { cn } from "@/lib/utils";

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

const contactOptions = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "sms", label: "SMS" },
];

const REQUIRED_PATIENT_DOCUMENTS = [
  { id: "doctors_report", label: "Doctor's report", fieldName: "documentDoctorsReport" },
  { id: "hospital_bill", label: "Hospital bill / estimate", fieldName: "documentHospitalBill" },
  { id: "valid_id", label: "Valid ID card", fieldName: "documentValidId" },
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
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const stepRef = useRef(step);
  stepRef.current = step;
  const [successOpen, setSuccessOpen] = useState(false);
  const [successPatientFirstName, setSuccessPatientFirstName] = useState("");
  const [patientDocuments, setPatientDocuments] = useState<PatientDocumentsMap>(EMPTY_PATIENT_DOCUMENTS);
  const [documentsValidationError, setDocumentsValidationError] = useState(false);
  const formId = useId();

  function resetPatientDocuments() {
    setPatientDocuments(EMPTY_PATIENT_DOCUMENTS);
    setDocumentsValidationError(false);
  }

  function resetCreateFlow() {
    setOpen(false);
    setStep(1);
    resetPatientDocuments();
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) {
      setStep(1);
      resetPatientDocuments();
    }
  }

  function handleSuccessOpenChange(next: boolean) {
    setSuccessOpen(next);
    if (!next) setSuccessPatientFirstName("");
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
            ? "Enter patient personal details & Medical need to create their profile"
            : "Enter patient funding request & Verification uploads to create their profile"
        }
        footer={
          step === 1 ? (
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="outline" className="rounded-xl border-input-border px-5">
                Save as draft
              </Button>
              <Button
                type="button"
                className="rounded-xl px-6"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setStep(2);
                }}
              >
                Continue
              </Button>
            </div>
          ) : (
            <div className="flex flex-wrap justify-end gap-3">
              <Button type="button" variant="outline" className="rounded-xl border-input-border px-5" onClick={() => setStep(1)}>
                Go back
              </Button>
              <Button type="submit" form={formId} className="rounded-xl px-6">
                Submit
              </Button>
            </div>
          )
        }
      >
        <form
          id={formId}
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            // Single <form> wraps both steps; implicit submit (e.g. Enter) or stray submits must not
            // complete the flow until the user is on step 2 and submits intentionally.
            if (stepRef.current !== 2) return;
            if (!allDocumentsUploaded(REQUIRED_PATIENT_DOCUMENTS, patientDocuments)) {
              setDocumentsValidationError(true);
              return;
            }
            setDocumentsValidationError(false);
            const fd = new FormData(e.currentTarget);
            const fullName = String(fd.get("fullName") ?? "");
            for (const doc of REQUIRED_PATIENT_DOCUMENTS) {
              const file = patientDocuments[doc.id];
              if (file) fd.append(doc.fieldName, file);
            }
            setSuccessPatientFirstName(firstNameFromFullName(fullName));
            resetCreateFlow();
            setSuccessOpen(true);
          }}
        >
          <div hidden={step !== 1}>
            <StepOneFields formId={formId} />
          </div>
          <div hidden={step !== 2}>
            <StepTwoFields
              formId={formId}
              uploads={patientDocuments}
              onUploadsChange={(next) => {
                setPatientDocuments(next);
                if (allDocumentsUploaded(REQUIRED_PATIENT_DOCUMENTS, next)) setDocumentsValidationError(false);
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

function StepOneFields({ formId }: { formId: string }) {
  return (
    <div className="space-y-5">
      <ModalFormField
        control="input"
        id={`${formId}-full-name`}
        name="fullName"
        label="Full Name"
        placeholder="Enter full legal name"
        autoComplete="name"
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
        />
        <ModalFormField
          control="input"
          id={`${formId}-email`}
          name="email"
          type="email"
          label="Email Address"
          placeholder="Patient@email.com"
          autoComplete="email"
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
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <ModalFormField
          control="select"
          id={`${formId}-urgent`}
          name="urgent"
          label="Is it urgent? (Yes/No)"
          placeholder="Yes/No"
          defaultValue=""
          options={yesNoOptions}
        />
        <ModalFormField
          control="input"
          id={`${formId}-hospital`}
          name="hospital"
          label="Hospital receiving treatment"
          placeholder="Enter hospital name"
        />
      </div>

      <ModalFormField
        control="textarea"
        id={`${formId}-treatment`}
        name="treatmentDescription"
        label="What type of treatment is needed?"
        placeholder="Briefly describe the treatment required (250 words max)..."
        rows={5}
      />
    </div>
  );
}

function StepTwoFields({
  formId,
  uploads,
  onUploadsChange,
  showDocumentsError,
}: {
  formId: string;
  uploads: PatientDocumentsMap;
  onUploadsChange: (uploads: PatientDocumentsMap) => void;
  showDocumentsError: boolean;
}) {
  const fileInputId = `${formId}-patient-docs`;

  return (
    <div className="space-y-5">
      <ModalFormField
        control="input"
        id={`${formId}-estimated-cost`}
        name="estimatedCost"
        label="Estimated treatment cost"
        placeholder="Enter the total estimated cost of treatment"
      />
      <ModalFormField
        control="input"
        id={`${formId}-amount-raised`}
        name="amountRaised"
        label="Amount already raised (optional)"
        placeholder="Enter amount already available, if any"
      />
      <ModalFormField
        control="input"
        id={`${formId}-amount-needed`}
        name="amountNeeded"
        label="Amount still needed"
        placeholder="Enter the remaining amount required"
      />
      <ModalFormField
        control="select"
        id={`${formId}-visible-public`}
        name="visiblePublic"
        label="Make case visible to donors publicly?"
        placeholder="Yes/No"
        defaultValue=""
        options={yesNoOptions}
      />
      <ModalFormField
        control="select"
        id={`${formId}-contact-method`}
        name="contactMethod"
        label="Preferred contact method"
        placeholder="Select how you prefer to be contacted"
        defaultValue=""
        options={contactOptions}
      />

      <details className="group rounded-xl border border-input-border bg-white open:shadow-sm">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-foreground marker:content-none [&::-webkit-details-marker]:hidden">
          <span>Select documents</span>
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
            showError={showDocumentsError}
            completeMessage="You can submit the patient profile."
          />
        </div>
      </details>
    </div>
  );
}
