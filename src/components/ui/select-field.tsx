import { forwardRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export type SelectOption = { value: string; label: string };

export type SelectFieldProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "id" | "children"> & {
  id: string;
  label: string;
  labelClassName?: string;
  options: SelectOption[];
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  requiredIndicator?: boolean;
  selectClassName?: string;
};

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  function SelectField(
    {
      id,
      label,
      labelClassName,
      options,
      placeholder,
      hint,
      error,
      requiredIndicator,
      className,
      selectClassName,
      disabled,
      value,
      defaultValue: initialDefaultValue,
      ...selectProps
    },
    ref
  ) {
    const isControlled = value !== undefined;
    const showPlaceholder = Boolean(placeholder);
    const displayLooksEmpty = isControlled ? value === "" : false;

    return (
      <div className={cn("w-full space-y-1.5", className)}>
        <label htmlFor={id} className={cn("block text-sm font-medium text-foreground", labelClassName)}>
          {label}
          {requiredIndicator ? <span className="text-destructive"> *</span> : null}
        </label>
        <div className="relative">
          <select
            ref={ref}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            {...(isControlled ? { value } : { defaultValue: initialDefaultValue })}
            className={cn(
              "w-full appearance-none rounded-xl border bg-white px-4 py-3 pr-10 text-sm text-foreground shadow-sm transition-[color,box-shadow,border-color]",
              "border-input-border focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
              showPlaceholder && displayLooksEmpty && "text-muted-foreground",
              selectClassName
            )}
            {...selectProps}
          >
            {showPlaceholder ? (
              <option value="" disabled>
                {placeholder}
              </option>
            ) : null}
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <span
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          >
            <ChevronDownIcon className="h-4 w-4" />
          </span>
        </div>
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

function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor" aria-hidden>
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}
