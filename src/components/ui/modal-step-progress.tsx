import { cn } from "@/lib/utils";

export type ModalStepProgressProps = {
  /** 1-based index of the active step (earlier steps appear filled). */
  currentStep: number;
  totalSteps: number;
  className?: string;
};

/**
 * Segmented bar for multi-step modals (equal-width segments with a small gap).
 */
export function ModalStepProgress({ currentStep, totalSteps, className }: ModalStepProgressProps) {
  const safeTotal = Math.max(1, totalSteps);
  const active = Math.min(Math.max(1, currentStep), safeTotal);

  return (
    <div
      className={cn("flex w-full gap-1.5", className)}
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={safeTotal}
      aria-valuenow={active}
      aria-label={`Step ${active} of ${safeTotal}`}
    >
      {Array.from({ length: safeTotal }, (_, i) => {
        const stepIndex = i + 1;
        const filled = stepIndex <= active;
        return (
          <div
            key={stepIndex}
            className={cn(
              "h-1.5 min-h-0 flex-1 rounded-full transition-colors",
              filled ? "bg-onboarding-blue" : "bg-[#e8ecf1]",
            )}
          />
        );
      })}
    </div>
  );
}
