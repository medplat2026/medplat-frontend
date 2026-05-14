import { forwardRef, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import type { SelectOption } from "@/components/ui/select-field";

type Base = {
  id: string;
  label: string;
  className?: string;
  hint?: ReactNode;
  error?: string;
  requiredIndicator?: boolean;
};

type InputBranch = Base &
  Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "size"> & {
    control: "input";
    inputClassName?: string;
  };

type SelectBranch = Base &
  Omit<React.ComponentPropsWithoutRef<"select">, "id" | "size"> & {
    control: "select";
    options: SelectOption[];
    placeholder?: string;
    selectClassName?: string;
  };

type TextareaBranch = Base &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id"> & {
    control: "textarea";
    textareaClassName?: string;
  };

export type ModalFormFieldProps = InputBranch | SelectBranch | TextareaBranch;

/**
 * Single label + control primitive for modals (text input, native select, or textarea).
 */
export const ModalFormField = forwardRef<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement, ModalFormFieldProps>(
  function ModalFormField(props, ref) {
    const { id, label, className, hint, error, requiredIndicator } = props;

    const labelEl = (
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {requiredIndicator ? <span className="text-destructive"> *</span> : null}
      </label>
    );

    if (props.control === "input") {
      const {
        control: _c,
        label: _l,
        hint: _h,
        error: _e,
        requiredIndicator: _r,
        className: _cl,
        inputClassName,
        disabled,
        id: _inputId,
        ...inputProps
      } = props;
      return (
        <div className={cn("w-full space-y-2.5", className)}>
          {labelEl}
          <input
            {...inputProps}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            id={id}
            disabled={disabled}
            aria-invalid={Boolean(error)}
            aria-describedby={hint ? `${id}-hint` : undefined}
            className={cn(
              "w-full rounded-xl border-[0.1px] bg-white px-4 py-3 text-xs text-foreground  transition-[color,box-shadow,border-color]",
              "border-input-border placeholder:text-muted-foreground placeholder:text-[10px] placeholder:font-light placeholder:italic",
              "focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
              "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
              error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
              inputClassName,
            )}
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

    if (props.control === "select") {
      const {
        control: _c,
        label: _l,
        hint: _h,
        error: _e,
        requiredIndicator: _r,
        className: _cl,
        options,
        placeholder,
        selectClassName,
        disabled,
        value,
        defaultValue,
        id: _sid,
        ...selectProps
      } = props;
      const isControlled = value !== undefined;
      const displayLooksEmpty = isControlled ? value === "" : false;

      return (
        <div className={cn("w-full space-y-2.5", className)}>
          {labelEl}
          <div className="relative">
            <select
              {...selectProps}
              ref={ref as React.ForwardedRef<HTMLSelectElement>}
              id={id}
              disabled={disabled}
              aria-invalid={Boolean(error)}
              {...(isControlled ? { value } : { defaultValue })}
              className={cn(
                "w-full appearance-none rounded-xl border-[0.1px] bg-white px-4 py-3 pr-10 text-xs text-foreground  transition-[color,box-shadow,border-color]",
                "border-input-border focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
                "placeholder:text-[10px] font-light placeholder:text-muted-foreground placeholder:italic",
                "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
                error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
                placeholder && displayLooksEmpty && "text-muted-foreground",
                selectClassName,
              )}
            >
              {placeholder ? (
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
              <ChevronDown className="h-4 w-4" />
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

    const {
      control: _c,
      label: _l,
      hint: _h,
      error: _e,
      requiredIndicator: _r,
      className: _cl,
      textareaClassName,
      disabled,
      id: _tid,
      ...textareaProps
    } = props;
    return (
      <div className={cn("w-full space-y-2.5", className)}>
        {labelEl}
        <textarea
          {...textareaProps}
          ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
          id={id}
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={hint ? `${id}-hint` : undefined}
          className={cn(
            "min-h-[120px] w-full resize-y rounded-xl border-[0.1px] bg-white px-4 py-3 text-xs text-foreground  transition-[color,box-shadow,border-color]",
            "border-input-border placeholder:text-[10px] placeholder:font-light placeholder:text-muted-foreground placeholder:italic",
            "focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
            "disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
            error && "border-destructive focus-visible:border-destructive focus-visible:ring-destructive/15",
            textareaClassName,
          )}
        />
        {hint ? (
          <p id={`${id}-hint`} className="text-xs text-muted-foreground">
            {hint}
          </p>
        ) : null}
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
      </div>
    );
  },
);

function ChevronDown({ className }: { className?: string }) {
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
