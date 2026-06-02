import { isAxiosError } from "axios";
import { handleAPIError } from "@/lib/api-utils";
import { axiosInstance } from "@/lib/axios";
import type { APIError } from "@/types/api";
import type { HospitalDashboardData } from "@/types/hospital-dashboard";
import type {
  HospitalCreatePatientStep1Payload,
  HospitalCreatePatientStep1Result,
} from "@/types/hospital-create-patient";
import type {
  HospitalBasicInfoPayload,
  HospitalOnboardingChoices,
  OnboardingChoice,
} from "@/types/hospital";
import type {
  HospitalMyPatientApiRow,
  HospitalMyPatientsParams,
  HospitalMyPatientsResponse,
} from "@/types/hospital-my-patients";
import type {
  HospitalMyPatientDetailParams,
  HospitalMyPatientDetailResponse,
  HospitalMyPatientLinkedCaseApi,
} from "@/types/hospital-my-patient-detail";
import type { CaseRecord, CaseStatus } from "@/types/case";
import type {
  LinkedCase,
  PatientDetail,
  PatientRecord,
  PatientStatus,
  PatientUrgency,
} from "@/types/patient";

function extractRecord(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const body = raw as Record<string, unknown>;
  const inner = body.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return body;
}

function numFromUnknown(value: unknown, fallback = 0): number {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return fallback;
}

function parseHospitalDashboard(raw: unknown): HospitalDashboardData {
  const obj = extractRecord(raw);
  const funded = extractRecord(obj.funded_overview);
  const quick = extractRecord(obj.quick_actions);
  const recentRaw = obj.recent_cases;
  const recent_cases: HospitalDashboardData["recent_cases"] = Array.isArray(
    recentRaw,
  )
    ? recentRaw.filter(
        (x): x is Record<string, unknown> =>
          x !== null && typeof x === "object" && !Array.isArray(x),
      )
    : [];

  return {
    total_patients: numFromUnknown(obj.total_patients),
    total_cases: numFromUnknown(obj.total_cases),
    active_cases: numFromUnknown(obj.active_cases),
    pending_cases: numFromUnknown(obj.pending_cases),
    funded_overview: {
      total_funded: numFromUnknown(funded.total_funded),
      funds_raised: numFromUnknown(funded.funds_raised),
      funds_remaining: numFromUnknown(funded.funds_remaining),
    },
    recent_cases,
    quick_actions: {
      awaiting_submission: numFromUnknown(quick.awaiting_submission),
      missing_documents: numFromUnknown(quick.missing_documents),
      pending_approval: numFromUnknown(quick.pending_approval),
    },
  };
}

/** React Query key for GET `/hospitals/dashboard/`. */
export const hospitalDashboardQueryKey = ["hospital", "dashboard"] as const;

/** React Query key prefix for GET `/hospitals/my-patients/`. */
export const hospitalMyPatientsQueryKeyRoot = [
  "hospital",
  "my-patients",
] as const;

/** React Query key prefix for GET `/hospitals/medical-cases/`. */
export const hospitalMedicalCasesQueryKeyRoot = [
  "hospital",
  "medical-cases",
] as const;

/**
 * Default page size for `/hospitals/my-patients/` pagination.
 * Should match the backend `PageNumberPagination.page_size`.
 */
export const HOSPITAL_MY_PATIENTS_PAGE_SIZE = 10;

/**
 * Default page size for `/hospitals/medical-cases/` pagination.
 * Should match the backend `PageNumberPagination.page_size`.
 */
export const HOSPITAL_MEDICAL_CASES_PAGE_SIZE = 10;

function normalizeMyPatientUrgency(level: string): PatientUrgency {
  const u = level.trim().toLowerCase();
  if (u === "high" || u === "critical") return "High";
  if (u === "medium") return "Medium";
  return "Low";
}

function normalizeMyPatientStatus(s: string): PatientStatus {
  const t = s.trim().toLowerCase();
  if (t === "approved") return "Approved";
  if (t === "completed") return "Completed";
  if (t === "submitted") return "Submitted";
  if (t === "draft") return "Draft";
  return "Submitted";
}

