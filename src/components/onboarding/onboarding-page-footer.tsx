import Link from "next/link";
import { ONBOARDING_COPY } from "@/constants/onboarding";
import { cn } from "@/lib/utils";

export function OnboardingPageFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "flex w-full min-w-0 flex-col gap-3 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <p>{ONBOARDING_COPY.copyright}</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link className="hover:text-foreground" href="#">
          Privacy Policy
        </Link>
        <Link className="hover:text-foreground" href="#">
          Terms &amp; Condition
        </Link>
      </div>
    </footer>
  );
}
