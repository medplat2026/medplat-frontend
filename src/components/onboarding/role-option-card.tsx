import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type RoleOptionCardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  selected?: boolean;
  onSelect: () => void;
};

export function RoleOptionCard({ title, description, icon, selected, onSelect }: RoleOptionCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col items-center gap-3 rounded-2xl border bg-white p-4 text-center shadow-sm transition-[transform,box-shadow,border-color]",
        "hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-onboarding-blue/15",
        selected ? "border-onboarding-blue ring-2 ring-onboarding-blue/20" : "border-border"
      )}
    >
      <span className="flex h-14 w-full shrink-0 items-center justify-center [&>svg]:h-14 [&>svg]:w-14 sm:h-16 sm:[&>svg]:h-16 sm:[&>svg]:w-16" aria-hidden>
        {icon}
      </span>
      <div className="flex w-full flex-col items-center gap-1.5">
        <p className="text-center text-sm font-semibold leading-snug text-foreground">{title}</p>
        <p className="text-center text-[11px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
    </button>
  );
}