function parseMyPatientRow(raw: unknown): HospitalMyPatientApiRow | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const patient_id = numFromUnknown(row.patient_id, NaN);
  if (!Number.isFinite(patient_id) || patient_id <= 0) return null;
  const patient_name = row.patient_name;
  const email = row.email;
  const case_ref = row.case_ref;
  const case_type = row.case_type;
  if (typeof patient_name !== "string" || typeof email !== "string")
    return null;
  if (typeof case_ref !== "string" || typeof case_type !== "string")
    return null;
  const urgency_level =
    typeof row.urgency_level === "string" ? row.urgency_level : "";
  const status = typeof row.status === "string" ? row.status : "";
  return {
    patient_id,
    patient_name,
    email,
    case_ref,
    case_type,
    amount_needed: numFromUnknown(row.amount_needed),
    urgency_level,
    status,
  };
}

function parseMyPatientsResponse(raw: unknown): HospitalMyPatientsResponse {
  const obj = extractRecord(raw);
  const count = numFromUnknown(obj.count);
  const resultsRaw = obj.results;
  const results: HospitalMyPatientApiRow[] = Array.isArray(resultsRaw)
    ? resultsRaw
        .map(parseMyPatientRow)
        .filter((x): x is HospitalMyPatientApiRow => x !== null)
    : [];
  return { count, results };
}

export function mapHospitalMyPatientRowToPatientRecord(
  row: HospitalMyPatientApiRow,
): PatientRecord {
  return {
    id: String(row.patient_id),
    caseRef: row.case_ref,
    name: row.patient_name,
    caseType: row.case_type,
    email: row.email,
    amountNeeded: row.amount_needed,
    urgency: normalizeMyPatientUrgency(row.urgency_level),
    status: normalizeMyPatientStatus(row.status),
  };
}

function normalizeMedicalCaseStatus(s: string): CaseStatus {
  const t = s.trim().toLowerCase();
  if (t === "approved") return "Approved";
  if (t === "completed") return "Completed";
  if (t === "submitted") return "Submitted";
  if (t === "draft") return "Draft";
  if (t === "funded") return "Funded";
  return "Submitted";
}

/** Map a `/hospitals/medical-cases/` row (same shape as my-patients) to `CaseRecord` for UI cards. */
export function mapMedicalCaseRowToCaseRecord(
  row: HospitalMyPatientApiRow,
): CaseRecord {
  return {
    id: row.case_ref,
    patientId: String(row.patient_id),
    patientName: row.patient_name,
    caseType: row.case_type,
    totalCost: row.amount_needed,
    progressPercent: null,
    status: normalizeMedicalCaseStatus(row.status),
  };
}

/** React Query key prefix for GET `/hospitals/my-patients/{id}/`. */
export const hospitalMyPatientDetailQueryKeyRoot = [
  "hospital",
  "my-patient",
] as const;

/**
 * Page size for linked cases on the patient detail request (if the API paginates them).
 * Align with backend when `linked_cases_count` is returned.
 */
export const HOSPITAL_MY_PATIENT_LINKED_CASES_PAGE_SIZE = 10;

export function hospitalMyPatientDetailQueryKey(
  patientId: number,
  params: { search: string; ordering: string; page: number },
) {
  return [...hospitalMyPatientDetailQueryKeyRoot, patientId, params] as const;
}

function optionalIsoString(value: unknown): string | null {
  if (value === null || value === undefined) return null;
  if (typeof value === "string" && value.trim() !== "") return value.trim();
  return null;
}

