"use client";

import { useId, useState } from "react";
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
import { cn } from "@/lib/utils";

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

const treatmentStartOptions = [
  { value: "0", label: "0 days" },
  { value: "7", label: "7 days" },
  { value: "14", label: "14 days" },
  { value: "30", label: "30 days" },
  { value: "60", label: "60 days" },
];

const REQUIRED_CASE_DOCUMENTS = [
  { id: "doctors_report", label: "Doctor's report", fieldName: "documentDoctorsReport" },
  { id: "cost_estimate", label: "Cost estimate/ invoice", fieldName: "documentCostEstimate" },
  { id: "admission_letter", label: "Admission letter", fieldName: "documentAdmissionLetter" },
] as const;

type CaseDocumentId = (typeof REQUIRED_CASE_DOCUMENTS)[number]["id"];

type CaseDocumentsMap = DocumentUploadsMap<CaseDocumentId>;

const EMPTY_CASE_DOCUMENTS = createEmptyDocumentUploads(REQUIRED_CASE_DOCUMENTS);

type CreateCaseModalProps = {
  triggerClassName?: string;
  triggerVariant?: ButtonVariant;
};

export function CreateCaseModal({ triggerClassName, triggerVariant = "outline" }: CreateCaseModalProps) {
  const [open, setOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);
  const [caseDocuments, setCaseDocuments] = useState<CaseDocumentsMap>(EMPTY_CASE_DOCUMENTS);
  const [documentsValidationError, setDocumentsValidationError] = useState(false);
  const formId = useId();
  const fileInputId = `${formId}-case-docs`;

  function resetDocuments() {
    setCaseDocuments(EMPTY_CASE_DOCUMENTS);
    setDocumentsValidationError(false);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) resetDocuments();
  }

  return (
    <>
      <Button
        type="button"
        variant={triggerVariant}
        className={cn(
          triggerVariant === "outline" && "rounded-xl border-onboarding-blue px-5 text-onboarding-blue",
          triggerClassName,
        )}
        onClick={() => setOpen(true)}
      >
        + Create Case
      </Button>

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
              <Button type="button" variant="outline" className="rounded-xl border-input-border px-5">
                Save as draft
              </Button>
              <Button type="submit" form={formId} className="rounded-xl px-6">
                Submit Case
              </Button>
            </div>
          </div>
        }
      >
        <form
          id={formId}
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!allDocumentsUploaded(REQUIRED_CASE_DOCUMENTS, caseDocuments)) {
              setDocumentsValidationError(true);
              return;
            }
            setDocumentsValidationError(false);
            const fd = new FormData(e.currentTarget);
            for (const doc of REQUIRED_CASE_DOCUMENTS) {
              const file = caseDocuments[doc.id];
              if (file) fd.append(doc.fieldName, file);
            }
            setOpen(false);
            resetDocuments();
            setSuccessOpen(true);
          }}
        >
          <ModalFormField
            control="textarea"
            id={`${formId}-diagnosis`}
            name="diagnosisTreatmentPlan"
            label="Diagnosis and Treatment Plan"
            placeholder="Provide detailed diagnosis and treatment required..."
            rows={4}
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <ModalFormField
              control="select"
              id={`${formId}-urgency`}
              name="urgencyLevel"
              label="Urgency level"
              placeholder="Select urgency level"
              defaultValue=""
              options={urgencyOptions}
            />
            <ModalFormField
              control="select"
              id={`${formId}-treatment-start`}
              name="expectedTreatmentStart"
              label="Expected treatment start date"
              placeholder="0 days"
              defaultValue=""
              requiredIndicator
              options={treatmentStartOptions}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ModalFormField
              control="input"
              id={`${formId}-total-cost`}
              name="totalEstimatedCost"
              label="Total Estimated Cost"
              placeholder="# 0.00"
            />
            <ModalFormField
              control="input"
              id={`${formId}-amount-paid`}
              name="amountAlreadyPaid"
              label="Amount already paid"
              placeholder="# 0.00"
            />
            <ModalFormField
              control="input"
              id={`${formId}-amount-needed`}
              name="amountNeeded"
              label="Amount Needed"
              placeholder="# 0.00"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <ModalFormField
              control="input"
              id={`${formId}-family-name`}
              name="familyContactName"
              label="Family contact name"
              placeholder="Enter name"
              autoComplete="name"
            />
            <ModalFormField
              control="input"
              id={`${formId}-family-phone`}
              name="familyContactPhone"
              type="tel"
              label="Family contact no."
              placeholder="(+234)-5433-3472-7365"
              autoComplete="tel"
            />
            <ModalFormField
              control="select"
              id={`${formId}-fundraising-approved`}
              name="fundraisingApproved"
              label="Patient/family approved fundraising?"
              placeholder="Yes/No"
              defaultValue=""
              options={yesNoOptions}
            />
          </div>

          <ModalFormField
            control="textarea"
            id={`${formId}-patient-story`}
            name="patientStory"
            label="Patient Story"
            placeholder="Briefly describe patient story (250 words max)..."
            rows={5}
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
                documents={REQUIRED_CASE_DOCUMENTS}
                fileInputId={fileInputId}
                uploads={caseDocuments}
                onUploadsChange={(next) => {
                  setCaseDocuments(next);
                  if (allDocumentsUploaded(REQUIRED_CASE_DOCUMENTS, next)) {
                    setDocumentsValidationError(false);
                  }
                }}
                showError={documentsValidationError}
                completeMessage="You can submit the case."
              />
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
