import type { InputHTMLAttributes } from "react";
import { SelectField } from "@/components/ui/select-field";
import { cn } from "@/lib/utils";

const COUNTRY_OPTIONS = [{ value: "+234", label: "🇳🇬 +234" }];

export type PhoneFieldProps = {
  idPrefix: string;
  countryValue: string;
  onCountryChange: (value: string) => void;
  phoneProps: InputHTMLAttributes<HTMLInputElement>;
  className?: string;
};

export function PhoneField({ idPrefix, countryValue, onCountryChange, phoneProps, className }: PhoneFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <span className="block text-sm font-medium text-foreground">Phone Number</span>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="sm:w-44">
          <SelectField
            id={`${idPrefix}-country`}
            label="Country code"
            labelClassName="sr-only"
            options={COUNTRY_OPTIONS}
            value={countryValue}
            onChange={(e) => onCountryChange(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <label htmlFor={`${idPrefix}-phone`} className="sr-only">
            Phone number
          </label>
          <input
            id={`${idPrefix}-phone`}
            type="tel"
            inputMode="tel"
            placeholder="801 234 5678"
            className={cn(
              "w-full rounded-xl border border-input-border bg-white px-4 py-3 text-sm text-foreground shadow-sm transition-[color,box-shadow,border-color]",
              "focus-visible:border-onboarding-blue focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15"
            )}
            {...phoneProps}
          />
        </div>
      </div>
    </div>
  );
}
