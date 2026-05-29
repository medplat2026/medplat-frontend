export const ROUTES = {
  home: "/",
  login: "/login",
  hospital: {
    dashboard: "/hospital/dashboard",
    patients: "/hospital/patients",
    cases: "/hospital/cases",
    update: "/hospital/update",
    patientDetail: (id: string) => `/hospital/patients/${id}` as const,
    notifications: "/hospital/dashboard/notifications",
    settings: "/hospital/dashboard/settings",
  },
  patient: {
    dashboard: "/patient/dashboard",
    cases: "/patient/dashboard/cases",
    caseDetail: (id: string) => `/patient/dashboard/cases/${id}` as const,
    funding: "/patient/dashboard/funding",
    notifications: "/patient/dashboard/notifications",
    settings: "/patient/dashboard/settings",
  },
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