function formatDisplayDateFromIso(iso: string): string {
  const t = Date.parse(iso);
  if (!Number.isFinite(t)) return iso;
  return new Date(t).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTreatmentTimelineText(
  timeline: HospitalMyPatientDetailResponse["treatment_timeline"],
): string {
  if (!timeline?.start_date) return "Not specified";
  const start = formatDisplayDateFromIso(timeline.start_date);
  if (timeline.end_date) {
    const end = formatDisplayDateFromIso(timeline.end_date);
    const days =
      timeline.days_total != null && Number.isFinite(timeline.days_total)
        ? ` · ${timeline.days_total} day${timeline.days_total === 1 ? "" : "s"}`
        : "";
    return `${start} – ${end}${days}`;
  }
  return `From ${start} (end date TBD)`;
}

function parseLinkedCaseRow(
  raw: unknown,
): HospitalMyPatientLinkedCaseApi | null {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const row = raw as Record<string, unknown>;
  const case_ref = typeof row.case_ref === "string" ? row.case_ref.trim() : "";
  const title = typeof row.title === "string" ? row.title.trim() : "";
  if (!case_ref || !title) return null;
  const created_at = typeof row.created_at === "string" ? row.created_at : "";
  return {
    case_ref,
    title,
    estimated_cost: numFromUnknown(row.estimated_cost),
    status: typeof row.status === "string" ? row.status : "",
    created_at,
  };
}

function parseMyPatientDetailResponse(
  raw: unknown,
): HospitalMyPatientDetailResponse {
  const obj = extractRecord(raw);
  const patient_id = numFromUnknown(obj.patient_id, NaN);
  if (!Number.isFinite(patient_id) || patient_id <= 0) {
    const err: APIError = { message: "Invalid patient data from the server." };
    throw err;
  }
  const patient_name =
    typeof obj.patient_name === "string" ? obj.patient_name : "";
  const email = typeof obj.email === "string" ? obj.email : "";
  const patient_since =
    typeof obj.patient_since === "string" ? obj.patient_since : "";
  const linkedRaw = obj.linked_cases;
  const linked_cases: HospitalMyPatientLinkedCaseApi[] = Array.isArray(
    linkedRaw,
  )
    ? linkedRaw
        .map(parseLinkedCaseRow)
        .filter((x): x is HospitalMyPatientLinkedCaseApi => x !== null)
    : [];

  const timelineRaw = obj.treatment_timeline;
  const treatment_timeline =
    timelineRaw &&
    typeof timelineRaw === "object" &&
    !Array.isArray(timelineRaw)
      ? {
          start_date: optionalIsoString(
            (timelineRaw as Record<string, unknown>).start_date,
          ),
          end_date: optionalIsoString(
            (timelineRaw as Record<string, unknown>).end_date,
          ),
          days_total: (() => {
            const d = (timelineRaw as Record<string, unknown>).days_total;
            return typeof d === "number" && Number.isFinite(d) ? d : null;
          })(),
        }
      : null;

  const linkedCountRaw =
    obj.linked_cases_count ??
    obj.linked_cases_total ??
    obj.cases_count ??
    obj.count;
  const linked_cases_count =
    linkedCountRaw !== undefined && linkedCountRaw !== null
      ? numFromUnknown(linkedCountRaw, NaN)
      : undefined;
  const linked_cases_countFinal =
    linked_cases_count !== undefined &&
    Number.isFinite(linked_cases_count) &&
    linked_cases_count >= 0
      ? linked_cases_count
      : undefined;

  return {
    patient_id,
    patient_name,
    email,
    patient_since,
    latest_diagnosis: optionalIsoString(obj.latest_diagnosis),
    funding_progress: numFromUnknown(obj.funding_progress),
    treatment_timeline,
    patient_id_url: optionalIsoString(obj.patient_id_url),
    doctor_report_url: optionalIsoString(obj.doctor_report_url),
    linked_cases,
    ...(linked_cases_countFinal !== undefined
      ? { linked_cases_count: linked_cases_countFinal }
      : {}),
  };
}

function mapLinkedCaseApiToLinkedCase(
  row: HospitalMyPatientLinkedCaseApi,
): LinkedCase {
  return {
    id: row.case_ref,
    title: row.title,
    date: row.created_at ? formatDisplayDateFromIso(row.created_at) : "—",
    amount: row.estimated_cost,
    status: normalizeMyPatientStatus(row.status),
  };
}

export function mapHospitalMyPatientDetailToPatientDetail(
  api: HospitalMyPatientDetailResponse,
): PatientDetail {
  const primary = api.linked_cases[0];
  return {
    id: String(api.patient_id),
    name: api.patient_name,
    email: api.email,
    caseType: primary?.title ?? "—",
    amountNeeded: primary?.estimated_cost ?? 0,
    urgency: "Medium" as PatientUrgency,
    status: primary ? normalizeMyPatientStatus(primary.status) : "Submitted",
    patientSince: api.patient_since
      ? formatDisplayDateFromIso(api.patient_since)
      : "—",
    diagnosis: api.latest_diagnosis?.trim()
      ? api.latest_diagnosis.trim()
      : "Not specified",
    fundingProgress: `${Math.round(api.funding_progress)}%`,
    treatmentTimeline: formatTreatmentTimelineText(api.treatment_timeline),
    linkedCases: api.linked_cases.map(mapLinkedCaseApiToLinkedCase),
    avatarUrl: api.patient_id_url,
    patientIdDocumentUrl: api.patient_id_url,
    doctorReportUrl: api.doctor_report_url,
  };
}

function parseChoiceList(raw: unknown): OnboardingChoice[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const row = item as Record<string, unknown>;
      const value = row.value;
      const label = row.label;
      if (typeof value !== "string" || typeof label !== "string") return null;
      return { value, label };
    })
    .filter((x): x is OnboardingChoice => x !== null);
}

