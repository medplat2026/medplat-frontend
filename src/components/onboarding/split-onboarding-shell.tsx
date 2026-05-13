import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type SplitOnboardingShellProps = {
  hero: ReactNode;
  children: ReactNode;
  className?: string;
};

export function SplitOnboardingShell({ hero, children, className }: SplitOnboardingShellProps) {
  return (
    <div className={cn("min-h-screen bg-white", className)}>
      <div className="mx-auto flex min-h-screen w-full max-w-[1440px] flex-col lg:h-svh lg:max-h-svh lg:min-h-0 lg:flex-row lg:overflow-hidden">
        <section
          className="relative w-full shrink-0 lg:h-full lg:min-h-0 lg:w-[42%] lg:max-w-none"
          aria-label="Brand visuals"
        >
          <div className="sticky top-0 flex min-h-[240px] lg:h-full lg:min-h-0">{hero}</div>
        </section>
        <section className="flex min-h-0 w-full flex-1 flex-col bg-white lg:h-full lg:min-h-0 lg:w-[58%] lg:overflow-hidden">
          {/* On lg+, column height matches the viewport row so header/footer stay fixed while form scrolls. */}
          <div className="flex min-h-0 flex-1 flex-col">{children}</div>
        </section>
      </div>
    </div>
  );
}
