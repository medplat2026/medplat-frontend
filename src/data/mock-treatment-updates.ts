import type { TreatmentUpdate } from "@/types/treatment-update";

export const MOCK_TREATMENT_UPDATES: TreatmentUpdate[] = [
  {
    id: "update-1",
    authorName: "Sarah Johnson",
    createdAt: "2026-04-12T14:39:00",
    body: "Patient is responding well to the initial treatment protocol. Vital signs are stable, and pain levels have decreased significantly. We will continue monitoring closely over the next 48 hours before adjusting medication dosage.",
    attachments: [{ id: "att-1", fileName: "Medical_Report_2026.pdf" }],
  },
  {
    id: "update-2",
    authorName: "Micheal Chen",
    createdAt: "2026-04-10T09:15:00",
    body: "Follow-up consultation completed. Patient reports improved mobility and reduced discomfort. Lab results indicate positive progress. Recommended continuing current physiotherapy schedule with weekly assessments.",
    attachments: [{ id: "att-2", fileName: "Medical_Report_2026.pdf" }],
  },
  {
    id: "update-3",
    authorName: "James Wilson",
    createdAt: "2026-04-08T16:22:00",
    body: "Pre-operative assessment completed. All clearance documents received from cardiology. Surgery scheduled for next week pending final anesthesia review.",
    attachments: [
      { id: "att-3", fileName: "Pre_Op_Assessment.pdf" },
      { id: "att-4", fileName: "Cardiology_Clearance.pdf" },
    ],
  },
  {
    id: "update-4",
    authorName: "Vincent Eme",
    createdAt: "2026-04-06T11:00:00",
    body: "Dialysis session completed without complications. Fluid balance within acceptable range. Patient educated on dietary restrictions for the upcoming week.",
  },
  {
    id: "update-5",
    authorName: "Sarah Johnson",
    createdAt: "2026-04-04T08:45:00",
    body: "Medication review conducted. Dosage adjusted based on latest blood work. Patient and family briefed on new administration schedule.",
    attachments: [{ id: "att-5", fileName: "Blood_Work_Results.pdf" }],
  },
  {
    id: "update-6",
    authorName: "Micheal Chen",
    createdAt: "2026-04-02T13:30:00",
    body: "Physical therapy session notes uploaded. Range of motion improved by 15% compared to baseline. Continue twice-weekly sessions.",
    attachments: [{ id: "att-6", fileName: "PT_Session_Notes.pdf" }],
  },
  {
    id: "update-7",
    authorName: "James Wilson",
    createdAt: "2026-03-30T10:10:00",
    body: "Overnight observation stable. No adverse reactions to new antibiotic course. Discharge planning discussion scheduled with care team.",
  },
  {
    id: "update-8",
    authorName: "Vincent Eme",
    createdAt: "2026-03-28T15:55:00",
    body: "Nutrition consult completed. Meal plan updated to support recovery. Patient agrees to follow-up in two weeks.",
    attachments: [{ id: "att-7", fileName: "Nutrition_Plan.pdf" }],
  },
];