function parseOnboardingChoices(raw: unknown): HospitalOnboardingChoices {
  const obj = extractRecord(raw);
  return {
    hospital_types: parseChoiceList(obj.hospital_types),
    available_departments: parseChoiceList(obj.available_departments),
    medical_case_types: parseChoiceList(obj.medical_case_types),
    document_types: parseChoiceList(obj.document_types),
  };
}

function optionalString(value: string): string | null {
  const trimmed = value.trim();
  return trimmed === "" ? null : trimmed;
}

function selectionToSlugList(value: string): string[] {
  const v = value.trim();
  return v ? [v] : [];
}

/**
 * Step 1 — PATCH `/hospitals/my-hospital/` (`CompleteHospitalRegistrationModal` field names).
 */
export function buildHospitalBasicInfoFromFormData(
  formData: FormData,
  is_draft: boolean,
): HospitalBasicInfoPayload {
  const t = (name: string) => String(formData.get(name) ?? "").trim();

  const name = t("hospitalName");
  const address = t("streetAddress");
  const city = t("city");

  if (!is_draft) {
    if (!name) {
      const err: APIError = { message: "Please enter your hospital name." };
      throw err;
    }
    if (!address) {
      const err: APIError = { message: "Please enter your street address." };
      throw err;
    }
    if (!city) {
      const err: APIError = { message: "Please enter your city." };
      throw err;
    }
    const facilityType = t("facilityType");
    if (!facilityType) {
      const err: APIError = { message: "Please select the type of facility." };
      throw err;
    }
    const licenseNumber = t("licenseNumber");
    if (!licenseNumber) {
      const err: APIError = { message: "Please enter your registration or license number." };
      throw err;
    }
    if (!t("contactPerson")) {
      const err: APIError = { message: "Please enter the contact person name." };
      throw err;
    }
    if (!t("contactEmail")) {
      const err: APIError = { message: "Please enter a contact email." };
      throw err;
    }
    if (!t("contactPhone")) {
      const err: APIError = { message: "Please enter a contact phone number." };
      throw err;
    }
    const stateVal = t("state");
    if (!stateVal) {
      const err: APIError = { message: "Please enter the state." };
      throw err;
    }
    const postalVal = t("postalCode");
    if (!postalVal) {
      const err: APIError = { message: "Please enter the postal code." };
      throw err;
    }
  }

  return {
    name,
    hospital_type: optionalString(t("facilityType")),
    license_number: optionalString(t("licenseNumber")),
    contact_person_name: optionalString(t("contactPerson")),
    email: optionalString(t("contactEmail")),
    phone: optionalString(t("contactPhone")),
    address,
    city,
    state: optionalString(t("state")),
    postal_code: optionalString(t("postalCode")),
    is_draft,
  };
}

/**
 * Step 2 — POST `/hospitals/my-hospital/service-capacity/` as multipart form data.
 */
