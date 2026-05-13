"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

function scorePasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export type PasswordStrengthMeterProps = {
  password: string;
  className?: string;
};

/** Hint + 4-bar meter; place below password fields (not between them). */
export function PasswordStrengthMeter({ password, className }: PasswordStrengthMeterProps) {
  const strength = useMemo(() => scorePasswordStrength(password), [password]);

  return (
    <div className={cn("space-y-2", className)}>
      <p className="text-xs text-muted-foreground">
        Must contain 1 uppercase letter, 1 number, min. 8 characters.
      </p>
      <div className="flex gap-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 flex-1 rounded-full bg-muted transition-colors",
              strength > i && "bg-onboarding-teal"
            )}
          />
        ))}
      </div>
    </div>
  );
}
