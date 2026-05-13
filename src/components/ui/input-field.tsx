import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type InputFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  hint?: ReactNode;
  error?: string;
  requiredIndicator?: boolean;
  inputClassName?: string;
};

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  function InputField(
    {
      id,
      label,
      hint,
      error,
      requiredIndicator,
      className,
      inputClassName,
      disabled,
      ...inputProps
    },
    ref
  ) {
    return (
      <div className={cn("w-full space-y-1.5", className)}>
        <label htmlFor={id} className="block text-sm font-medium text-foreground">
          {label}
          {requiredIndicator ? <span className="text-destructive"> *</span> : null}
        </label>
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cn(
            "w-full rounded-xl border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-[color,box-shadow,border-color]",
            "border-input-border placeholder:text-muted-foreground",
            "focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
            inputClassName
          )}
          {...inputProps}
        />
        {hint ? (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  }
);
