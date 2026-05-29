import { isAxiosError } from "axios";
import { handleAPIError } from "@/lib/api-utils";
import { axiosInstance } from "@/lib/axios";
import type { APIError } from "@/types/api";
import type { LoginResponse } from "@/types/auth";

function extractRecord(raw: unknown): Record<string, unknown> {
  if (!raw || typeof raw !== "object") return {};
  const body = raw as Record<string, unknown>;
  const inner = body.data;
  if (inner && typeof inner === "object" && !Array.isArray(inner)) {
    return inner as Record<string, unknown>;
  }
  return body;
}

function parseUid(obj: Record<string, unknown>): number | null {
  const uidRaw = obj.uid;
  if (typeof uidRaw === "number" && Number.isFinite(uidRaw)) return uidRaw;
  if (typeof uidRaw === "string" && /^\d+$/.test(uidRaw)) return Number(uidRaw);
  return null;
}

export type HospitalEmailInitiateResult = {
  message?: string;
  uid: number;
};

export type PatientEmailInitiateResult = HospitalEmailInitiateResult;

/** POST /auth/register_patient/ — complete patient signup after email verification. */
export async function registerPatient(payload: {
  uid: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  password: string;
  password_confirm: string;
}) {
  try {
    const { data } = await axiosInstance.post("/auth/register_patient/", {
      uid: payload.uid,
      first_name: payload.first_name.trim(),
      last_name: payload.last_name.trim(),
      phone_number: payload.phone_number.trim(),
      password: payload.password,
      password_confirm: payload.password_confirm,
    });
    return extractRecord(data);
  } catch (error) {
    if (isAxiosError(error)) throw handleAPIError(error);
    throw error as APIError;
  }
}

export const authService = {
  /** POST /auth/patient_initiate/ — send verification email for patient signup. */
  async patientInitiateEmail(payload: {
    email: string;
  }): Promise<PatientEmailInitiateResult> {
    try {
      const { data } = await axiosInstance.post("/auth/patient_initiate/", {
        email: payload.email.trim(),
      });
      const obj = extractRecord(data);
      const uid = parseUid(obj);
      if (uid == null) {
        const err: APIError = {
          message: "Could not start email verification. Please try again.",
        };
        throw err;
      }
      const message = obj.message;
      return {
        uid,
        message: typeof message === "string" ? message : undefined,
      };
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** POST /auth/hospital_initiate/ — send verification email for hospital signup. */
  async hospitalInitiateEmail(payload: {
    email: string;
  }): Promise<HospitalEmailInitiateResult> {
    try {
      const { data } = await axiosInstance.post("/auth/hospital_initiate/", {
        email: payload.email.trim(),
      });
      const obj = extractRecord(data);
      const uid = parseUid(obj);
      if (uid == null) {
        const err: APIError = {
          message: "Could not start email verification. Please try again.",
        };
        throw err;
      }
      const message = obj.message;
      return {
        uid,
        message: typeof message === "string" ? message : undefined,
      };
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /**
   * POST /auth/verify_email/ — confirm OTP after patient or hospital initiate.
   * Payload: `{ uid, token }` (token = OTP from email).
   */
  async verifyEmail(payload: { uid: number; token: string }) {
    try {
      const { data } = await axiosInstance.post("/auth/verify_email/", {
        uid: payload.uid,
        token: payload.token.trim(),
      });
      return extractRecord(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** POST /auth/register_hospital/ — complete hospital signup after email verification. */
  async registerHospital(payload: {
    uid: number;
    hospital_name: string;
    phone_number: string;
    password: string;
    password_confirm: string;
  }) {
    try {
      const { data } = await axiosInstance.post("/auth/register_hospital/", {
        uid: payload.uid,
        hospital_name: payload.hospital_name.trim(),
        phone_number: payload.phone_number.trim(),
        password: payload.password,
        password_confirm: payload.password_confirm,
      });
      return extractRecord(data);
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  /** POST /auth/login/ — sign in with verified account (`UserLogin`: email + password). */
  async login(payload: {
    email: string;
    password: string;
  }): Promise<LoginResponse> {
    try {
      const { data } = await axiosInstance.post("/auth/login/", {
        email: payload.email.trim(),
        password: payload.password,
      });
      return extractRecord(data) as LoginResponse;
    } catch (error) {
      if (isAxiosError(error)) throw handleAPIError(error);
      throw error as APIError;
    }
  },

  registerPatient,
};
