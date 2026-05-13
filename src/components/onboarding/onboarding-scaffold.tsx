import type { ReactNode } from "react";
import { OnboardingPageFooter } from "@/components/onboarding/onboarding-page-footer";
import { OnboardingTopBar } from "@/components/onboarding/onboarding-top-bar";
import { SplitOnboardingShell } from "@/components/onboarding/split-onboarding-shell";
import { cn } from "@/lib/utils";

/** Tailwind max-width for main onboarding content (between header & footer). */
export const ONBOARDING_CONTENT_MAX_WIDTH_CLASS = "max-w-xl" as const;

export type OnboardingScaffoldProps = {
  hero: ReactNode;
  beforeTitle?: ReactNode;
  children: ReactNode;
  contentWidthClass?: string;
};

export function OnboardingScaffold({
  hero,
  beforeTitle,
  children,
  contentWidthClass = ONBOARDING_CONTENT_MAX_WIDTH_CLASS,
}: OnboardingScaffoldProps) {
  return (
    <SplitOnboardingShell hero={hero}>
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="w-full shrink-0 border-b border-border">
          <div className="px-5 pb-6 pt-8 sm:px-10 lg:px-14">
            <OnboardingTopBar />
          </div>
        </header>
        <div
          className={cn(
            "no-scrollbar mx-auto min-h-0 w-full flex-1 overflow-y-auto overscroll-y-contain px-5 pb-8 pt-8 sm:px-10 lg:px-14",
            contentWidthClass
          )}
        >
          <div className="flex min-h-full flex-col gap-8">
            {beforeTitle}
            {children}
          </div>
        </div>
        <footer className="w-full shrink-0 border-t border-border">
          <div className="px-5 pb-8 pt-6 sm:px-10 sm:pb-10 lg:px-14 lg:pb-12">
            <OnboardingPageFooter />
          </div>
        </footer>
      </div>
    </SplitOnboardingShell>
  );
}
