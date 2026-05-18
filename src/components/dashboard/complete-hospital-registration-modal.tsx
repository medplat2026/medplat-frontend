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

const facilityTypeOptions = [
  { value: "general", label: "General hospital" },
  { value: "specialist", label: "Specialist hospital" },
  { value: "clinic", label: "Clinic" },
  { value: "diagnostic", label: "Diagnostic center" },
  { value: "other", label: "Other" },
];

const yesNoOptions = [
  { value: "yes", label: "Yes" },
  { value: "no", label: "No" },
];

const medicalCaseOptions = [
  { value: "cardiac", label: "Cardiac surgery" },
  { value: "orthopedic", label: "Orthopedic surgery" },
  { value: "oncology", label: "Oncology" },
  { value: "transplant", label: "Organ transplant" },
  { value: "emergency", label: "Emergency / trauma" },
  { value: "other", label: "Other" },
];

const departmentOptions = [
  { value: "emergency", label: "Emergency" },
  { value: "surgery", label: "Surgery" },
  { value: "icu", label: "ICU" },
  { value: "pediatrics", label: "Pediatrics" },
  { value: "maternity", label: "Maternity" },
  { value: "radiology", label: "Radiology" },
];

const REQUIRED_HOSPITAL_DOCUMENTS = [
  { id: "operating_license", label: "Operating License", fieldName: "documentOperatingLicense" },
  { id: "cac_certificate", label: "CAC / Registration Certificate", fieldName: "documentCacCertificate" },
  {
    id: "representative_id",
    label: "Authorized Representative ID",
    fieldName: "documentRepresentativeId",
  },
] as const;

type HospitalDocumentId = (typeof REQUIRED_HOSPITAL_DOCUMENTS)[number]["id"];

type HospitalDocumentsMap = DocumentUploadsMap<HospitalDocumentId>;

const EMPTY_HOSPITAL_DOCUMENTS = createEmptyDocumentUploads(REQUIRED_HOSPITAL_DOCUMENTS);

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
  const [hospitalDocuments, setHospitalDocuments] = useState<HospitalDocumentsMap>(EMPTY_HOSPITAL_DOCUMENTS);
  const [documentsValidationError, setDocumentsValidationError] = useState(false);
  const formId = useId();
  const fileInputId = `${formId}-hospital-docs`;

  function resetDocuments() {
    setHospitalDocuments(EMPTY_HOSPITAL_DOCUMENTS);
    setDocumentsValidationError(false);
  }

  function handleOpenChange(next: boolean) {
    onOpenChange(next);
    if (!next) {
      setStep(1);
      resetDocuments();
    }
  }

  const stepTitle =
    step === 1 ? "Basic Information *" : "Service capacity & Document verification *";

  return (
    <AppModal
      open={open}
      onOpenChange={handleOpenChange}
      size="3xl"
      progress={<ModalStepProgress currentStep={step} totalSteps={2} />}
      title={stepTitle}
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
          if (stepRef.current !== 2) return;
          if (!allDocumentsUploaded(REQUIRED_HOSPITAL_DOCUMENTS, hospitalDocuments)) {
            setDocumentsValidationError(true);
            return;
          }
          setDocumentsValidationError(false);
          onComplete();
        }}
      >
        <div hidden={step !== 1}>
          <HospitalRegistrationStepOne formId={formId} />
        </div>
        <div hidden={step !== 2}>
          <HospitalRegistrationStepTwo
            formId={formId}
            fileInputId={fileInputId}
            uploads={hospitalDocuments}
            onUploadsChange={(next) => {
              setHospitalDocuments(next);
              if (allDocumentsUploaded(REQUIRED_HOSPITAL_DOCUMENTS, next)) setDocumentsValidationError(false);
            }}
            showDocumentsError={documentsValidationError}
          />
        </div>
      </form>
    </AppModal>
  );
}

function HospitalRegistrationStepOne({ formId }: { formId: string }) {
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
        />
        <ModalFormField
          control="select"
          id={`${formId}-facility-type`}
          name="facilityType"
          label="Type of Facility"
          placeholder="Select the type of healthcare facility"
          defaultValue=""
          options={facilityTypeOptions}
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
        id={`${formId}-full-address`}
        name="fullAddress"
        label="Full Address"
        placeholder="Enter your complete street address"
        autoComplete="street-address"
      />
    </div>
  );
}

function HospitalRegistrationStepTwo({
  formId,
  fileInputId,
  uploads,
  onUploadsChange,
  showDocumentsError,
}: {
  formId: string;
  fileInputId: string;
  uploads: HospitalDocumentsMap;
  onUploadsChange: (uploads: HospitalDocumentsMap) => void;
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
          placeholder="List or select the types of cases you treat"
          defaultValue=""
          options={medicalCaseOptions}
        />
        <ModalFormField
          control="select"
          id={`${formId}-emergency-referrals`}
          name="emergencyReferrals"
          label="Emergency Referrals (Yes/No)"
          placeholder="Yes/No"
          defaultValue=""
          options={yesNoOptions}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ModalFormField
          control="input"
          id={`${formId}-license-step2`}
          name="licenseNumberConfirm"
          label="Registration / License Number"
          placeholder="Enter your valid registration or license number"
        />
        <ModalFormField
          control="select"
          id={`${formId}-departments`}
          name="departments"
          label="Available Departments"
          placeholder="Select all departments available in your facility"
          defaultValue=""
          options={departmentOptions}
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
            documents={REQUIRED_HOSPITAL_DOCUMENTS}
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
