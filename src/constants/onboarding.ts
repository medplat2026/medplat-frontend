export const ONBOARDING_COPY = {
  brandName: "MedPlat",
  tagline: "Connecting care to compassion",
  copyright: "© 2026 MedPlat. All rights reserved.",
} as const;

/** Hero art for split onboarding (`public/onboarding/images/`; mirrored in `src/app/onboarding/images/`). */
export const ONBOARDING_HERO_SLIDES = [
  "/onboarding/images/onboarding1.svg",
  "/onboarding/images/onboarding2.svg",
  "/onboarding/images/onboarding3.svg",
] as const;

/** Pick slide `0 | 1 | 2` → onboarding1–3.svg */
export function onboardingHeroSlide(index: number): (typeof ONBOARDING_HERO_SLIDES)[number] {
  const i = Math.max(0, Math.min(ONBOARDING_HERO_SLIDES.length - 1, Math.floor(index)));
  return ONBOARDING_HERO_SLIDES[i];
}

/** @deprecated Prefer `onboardingHeroSlide` + local SVGs; kept for any legacy references. */
export const HERO_IMAGE = {
  careTeam:
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1600&q=80",
  surgeryTech:
    "https://images.unsplash.com/photo-1516549655169-83429d14fe20?auto=format&fit=crop&w=1600&q=80",
} as const;

/** Patient step 2 — means of identification */
export const PATIENT_IDENTIFICATION_DOC_OPTIONS: Array<{
  value: string;
  label: string;
}> = [
  { value: "nin", label: "National Identification Number (NIN)" },
  { value: "passport", label: "International passport" },
  { value: "drivers", label: "Driver's licence" },
  { value: "voters", label: "Voter's card" },
];

/** Session keys for hospital signup after email verification. */
export const HOSPITAL_ONBOARDING_STORAGE = {
  emailVerified: "hospital-onboarding-email-verified",
  verifiedEmail: "hospital-onboarding-verified-email",
  registrationDraft: "hospital-registration-draft",
} as const;

/** Post-onboarding hospital profile completion (dashboard modals). */
export const HOSPITAL_PROFILE_STORAGE = {
  needsCompletion: "hospital-profile-needs-completion",
  complete: "hospital-profile-complete",
} as const;

/** Session keys for patient signup after email verification. */
export const PATIENT_ONBOARDING_STORAGE = {
  emailVerified: "patient-onboarding-email-verified",
  verifiedEmail: "patient-onboarding-verified-email",
  registrationDraft: "patient-registration-draft",
} as const;
