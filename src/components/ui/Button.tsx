import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type ButtonVariant = "brand" | "neutral" | "outline" | "ghost" | "subtle";

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const variantClasses: Record<ButtonVariant, string> = {
  brand:
    "bg-onboarding-blue text-white hover:bg-onboarding-blue-hover shadow-sm border border-transparent disabled:hover:bg-onboarding-blue",
  neutral: "bg-muted text-foreground hover:bg-grid border border-border",
  outline:
    "bg-white text-foreground border border-input-border hover:bg-muted shadow-sm",
  ghost: "bg-transparent text-foreground hover:bg-muted border border-transparent",
  subtle:
    "border border-input-border bg-[#f4f7fb] text-[#6b7280] shadow-none hover:bg-[#eef2f8] disabled:hover:bg-[#f4f7fb]",
};

export function Button({
  variant = "brand",
  fullWidth,
  className,
  type = "button",
  disabled,
  ...props
}: ButtonProps) {
  const useMutedDisabled = variant === "subtle";

  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors disabled:pointer-events-none",
        !useMutedDisabled && "disabled:opacity-45",
        useMutedDisabled && "disabled:opacity-100",
        variantClasses[variant],
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}
