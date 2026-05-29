import type {
  PatientActiveCase,
  PatientCaseDetail,
  PatientFundingBubbleStats,
  PatientFundingDonation,
  PatientFundingOverview,
  PatientMyCasesSection,
  PatientNotification,
} from "@/types/patient-dashboard";

export const MOCK_PATIENT_NAME = "Sarah Johnson";

export const MOCK_PATIENT_ACTIVE_CASE: PatientActiveCase = {
  id: "case-001",
  title: "Cardiac Surgery",
  hospital: "Lagos University Teaching Hospital",
  status: "Active",
  progressPercent: 50,
  raised: 12_000_000,
  target: 25_000_000,
  daysLeft: 74,
  shareUrl: "https://medplat.com/donate/case-001",
};

export const MOCK_PATIENT_NOTIFICATIONS: PatientNotification[] = [
  {
    id: "n1",
    type: "donation",
    message: "₦50,000 donated to your health",
    timestamp: "2 hours ago",
  },
  {
    id: "n2",
    type: "approval",
    message: "Your case has been approved",
    timestamp: "1 day ago",
  },
  {
    id: "n3",
    type: "donation",
    message: "₦30,000 donated to your health",
    timestamp: "3 days ago",
  },
];

export const MOCK_PATIENT_FUNDING: PatientFundingOverview = {
  centerAmount: 12_000_000,
  centerLabel: "Raised",
  raised: 12_000_000,
  remaining: 13_000_000,
  donorCount: 47,
};

export const MOCK_PATIENT_FUNDING_BUBBLE_STATS: PatientFundingBubbleStats = {
  largestAmount: 40_000,
  averageAmount: 10_000,
  recentAmount: 5_000,
};

export const MOCK_PATIENT_FUNDING_DONATIONS: PatientFundingDonation[] = [
  {
    id: "d1",
    donorDisplayName: "Anonymous",
    dateLabel: "April 16, 2026",
    amount: 500_000,
    message: "Wishing you a speedy recovery!",
  },
  {
    id: "d2",
    donorDisplayName: "Anonymous",
    dateLabel: "April 15, 2026",
    amount: 250_000,
  },
  {
    id: "d3",
    donorDisplayName: "Anonymous",
    dateLabel: "April 14, 2026",
    amount: 75_000,
    message: "Stay strong.",
  },
  {
    id: "d4",
    donorDisplayName: "Anonymous",
    dateLabel: "April 12, 2026",
    amount: 1_200_000,
  },
  {
    id: "d5",
    donorDisplayName: "Anonymous",
    dateLabel: "April 10, 2026",
    amount: 30_000,
    message: "Praying for you.",
  },
];

const DEFAULT_CASE_DOCUMENTS: PatientCaseDetail["documents"] = [
  { name: "Medical_Report_2026.pdf" },
  { name: "Lab_Results.pdf" },
  { name: "Doctor_Recommendations.pdf" },
];

const MOCK_PATIENT_CASE_DETAILS: Record<string, PatientCaseDetail> = {
  "case-001": {
    id: "case-001",
    title: "Cardiac Surgery",
    hospital: "Lagos University Teaching Hospital",
    status: "Active",
    story:
      "I am a 45-year-old father of three who has been diagnosed with a severe cardiac condition requiring immediate surgery. The procedure is crucial for my survival and will enable me to continue supporting my family. The estimated cost of the surgery, including pre-operative tests, the procedure itself, and post-operative care, amounts to ₦25 million. I have exhausted my savings and insurance coverage, and I humbly appeal for your support to help me undergo this life-saving treatment.",
    treatmentPlan:
      "The treatment involves a comprehensive cardiac surgery procedure, including coronary artery bypass grafting (CABG). The surgery is scheduled to take place at Lagos University Teaching Hospital under the care of leading cardiologists. Post-operative care will include a 2-week hospital stay, followed by 3 months of monitored recovery and rehabilitation.",
    documents: [...DEFAULT_CASE_DOCUMENTS],
    raised: 12_000_000,
    target: 25_000_000,
    daysLeft: 74,
    progressPercent: 50,
  },
  "case-002": {
    id: "case-002",
    title: "Kidney Transplant",
    hospital: "National Hospital Abuja",
    status: "Completed",
    story:
      "I was diagnosed with end-stage kidney disease and required a transplant to restore quality of life. With the support of donors and the care team at National Hospital Abuja, I was able to complete the procedure successfully. I am deeply grateful for everyone who contributed to my recovery journey.",
    treatmentPlan:
      "The care plan included donor matching, transplant surgery, immunosuppressive therapy, and regular follow-up visits to monitor kidney function and overall health during recovery.",
    documents: [...DEFAULT_CASE_DOCUMENTS],
    raised: 22_000_000,
    target: 22_000_000,
    daysLeft: 0,
  },
  "case-003": {
    id: "case-003",
    title: "Bone marrow Transplant",
    hospital: "National Hospital Abuja",
    status: "Completed",
    story:
      "I underwent a bone marrow transplant to treat a serious blood disorder. The process involved conditioning therapy, transplant, and a structured recovery period under specialist supervision.",
    treatmentPlan:
      "Treatment included preparative chemotherapy, stem cell infusion, infection prevention protocols, and outpatient monitoring until full engraftment and stable blood counts were achieved.",
    documents: [...DEFAULT_CASE_DOCUMENTS],
    raised: 7_800_000,
    target: 7_800_000,
    daysLeft: 0,
  },
};

export function getMockPatientCaseDetail(
  id: string,
): PatientCaseDetail | undefined {
  return MOCK_PATIENT_CASE_DETAILS[id];
}

export const MOCK_PATIENT_MY_CASES_SECTIONS: PatientMyCasesSection[] = [
  {
    id: "recent",
    title: "Recent Cases",
    cases: [
      {
        id: "case-001",
        title: "Cardiac Surgery",
        hospital: "Lagos University Teaching Hospital",
        status: "Active",
        raised: 12_000_000,
        target: 25_000_000,
        daysLeft: 74,
        progressPercent: 50,
      },
    ],
  },
  {
    id: "previous-1",
    title: "Previous Case",
    dateLine: "September 23, 2024",
    cases: [
      {
        id: "case-002",
        title: "Kidney Transplant",
        hospital: "National Hospital Abuja",
        status: "Completed",
        raised: 22_000_000,
        target: 22_000_000,
        daysLeft: 0,
      },
    ],
  },
  {
    id: "previous-2",
    title: "Previous Case",
    dateLine: "September 23, 2024",
    cases: [
      {
        id: "case-003",
        title: "Bone marrow Transplant",
        hospital: "National Hospital Abuja",
        status: "Completed",
        raised: 7_800_000,
        target: 7_800_000,
        daysLeft: 0,
      },
    ],
  },
];
