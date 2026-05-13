"use client";

import { useState, type InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & {
  id: string;
  label: string;
  error?: string;
};

export function PasswordField({
  id,
  label,
  className,
  value,
  defaultValue,
  onChange,
  error,
  autoComplete = "new-password",
  ...rest
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const [internal, setInternal] = useState(String(defaultValue ?? ""));
  const isControlled = value !== undefined;
  const password = isControlled ? String(value ?? "") : internal;

  return (
    <div className={cn("w-full space-y-2", className)}>
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <LockIcon className="h-4 w-4" />
        </span>
        <input
          id={id}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full rounded-xl border bg-white py-3 pl-10 pr-11 text-sm text-foreground shadow-sm transition-[color,box-shadow,border-color]",
            "border-input-border",
            "focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
            error &&
              "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15"
          )}
          {...rest}
          value={isControlled ? password : internal}
          onChange={(e) => {
            if (!isControlled) setInternal(e.target.value);
            onChange?.(e);
          }}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
        >
          {visible ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
        </button>
      </div>
      {error ? (
        <p className="flex items-start gap-1.5 text-xs text-destructive" role="alert">
          <AlertTriangleIcon className="mt-0.5 size-3.5 shrink-0" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

function AlertTriangleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M12 3 2 20h20L12 3Z" strokeLinejoin="round" />
      <path d="M12 9v4M12 17h.01" strokeLinecap="round" />
    </svg>
  );
}

function LockIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 018 0v3" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M3 3l18 18" />
      <path d="M10.6 10.6a3 3 0 004.8 4.8" />
      <path d="M9.9 5.1A10.4 10.4 0 0112 5c6 0 10 7 10 7a18.7 18.7 0 01-4.9 5.9M6.4 6.4A18.7 18.7 0 002 12s4 7 10 7a9.7 9.7 0 004.1-.9" />
    </svg>
  );
}
