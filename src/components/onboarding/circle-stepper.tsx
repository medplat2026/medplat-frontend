import { Fragment } from "react";
import { cn } from "@/lib/utils";

export type CircleStepperProps = {
  totalSteps: number;
  currentStep: number;
  className?: string;
};

export function CircleStepper({ totalSteps, currentStep, className }: CircleStepperProps) {
  return (
    <div
      className={cn("flex w-full items-center gap-2 sm:gap-3", className)}
      role="group"
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    >
      {Array.from({ length: totalSteps }).map((_, index) => {
        const state =
          index === currentStep ? "current" : index < currentStep ? "complete" : "upcoming";
        return (
          <Fragment key={index}>
            <div
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors",
                state === "current" &&
                  "border-onboarding-blue bg-white text-onboarding-blue shadow-[0_0_0_4px_rgba(0,123,255,0.12)]",
                state === "complete" && "border-onboarding-blue bg-onboarding-blue text-white",
                state === "upcoming" && "border-input-border bg-white text-muted-foreground"
              )}
              aria-current={state === "current" ? "step" : undefined}
            >
              {index + 1}
            </div>
            {index < totalSteps - 1 ? (
              <div
                className={cn("h-px min-w-[12px] flex-1 rounded-full", index < currentStep ? "bg-onboarding-blue" : "bg-border")}
                aria-hidden
              />
            ) : null}
          </Fragment>
        );
      })}
    </div>
  );
}
