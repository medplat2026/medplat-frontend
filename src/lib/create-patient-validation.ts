const SIMPLE_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const URGENCY_LEVELS = new Set(["low", "medium", "high", "critical"]);
const CONTACT_METHODS = new Set(["phone", "email", "whatsapp"]);

const MAX_FULL_NAME = 255;
const MAX_PHONE = 20;
const MAX_SUPPORT = 255;
const MAX_HOSPITAL = 255;

export const CREATE_PATIENT_DOCUMENT_ERROR_KEY = "_documents" as const;

/**
 * Step 1 — required fields match API (`full_name`, `phone_number`, `email`, `treatment_description`).
 * Used for both "Save as draft" and "Continue" so we do not send invalid payloads.
 */
export function validateCreatePatientStep1(formData: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const fullName = String(formData.get("fullName") ?? "").trim();
  if (!fullName) {
    errors.fullName = "Please enter the patient's full name.";
  } else if (fullName.length > MAX_FULL_NAME) {
    errors.fullName = `Full name must be at most ${MAX_FULL_NAME} characters.`;
  }

  const phone = String(formData.get("phone") ?? "").trim();
  if (!phone) {
    errors.phone = "Please enter a phone number.";
  } else if (phone.length > MAX_PHONE) {
    errors.phone = `Phone number must be at most ${MAX_PHONE} characters.`;
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) {
    errors.email = "Please enter an email address.";
  } else if (!SIMPLE_EMAIL.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  const treatment = String(formData.get("treatmentDescription") ?? "").trim();
  if (!treatment) {
    errors.treatmentDescription = "Please describe the treatment needed.";
  }

  const supportFor = String(formData.get("supportFor") ?? "").trim();
  if (supportFor.length > MAX_SUPPORT) {
    errors.supportFor = `This field must be at most ${MAX_SUPPORT} characters.`;
  }

  const hospital = String(formData.get("hospital") ?? "").trim();
  if (hospital.length > MAX_HOSPITAL) {
    errors.hospital = `This field must be at most ${MAX_HOSPITAL} characters.`;
  }

  return errors;
}

function parseNonNegativeNumber(raw: string): number | null {
  const t = raw.trim();
  if (t === "") return null;
  const n = Number.parseFloat(t);
  if (!Number.isFinite(n) || n < 0) return null;
  return n;
}

/** Step 2 — save draft: only reject clearly invalid numbers or invalid enum values. */
export function validateCreatePatientStep2Draft(formData: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  const estimatedRaw = String(formData.get("estimated_cost") ?? "");
  if (estimatedRaw.trim() !== "" && parseNonNegativeNumber(estimatedRaw) === null) {
    errors.estimated_cost = "Enter a valid estimated cost (0 or greater).";
  }

  const paidRaw = String(formData.get("amount_already_paid") ?? "");
  if (paidRaw.trim() !== "" && parseNonNegativeNumber(paidRaw) === null) {
    errors.amount_already_paid = "Enter a valid amount (0 or greater).";
  }

  const urgency = String(formData.get("urgency_level") ?? "").trim();
  if (urgency !== "" && !URGENCY_LEVELS.has(urgency)) {
    errors.urgency_level = "Please select a valid urgency level.";
  }

  const contact = String(formData.get("preferred_contact_method") ?? "").trim();
  if (contact !== "" && !CONTACT_METHODS.has(contact)) {
    errors.preferred_contact_method = "Please select a valid contact method.";
  }

  return errors;
}

/** Step 2 — final submit: required fields and documents. */
export function validateCreatePatientStep2Submit(
  formData: FormData,
  documentsComplete: boolean,
): Record<string, string> {
  const errors: Record<string, string> = { ...validateCreatePatientStep2Draft(formData) };

  const urgency = String(formData.get("urgency_level") ?? "").trim();
  if (!urgency) {
    errors.urgency_level = "Please select an urgency level.";
  } else if (!URGENCY_LEVELS.has(urgency)) {
    errors.urgency_level = "Please select a valid urgency level.";
  }

  const estimatedRaw = String(formData.get("estimated_cost") ?? "").trim();
  if (!estimatedRaw) {
    errors.estimated_cost = "Please enter the estimated treatment cost.";
  } else if (parseNonNegativeNumber(estimatedRaw) === null) {
    errors.estimated_cost = "Enter a valid estimated cost (0 or greater).";
  }

  const paidRaw = String(formData.get("amount_already_paid") ?? "").trim();
  if (paidRaw !== "" && parseNonNegativeNumber(paidRaw) === null) {
    errors.amount_already_paid = "Enter a valid amount already paid (0 or greater).";
  }

  const contact = String(formData.get("preferred_contact_method") ?? "").trim();
  if (contact !== "" && !CONTACT_METHODS.has(contact)) {
    errors.preferred_contact_method = "Please select a valid contact method.";
  }

  if (!documentsComplete) {
    errors[CREATE_PATIENT_DOCUMENT_ERROR_KEY] = "Please upload all required documents before submitting.";
  }

  return errors;
}

export function firstFieldErrorMessage(errors: Record<string, string>): string | null {
  const values = Object.values(errors).filter(Boolean);
  return values.length ? values[0] : null;
}
