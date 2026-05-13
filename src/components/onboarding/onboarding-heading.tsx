import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type OnboardingHeadingProps = {
  kicker?: string;
  title: string;
  subtitle?: ReactNode;
  align?: "start" | "center";
  className?: string;
};

export function OnboardingHeading({
  kicker,
  title,
  subtitle,
  align = "center",
  className,
}: OnboardingHeadingProps) {
  return (
    <div
      className={cn(
        "space-y-2",
        align === "center" && "w-full text-center",
        align === "start" && "w-full text-left",
        className
      )}
    >
      {kicker ? (
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground sm:text-[11px]">
          {kicker}
        </p>
      ) : null}
      <h1 className="text-lg font-semibold uppercase leading-[1.15] text-foreground sm:text-2xl">
        {title}
      </h1>
      {subtitle ? (
        <div className="text-xs font-normal leading-relaxed text-muted-foreground sm:text-sm">
          {subtitle}
        </div>
      ) : null}
    </div>
  );
}
