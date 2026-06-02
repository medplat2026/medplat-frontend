export type DonorRecentDonation = {
  donorLabel: string;
  timeAgo: string;
  amountLabel: string;
};

export type DonorImpactTier = {
  /** Numeric amount only (e.g. "20,000") — shown beside Naira icon when emphasized */
  amountFigure: string;
  description: string;
  tone: "blue" | "yellow" | "green";
  /** Middle tier — orange Naira chip + bold amount on one row (Figma) */
  emphasized?: boolean;
};
