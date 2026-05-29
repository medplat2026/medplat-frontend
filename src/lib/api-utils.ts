import type { APIError } from "@/types/api";

const BODY_KEYS_SKIP_FOR_FIELD_ERRORS = new Set([
  "message",
  "msg",
  "errors",
  "data",
  "success",
  "status",
  "code",
]);

function stringMessagesFromValue(value: unknown): string[] | null {
  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }
  if (!Array.isArray(value)) return null;
  const strings = value.filter(
    (v): v is string => typeof v === "string" && v.trim().length > 0,
  );
  return strings.length ? strings.map((s) => s.trim()) : null;
}

function titleCaseField(key: string): string {
  if (key === "non_field_errors") return "";
  const spaced = key.replace(/_/g, " ");
  return spaced.length ? spaced.charAt(0).toUpperCase() + spaced.slice(1) : key;
}

/**
 * Django / DRF-style JSON: `{ "detail": "..." }`, `{ "email": ["..."] }`, `{ "non_field_errors": ["..."] }`.
 */
function messageFromValidationBody(obj: Record<string, unknown>): string | null {
  const detail = obj.detail;
  if (typeof detail === "string" && detail.trim()) {
    return detail.trim();
  }
  if (Array.isArray(detail)) {
    const parts = detail.filter(
      (v): v is string => typeof v === "string" && v.trim().length > 0,
    );
    if (parts.length) return parts.join(" ");
  }

  const nfe = stringMessagesFromValue(obj.non_field_errors);
  if (nfe?.length) return nfe.join(" ");

  const fieldChunks: { label: string; text: string }[] = [];
  for (const [key, value] of Object.entries(obj)) {
    if (BODY_KEYS_SKIP_FOR_FIELD_ERRORS.has(key)) continue;
    const list = stringMessagesFromValue(value);
    if (!list?.length) continue;
    const label = titleCaseField(key);
    const text = list.join(" ");
    fieldChunks.push({ label, text });
  }
  if (fieldChunks.length === 0) return null;
  if (fieldChunks.length === 1) {
    return fieldChunks[0].text;
  }
  return fieldChunks.map((c) => (c.label ? `${c.label}: ${c.text}` : c.text)).join(" ");
}

export function handleAPIError(error: unknown): APIError {
  const err = error as {
    response?: { status?: number; data?: unknown };
    request?: unknown;
    message?: string;
  };

  if (err.response) {
    const { status, data } = err.response;
    const obj =
      data && typeof data === "object"
        ? (data as Record<string, unknown>)
        : null;

    if (obj && "message" in obj && typeof obj.message === "string") {
      return {
        message: obj.message,
        statusCode: status,
        errors: (obj.errors as Record<string, unknown>) ?? undefined,
      };
    }
    if (obj && "msg" in obj && typeof obj.msg === "string") {
      return {
        message: obj.msg,
        statusCode: status,
        errors: obj,
      };
    }
    if (obj && "error" in obj && typeof obj.error === "string" && obj.error.trim()) {
      return {
        message: obj.error.trim(),
        statusCode: status,
        errors: obj,
      };
    }

    const validationMessage = (() => {
      if (!obj) return null;
      const innerErrors = obj.errors;
      if (innerErrors && typeof innerErrors === "object" && !Array.isArray(innerErrors)) {
        const fromNested = messageFromValidationBody(innerErrors as Record<string, unknown>);
        if (fromNested) return fromNested;
      }
      return messageFromValidationBody(obj);
    })();
    if (validationMessage) {
      return {
        message: validationMessage,
        statusCode: status,
        errors: obj ?? undefined,
      };
    }

    return {
      message:
        status != null
          ? `Something went wrong (HTTP ${status}). Please try again.`
          : "Something went wrong. Please try again.",
      statusCode: status,
      errors: obj === null ? undefined : obj,
    };
  }

  if (err.request) {
    return {
      message: "Network error – unable to connect",
      errors: { network: "connection_failed" },
    };
  }

  return {
    message: err.message ?? "An unexpected error occurred",
    errors: { general: err.message ?? "unknown" },
  };
}
