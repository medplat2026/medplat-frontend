import type {
  DonorImpactTier,
  DonorRecentDonation,
} from "@/types/donor-case-overview";

/** Mock case shown on donor Case overview (`/donor/dashboard`). Replace with API data later. */
export const MOCK_DONOR_CASE_OVERVIEW = {
  fundTitle: "Sarah Johnson's Medical Fund",
  headerWelcome: "Welcome,",
  tagline: "Help save a life today",
  patient: {
    name: "Sarah Johnson",
    ageLabel: "34 years old",
    condition: "Cardiac Surgery",
    verified: true as const,
  },
  recentDonations: [
    { donorLabel: "Anonymous", timeAgo: "2 hours ago", amountLabel: "$50K" },
    { donorLabel: "Adebayo O.", timeAgo: "5 hours ago", amountLabel: "$25K" },
    { donorLabel: "Chioma N.", timeAgo: "1 day ago", amountLabel: "$10K" },
  ] satisfies DonorRecentDonation[],
  trending: {
    title: "Trending Case",
    description:
      "This case is gaining momentum with increased donations in the last 24 hours",
  },
  funding: {
    title: "Sarah Funding Progress",
    raisedDisplay: "$4,250,000",
    goalDisplay: "Of $8.5M",
    percentLabel: "50% target reached",
    percent: 50,
    donorCount: 127,
    daysLeft: 12,
  },
  summaryShort:
    "Sarah is a 34-year-old mother of two who urgently needs cardiac surgery. Her family has exhausted their savings on preliminary care and can no longer cover the full cost of the procedure.",
  tabs: {
    aboutCase:
      "Sarah has been diagnosed with a severe heart condition that requires immediate surgical intervention. Without timely surgery, her condition will continue to deteriorate. As the primary caregiver for her two young children, getting back to full health is critical for her family's stability. Her medical team has confirmed that she is a strong candidate for the procedure once funding is secured.",
    hospitalInfo:
      "Sarah is receiving care under a verified hospital partner on MedPlat. The facility is equipped for cardiac surgery and has provided a detailed treatment plan and cost estimate for her procedure and recovery.",
    update:
      "Latest update: Sarah has completed pre-operative assessments. The care team is standing by to schedule surgery as soon as the fundraising target is within reach.",
  },
  impactTiers: [
    {
      amountFigure: "10,000",
      description: "Covers 1 day of post-surgery medication",
      tone: "blue",
    },
    {
      amountFigure: "20,000",
      description: "Covers critical lab test and imaging",
      tone: "yellow",
      emphasized: true,
    },
    {
      amountFigure: "50,000",
      description: "Covers 2 days of hospital care",
      tone: "green",
    },
  ] satisfies DonorImpactTier[],
  trustBullets: [
    "100% goes to medical treatment",
    "Verified hospital and patient",
    "Secure payment processing",
  ],
} as const;
