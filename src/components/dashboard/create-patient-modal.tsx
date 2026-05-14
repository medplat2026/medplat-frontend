"use client";

import { useId, useRef, useState, type RefObject } from "react";
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
  const formId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function resetCreateFlow() {
    setOpen(false);
    setStep(1);
  }

  function handleOpenChange(next: boolean) {
    setOpen(next);
    if (!next) setStep(1);
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
        size="2xl"
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
            const fd = new FormData(e.currentTarget);
            const fullName = String(fd.get("fullName") ?? "");
            setSuccessPatientFirstName(firstNameFromFullName(fullName));
            resetCreateFlow();
            setSuccessOpen(true);
          }}
        >
          <div hidden={step !== 1}>
            <StepOneFields formId={formId} />
          </div>
          <div hidden={step !== 2}>
            <StepTwoFields formId={formId} fileInputRef={fileInputRef} />
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
          type="text"
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

function StepTwoFields({ formId, fileInputRef }: { formId: string; fileInputRef: RefObject<HTMLInputElement | null> }) {
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
            <ChevronDownSummary />
          </span>
        </summary>
        <div className="border-t border-border px-4 pb-4 pt-3">
          <div className="grid gap-4 md:grid-cols-2">
            <DocumentUploadBox fileInputId={fileInputId} fileInputRef={fileInputRef} />
            <DocumentChecklist />
          </div>
        </div>
      </details>
    </div>
  );
}

function DocumentUploadBox({
  fileInputId,
  fileInputRef,
}: {
  fileInputId: string;
  fileInputRef: RefObject<HTMLInputElement | null>;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-input-border bg-muted/40 px-4 py-8 text-center">
      <UploadIcon className="mb-3 text-onboarding-blue" />
      <p className="text-sm font-semibold text-foreground">Upload medical documents</p>
      <p className="mt-1 text-xs text-muted-foreground">PDF, JPG, PNG up to 10MB each</p>
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        multiple
        className="sr-only"
        id={fileInputId}
        name="medicalDocuments"
      />
      <label htmlFor={fileInputId} className="mt-4 inline-block">
        <span className="inline-flex cursor-pointer rounded-xl bg-onboarding-blue px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-onboarding-blue-hover">
          Choose Files
        </span>
      </label>
    </div>
  );
}

function DocumentChecklist() {
  const items = [
    { label: "Doctor's report", done: true },
    { label: "Hospital bill / estimate", done: false },
    { label: "Valid ID card", done: false },
  ] as const;

  return (
    <ul className="space-y-3 rounded-xl border border-input-border bg-white p-4">
      {items.map((item) => (
        <li key={item.label} className="flex items-center gap-3 text-sm text-foreground">
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold",
              item.done
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-[#e8ecf1] bg-white text-muted-foreground/35",
            )}
            aria-hidden
          >
            ✓
          </span>
          {item.label}
        </li>
      ))}
    </ul>
  );
}

function UploadIcon({ className }: { className?: string }) {
  return (
    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <path
        d="M12 4v12m0 0 3.5-3.5M12 16 8.5 12.5M4 17h16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChevronDownSummary() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}