export function buildHospitalServiceCapacityFormData(
  formData: FormData,
  documents: Record<string, File>,
  documentTypeValues: string[],
): FormData {
  const t = (name: string) => String(formData.get(name) ?? "").trim();

  const medicalCases = selectionToSlugList(t("medicalCases"));
  const departments = selectionToSlugList(t("departments"));
  if (medicalCases.length === 0) {
    const err: APIError = { message: "Please select a medical case type." };
    throw err;
  }
  if (departments.length === 0) {
    const err: APIError = { message: "Please select an available department." };
    throw err;
  }

  const emergencyRaw = t("emergencyReferrals");
  if (emergencyRaw !== "yes" && emergencyRaw !== "no") {
    const err: APIError = {
      message: "Please select Yes or No for emergency referrals.",
    };
    throw err;
  }

  const fd = new FormData();
  for (const slug of medicalCases) {
    fd.append("medical_case_types", slug);
  }
  for (const slug of departments) {
    fd.append("available_departments", slug);
  }
  fd.append("emergency_referrals", emergencyRaw === "yes" ? "true" : "false");

  const bedsRaw = t("bedCapacity");
  if (bedsRaw === "") {
    const err: APIError = { message: "Please enter bed capacity." };
    throw err;
  }
  const n = Number.parseInt(bedsRaw, 10);
  if (!Number.isFinite(n) || n < 0) {
    const err: APIError = {
      message: "Please enter a valid bed capacity (0 or greater).",
    };
    throw err;
  }
  fd.append("total_beds", String(n));

  for (const docType of documentTypeValues) {
    const file = documents[docType];
    if (!file) {
      const err: APIError = {
        message: "Please upload all required documents.",
      };
      throw err;
    }
    fd.append(docType, file);
  }

  return fd;
}

/**
 * Create patient step 1 — PATCH `/hospitals/create-patient/step-1/`.
 * `submit_case` is always false; submission is done on step 2.
 */
export function buildHospitalCreatePatientStep1Payload(
  formData: FormData,
  strictRequired: boolean,
): HospitalCreatePatientStep1Payload {
  const t = (name: string) => String(formData.get(name) ?? "").trim();

  const full_name = t("fullName");
  const phone_number = t("phone");
  const email = t("email");
  const treatment_description = t("treatmentDescription");

  if (strictRequired) {
    if (!full_name) {
      const err: APIError = {
        message: "Please enter the patient's full name.",
      };
      throw err;
    }
    if (!phone_number) {
      const err: APIError = { message: "Please enter a phone number." };
      throw err;
    }
    if (!email) {
      const err: APIError = { message: "Please enter an email address." };
      throw err;
    }
    if (!treatment_description) {
      const err: APIError = {
        message: "Please describe the treatment needed.",
      };
      throw err;
    }
  }

  const urgentRaw = t("urgent");
  const is_urgent = urgentRaw === "yes";

  return {
    submit_case: false,
    full_name,
    date_of_birth: optionalString(t("dateOfBirth")),
    gender: optionalString(t("gender")),
    phone_number,
    email,
    home_address: optionalString(t("homeAddress")),
    support_for: optionalString(t("supportFor")),
    hospital_receiving_treatment: optionalString(t("hospital")),
    is_urgent,
    treatment_description,
  };
}

function parseCreatePatientStep1Response(
  raw: unknown,
): HospitalCreatePatientStep1Result {
  const obj = extractRecord(raw);
  const pid = obj.patient_id ?? obj.patientId;
  const mid = obj.medical_case_id ?? obj.medicalCaseId;
  const patient_id = numFromUnknown(pid, NaN);
  if (!Number.isFinite(patient_id) || patient_id <= 0) {
    const err: APIError = {
      message:
        "Could not read patient id from the server response. Please try again.",
    };
    throw err;
  }
  const medicalCaseNum = numFromUnknown(mid, NaN);
  const medical_case_id =
    mid === null || mid === undefined || String(mid).trim() === ""
      ? null
      : Number.isFinite(medicalCaseNum) && medicalCaseNum > 0
        ? medicalCaseNum
        : null;
  return { patient_id, medical_case_id };
}

/**
 * Create patient step 2 — POST `/hospitals/create-patient/step-2/` as multipart form data.
 */
