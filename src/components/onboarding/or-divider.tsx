import { cn } from "@/lib/utils";

export function OrDivider({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Or</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
