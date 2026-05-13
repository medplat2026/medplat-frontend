export const ROUTES = {
  home: "/",
  login: "/login",
  onboarding: {
    hospital: {
      email: "/onboarding/hospital/email",
      verify: "/onboarding/hospital/verify",
      contact: "/onboarding/hospital/contact",
      basics: "/onboarding/hospital/basics",
      validation: "/onboarding/hospital/validation",
      password: "/onboarding/hospital/password",
    },
    patient: {
      email: "/onboarding/patient/email",
      details: "/onboarding/patient/details",
      identification: "/onboarding/patient/identification",
      password: "/onboarding/patient/password",
    },
  },
} as const;