export function buildHospitalCreatePatientStep2FormData(
  formData: FormData,
  patient_id: number,
  medical_case_id: number | null,
  submit_case: boolean,
  files: {
    doctors_report: File | null;
    hospital_bill_estimate: File | null;
    valid_id_card: File | null;
  },
  strictRequired: boolean,
): FormData {
  const t = (name: string) => String(formData.get(name) ?? "").trim();

  const urgency_level = t("urgency_level");
  const estimatedRaw = t("estimated_cost");
  const amountPaidRaw = t("amount_already_paid");
  const visibility = t("visibility") || "public";
  const expected_start_date = optionalString(t("expected_start_date"));
  const fundraisingRaw = t("patient_approved_fundraising");
  const preferred_contact_method = t("preferred_contact_method") || "phone";
  const family_contact_name = t("family_contact_name");
  const family_contact_phone = t("family_contact_phone");
  const patient_story = t("patient_story");

  if (strictRequired) {
    if (!urgency_level) {
      const err: APIError = { message: "Please select an urgency level." };
      throw err;
    }
    if (!estimatedRaw) {
      const err: APIError = { message: "Please enter the estimated cost." };
      throw err;
    }
    const est = Number.parseFloat(estimatedRaw);
    if (!Number.isFinite(est) || est < 0) {
      const err: APIError = { message: "Please enter a valid estimated cost." };
      throw err;
    }
    if (
      !files.doctors_report ||
      !files.hospital_bill_estimate ||
      !files.valid_id_card
    ) {
      const err: APIError = {
        message: "Please upload all required documents before submitting.",
      };
      throw err;
    }
  }

  const fd = new FormData();
  fd.append("patient_id", String(patient_id));
  if (medical_case_id != null && medical_case_id > 0) {
    fd.append("medical_case_id", String(medical_case_id));
  }
  fd.append("submit_case", submit_case ? "true" : "false");
  fd.append("urgency_level", urgency_level || "low");
  const estimated_cost = Number.parseFloat(estimatedRaw || "0");
  fd.append(
    "estimated_cost",
    String(Number.isFinite(estimated_cost) ? estimated_cost : 0),
  );
  const amount_already_paid = Number.parseFloat(amountPaidRaw || "0");
  fd.append(
    "amount_already_paid",
    String(Number.isFinite(amount_already_paid) ? amount_already_paid : 0),
  );
  fd.append("visibility", visibility === "private" ? "private" : "public");
  if (expected_start_date)
    fd.append("expected_start_date", expected_start_date);
  fd.append(
    "patient_approved_fundraising",
    fundraisingRaw === "yes" ? "true" : "false",
  );
  fd.append("preferred_contact_method", preferred_contact_method);
  if (family_contact_name)
    fd.append("family_contact_name", family_contact_name);
  if (family_contact_phone)
    fd.append("family_contact_phone", family_contact_phone);
  if (patient_story) fd.append("patient_story", patient_story);

  if (files.doctors_report) fd.append("doctors_report", files.doctors_report);
  if (files.hospital_bill_estimate)
    fd.append("hospital_bill_estimate", files.hospital_bill_estimate);
  if (files.valid_id_card) fd.append("valid_id_card", files.valid_id_card);

  return fd;
}

const MY_HOSPITAL_BASE = "/hospitals/my-hospital";
const CREATE_PATIENT_STEP1 = "/hospitals/create-patient/step-1/";
const CREATE_PATIENT_STEP2 = "/hospitals/create-patient/step-2/";
const CREATE_PATIENT_MEDICAL_CASE = "/hospitals/create-patient/medical-case/";

