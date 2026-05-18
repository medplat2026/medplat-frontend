export const ROUTES = {
  home: "/",
  login: "/login",
  dashboard: "/dashboard",
  patients: "/patients",
  cases: "/cases",
  update: "/update",
  patientDetail: (id: string) => `/patients/${id}` as const,
  patient: "/patient",
  onboarding: {
    hospital: {
      email: "/onboarding/hospital/email",
      verify: "/onboarding/hospital/verify",
      contact: "/onboarding/hospital/contact",
      password: "/onboarding/hospital/password",
    },
    patient: {
      email: "/onboarding/patient/email",
      verify: "/onboarding/patient/verify",
      details: "/onboarding/patient/details",
      identification: "/onboarding/patient/identification",
      password: "/onboarding/patient/password",
    },
  },
} as const;
