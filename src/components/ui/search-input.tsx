import { cn } from "@/lib/utils";

type SearchInputProps = {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  id?: string;
};

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
      <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M16 16 21 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function SearchInput({
  placeholder = "Search...",
  value,
  onChange,
  className,
  id,
}: SearchInputProps) {
  return (
    <label className={cn("relative block", className)}>
      <span className="sr-only">{placeholder}</span>
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        <SearchIcon />
      </span>
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full rounded-xl border border-input-border bg-white py-2.5 pl-10 pr-3 text-sm text-foreground outline-none ring-onboarding-blue/25 placeholder:text-muted-foreground focus:ring-2"
      />
    </label>
  );
}