export const hospitalService = {
  /** GET `/hospitals/dashboard/` — hospital home metrics. */
  async getDashboard(): Promise<HospitalDashboardData> {
    try {
      const { data } = await axiosInstance.get("/hospitals/dashboard/");
      return parseHospitalDashboard(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** GET `/hospitals/my-patients/` — paginated list (search, ordering, page). */
  async getMyPatients(
    params: HospitalMyPatientsParams = {},
  ): Promise<HospitalMyPatientsResponse> {
    try {
      const page =
        typeof params.page === "number" && params.page > 0 ? params.page : 1;
      const query: Record<string, string | number> = { page };
      const search =
        typeof params.search === "string" ? params.search.trim() : "";
      if (search) query.search = search;
      const ordering =
        typeof params.ordering === "string" ? params.ordering.trim() : "";
      if (ordering) query.ordering = ordering;
      const { data } = await axiosInstance.get("/hospitals/my-patients/", {
        params: query,
      });
      return parseMyPatientsResponse(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /**
   * GET `/hospitals/my-cases/` — paginated list (search, ordering, page).
   * `ordering`: ascending = field name (`created_at`); descending = minus prefix (`-created_at`).
   */
  async getMedicalCases(
    params: HospitalMyPatientsParams = {},
  ): Promise<HospitalMyPatientsResponse> {
    try {
      const page =
        typeof params.page === "number" && params.page > 0 ? params.page : 1;
      const query: Record<string, string | number> = { page };
      const search =
        typeof params.search === "string" ? params.search.trim() : "";
      if (search) query.search = search;
      const ordering =
        typeof params.ordering === "string" ? params.ordering.trim() : "";
      if (ordering) query.ordering = ordering;
      const { data } = await axiosInstance.get("/hospitals/my-cases/", {
        params: query,
      });
      return parseMyPatientsResponse(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** GET `/hospitals/my-patients/{patient_id}/` — profile, documents, linked cases (search, ordering, page). */
  async getMyPatientDetail(
    patientId: number,
    params: HospitalMyPatientDetailParams = {},
  ): Promise<HospitalMyPatientDetailResponse> {
    try {
      const page =
        typeof params.page === "number" && params.page > 0 ? params.page : 1;
      const query: Record<string, string | number> = { page };
      const search =
        typeof params.search === "string" ? params.search.trim() : "";
      if (search) query.search = search;
      const ordering =
        typeof params.ordering === "string" ? params.ordering.trim() : "";
      if (ordering) query.ordering = ordering;
      const { data } = await axiosInstance.get(
        `/hospitals/my-patients/${patientId}/`,
        {
          params: query,
        },
      );
      return parseMyPatientDetailResponse(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** GET `/hospitals/onboarding-choices/` */
  async getOnboardingChoices(): Promise<HospitalOnboardingChoices> {
    try {
      const { data } = await axiosInstance.get(
        "/hospitals/onboarding-choices/",
      );
      return parseOnboardingChoices(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** PATCH `/hospitals/my-hospital/` — step 1 basic info (continue or save draft). */
  async patchMyHospitalBasicInfo(payload: HospitalBasicInfoPayload) {
    try {
      const { data } = await axiosInstance.put(
        `${MY_HOSPITAL_BASE}/`,
        payload,
      );
      return extractRecord(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** POST `/hospitals/my-hospital/service-capacity/` — step 2 multipart (capacity + documents). */
  async postMyHospitalServiceCapacity(formData: FormData) {
    try {
      const { data } = await axiosInstance.put(
        `${MY_HOSPITAL_BASE}/service-capacity/`,
        formData,
        { headers: { "Content-Type": false } },
      );
      return extractRecord(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** PATCH `/hospitals/create-patient/step-1/` — patient profile draft (submit_case always false). */
  async patchCreatePatientStep1(
    payload: HospitalCreatePatientStep1Payload,
  ): Promise<HospitalCreatePatientStep1Result> {
    try {
      const { data } = await axiosInstance.patch(CREATE_PATIENT_STEP1, payload);
      return parseCreatePatientStep1Response(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** POST `/hospitals/create-patient/step-2/` — funding case details and documents (multipart). */
  async postCreatePatientStep2(formData: FormData) {
    try {
      const { data } = await axiosInstance.post(
        CREATE_PATIENT_STEP2,
        formData,
        {
          headers: { "Content-Type": false },
        },
      );
      return extractRecord(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /**
   * PATCH `/hospitals/create-patient/medical-case/` — medical case for an existing patient (multipart).
   * Payload matches `buildHospitalCreatePatientStep2FormData` with `medical_case_id: null`.
   */
  async patchCreatePatientMedicalCase(formData: FormData) {
    try {
      const { data } = await axiosInstance.patch(
        CREATE_PATIENT_MEDICAL_CASE,
        formData,
        {
          headers: { "Content-Type": false },
        },
      );
      return extractRecord(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },
};
