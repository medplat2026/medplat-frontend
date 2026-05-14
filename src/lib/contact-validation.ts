const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidEmail(value: string): boolean {
  return EMAIL_REGEX.test(value.trim());
}

/** Returns 10-digit Nigerian local number without leading 0, or null if invalid. */
export function normalizeNigerianPhone(value: string): string | null {
  const digits = value.replace(/\D/g, "");
  const withoutLeadingZero = digits.startsWith("0") ? digits.slice(1) : digits;
  if (!/^[7-9]\d{9}$/.test(withoutLeadingZero)) return null;
  return withoutLeadingZero;
}
