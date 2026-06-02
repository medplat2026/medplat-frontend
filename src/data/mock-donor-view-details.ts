import type { DonorDiagnosisRow, DonorTimelineStep } from "@/types/donor-view-details";

/** Mock content for donor View details (`/donor/dashboard/view-details`). */
export const MOCK_DONOR_VIEW_DETAILS = {
  header: {
    title: "Sarah Johnson's Story",
    subtitle: "Fighting for Life: A Mother's Journey to Cardiac Recovery",
  },
  patientStory: {
    sectionTitle: "The Patient's Story",
    body: `Sarah Johnson is a 34-year-old mother of two—ages 7 and 5—and an elementary school teacher who has always put her family and students first. Over the past six months, what began as occasional chest pains and shortness of breath escalated into a critical cardiac condition requiring immediate surgical intervention.

After countless tests and consultations, Sarah was diagnosed with severe mitral valve regurgitation. Her medical team has made it clear: without timely surgery, her condition is life-threatening. Yet the cost of the procedure and post-operative care is far beyond what her family can afford. They have already exhausted their savings on diagnostics and specialist visits and now face an impossible choice between securing life-saving treatment and keeping their household financially stable.

This campaign exists to give Sarah a fair chance at recovery—so she can return to her children, her classroom, and the life she is fighting so hard to protect.`,
  },
  diagnosisRows: [
    {
      kind: "diagnosis" as const,
      label: "Primary Diagnosis",
      body: "Severe Mitral Valve Regurgitation requiring immediate surgical repair",
    },
    {
      kind: "procedure" as const,
      label: "Recommended Procedure",
      body: "Minimally invasive mitral valve repair surgery with post-operative care",
    },
    {
      kind: "prognosis" as const,
      label: "Prognosis",
      body: "Excellent recovery expected with surgery. Without intervention, condition is life-threatening.",
    },
  ] satisfies DonorDiagnosisRow[],
  hospital: {
    name: "Lagos University Teaching Hospital",
    verified: true as const,
    location: "Idi-Araba, Lagos, Nigeria",
    description:
      "LUTH is a premier teaching hospital with dedicated cardiac facilities and experienced surgical teams. Donations to this campaign are directed to a verified hospital account for Sarah's care, with transparent reporting so supporters can see how funds are applied.",
  },
  timeline: [
    {
      status: "completed" as const,
      statusLabel: "Completed",
      title: "Initial Diagnosis & Assessment",
      description: "Comprehensive cardiac evaluation completed",
    },
    {
      status: "in_progress" as const,
      statusLabel: "In Progress",
      title: "Funding & Pre-operative Preparation",
      description: "50% funded - surgery scheduled upon reaching goal",
      stepNumber: "1",
    },
    {
      status: "upcoming" as const,
      statusLabel: "Upcoming",
      title: "Surgical Procedure & Recovery",
      description:
        "Surgery expected duration: 4-6 hours and then 7-10 days hospital stay, followed by home recovery",
      stepNumber: "2",
    },
  ] satisfies DonorTimelineStep[],
} as const;
