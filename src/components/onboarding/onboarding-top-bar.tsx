import Link from "next/link";
import { ONBOARDING_COPY } from "@/constants/onboarding";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

export function OnboardingTopBar({ className }: { className?: string }) {
  return (
    <header className={cn("flex w-full min-w-0 items-center justify-between gap-4", className)}>
      <Link href="/" className="text-lg font-bold tracking-tight text-foreground">
        {ONBOARDING_COPY.brandName}
      </Link>
      <Button type="button" variant="outline" className="rounded-full px-4 py-2 text-xs font-semibold">
        <span className="inline-flex size-5 items-center justify-center rounded-full border border-input-border text-[11px] font-bold">
          ?
        </span>
        Need help?
      </Button>
    </header>
  );
}
