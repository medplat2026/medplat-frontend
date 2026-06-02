/** Mock recipient + copy for `/donor/dashboard/make-donations`. Replace with API later. */
export const MOCK_DONOR_MAKE_DONATION = {
  patient: {
    displayName: "Sarah Johnson",
    firstName: "Sarah",
    supportHeadline: "Support Sarah Johnson",
    condition: "Cardiac Surgery",
    /** Square hero photo — Unsplash allowed in `next.config.ts`. */
    photoUrl:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  },
  quickAmounts: [50_000, 100_000, 150_000, 500_000] as const,
  impact: {
    title: "Your Impact",
    body:
      "Every donation brings Sarah closer to her life-saving surgery. Your generosity will help a mother return to her children and continue making a difference in her community.",
  },
  messagePlaceholder: "Write a message of support for Sarah...",
  termsLine: "By proceeding, you agree to our terms and conditions",
} as const;
