import type { LinkedCase, PatientDetail, PatientRecord } from "@/types/patient";

export const MOCK_PATIENTS: PatientRecord[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    caseType: "Breast cancer",
    email: "sarah.j@gmail.com",
    amountNeeded: 250_000_000,
    urgency: "High",
    status: "Approved",
  },
  {
    id: "2",
    name: "Micheal Chan",
    caseType: "Kidney transplant",
    email: "micheal.chan@gmail.com",
    amountNeeded: 180_000_000,
    urgency: "High",
    status: "Completed",
  },
  {
    id: "3",
    name: "James Wilson",
    caseType: "Orthopedic Surgery",
    email: "james.wilson@gmail.com",
    amountNeeded: 5_000_000,
    urgency: "Medium",
    status: "Approved",
  },
  {
    id: "4",
    name: "Vincent Eme",
    caseType: "Kidney Surgery",
    email: "vincent.eme@gmail.com",
    amountNeeded: 15_000_000,
    urgency: "Medium",
    status: "Completed",
  },
  {
    id: "5",
    name: "Ada Okonkwo",
    caseType: "Cardiac Surgery",
    email: "ada.okonkwo@gmail.com",
    amountNeeded: 45_000_000,
    urgency: "High",
    status: "Approved",
  },
  {
    id: "6",
    name: "Emeka Nwosu",
    caseType: "Liver transplant",
    email: "emeka.nwosu@gmail.com",
    amountNeeded: 320_000_000,
    urgency: "High",
    status: "Submitted",
  },
  {
    id: "7",
    name: "Fatima Bello",
    caseType: "Spinal surgery",
    email: "fatima.bello@gmail.com",
    amountNeeded: 12_500_000,
    urgency: "Medium",
    status: "Approved",
  },
  {
    id: "8",
    name: "David Okafor",
    caseType: "Prostate cancer",
    email: "david.okafor@gmail.com",
    amountNeeded: 28_000_000,
    urgency: "Low",
    status: "Draft",
  },
  {
    id: "9",
    name: "Grace Adeyemi",
    caseType: "Hip replacement",
    email: "grace.adeyemi@gmail.com",
    amountNeeded: 8_500_000,
    urgency: "Medium",
    status: "Completed",
  },
  {
    id: "10",
    name: "Ibrahim Musa",
    caseType: "Brain tumor",
    email: "ibrahim.musa@gmail.com",
    amountNeeded: 95_000_000,
    urgency: "High",
    status: "Approved",
  },
  {
    id: "11",
    name: "Chioma Eze",
    caseType: "Cataract surgery",
    email: "chioma.eze@gmail.com",
    amountNeeded: 1_200_000,
    urgency: "Low",
    status: "Completed",
  },
];

const SARAH_LINKED_CASES: LinkedCase[] = [
  {
    id: "c1",
    title: "Cardiac Surgery",
    date: "April 1, 2026",
    amount: 25_000_000,
    status: "Approved",
  },
  {
    id: "c2",
    title: "Post-operative case",
    date: "June 1, 2023",
    amount: 25_000_000,
    status: "Submitted",
  },
  {
    id: "c3",
    title: "Physical therapy",
    date: "April 1, 2021",
    amount: 25_000_000,
    status: "Completed",
  },
];

const PATIENT_DETAIL_OVERRIDES: Record<string, Partial<PatientDetail>> = {
  "1": {
    patientSince: "March 15, 2026",
    diagnosis: "Breast Cancer",
    fundingProgress: "45% funded",
    treatmentTimeline: "46 days (1st May - 17th June 2026)",
    linkedCases: SARAH_LINKED_CASES,
  },
};

function defaultLinkedCases(patient: PatientRecord): LinkedCase[] {
  return [
    {
      id: `${patient.id}-case-1`,
      title: patient.caseType,
      date: "April 1, 2026",
      amount: patient.amountNeeded,
      status: patient.status,
    },
  ];
}

export function getPatientDetail(id: string): PatientDetail | undefined {
  const patient = MOCK_PATIENTS.find((p) => p.id === id);
  if (!patient) return undefined;

  const overrides = PATIENT_DETAIL_OVERRIDES[id];

  return {
    ...patient,
    patientSince: overrides?.patientSince ?? "January 10, 2026",
    diagnosis: overrides?.diagnosis ?? patient.caseType,
    fundingProgress: overrides?.fundingProgress ?? "30% funded",
    treatmentTimeline:
      overrides?.treatmentTimeline ?? "60 days (1st June - 31st July 2026)",
    linkedCases: overrides?.linkedCases ?? defaultLinkedCases(patient),
  };
}
