"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { ONBOARDING_OTP_DIGITS } from "@/constants/onboarding";
import { cn } from "@/lib/utils";

export type OtpInputGroupProps = {
  value: string;
  onChange: (next: string) => void;
  className?: string;
  /** Number of OTP input cells (default `ONBOARDING_OTP_DIGITS`). */
  length?: number;
};

export function OtpInputGroup({
  value,
  onChange,
  className,
  length = ONBOARDING_OTP_DIGITS,
}: OtpInputGroupProps) {
  const otpLength = Math.min(12, Math.max(1, Math.floor(length)));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const toCells = () => {
    const digits = value.replace(/\D/g, "").slice(0, otpLength);
    return Array.from({ length: otpLength }, (_, index) => digits[index] ?? "");
  };

  const commitCells = (cells: string[]) => {
    onChange(cells.join("").slice(0, otpLength));
  };

  const focusAt = (index: number) => {
    const el = inputsRef.current[index];
    if (el) {
      el.focus();
      el.select();
    }
  };

  const handleChange = (index: number, raw: string) => {
    const digit = raw.replace(/\D/g, "").slice(-1) ?? "";
    const cells = toCells();
    cells[index] = digit;
    commitCells(cells);
    if (digit && index < otpLength - 1) focusAt(index + 1);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    const current = value[index] ?? "";
    if (event.key === "Backspace" && !current && index > 0) {
      event.preventDefault();
      const cells = toCells();
      cells[index - 1] = "";
      commitCells(cells);
      focusAt(index - 1);
    }
    if (event.key === "ArrowLeft" && index > 0) focusAt(index - 1);
    if (event.key === "ArrowRight" && index < otpLength - 1) focusAt(index + 1);
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pasted = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);
    onChange(pasted);
    focusAt(Math.min(Math.max(pasted.length - 1, 0), otpLength - 1));
  };

  return (
    <div
      className={cn(
        "flex w-full min-w-0 flex-nowrap items-center justify-between gap-2 sm:gap-3",
        className,
      )}
      role="group"
      aria-label="Verification code"
    >
      {Array.from({ length: otpLength }).map((_, index) => {
        const char = value[index] ?? "";
        return (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            value={char}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={cn(
              "size-14 shrink-0 rounded-lg border border-input-border text-center text-lg font-semibold shadow-sm transition-[color,box-shadow,border-color]",
              "focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
              "min-[400px]:size-14 sm:size-18 sm:rounded-lg sm:text-2xl",
            )}
          />
        );
      })}
    </div>
  );
}
