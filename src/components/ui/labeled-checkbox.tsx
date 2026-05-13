import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type LabeledCheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "id"> & {
  id: string;
  label: string;
};

export function LabeledCheckbox({ id, label, className, ...props }: LabeledCheckboxProps) {
  return (
    <label
      htmlFor={id}
      className={cn("inline-flex cursor-pointer items-center gap-2 text-sm text-foreground", className)}
    >
      <input
        id={id}
        type="checkbox"
        className="size-4 rounded border-input-border text-onboarding-teal-dark accent-onboarding-teal-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-onboarding-blue/30"
        {...props}
      />
      <span>{label}</span>
    </label>
  );
}
