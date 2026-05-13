import { cn } from "@/lib/utils";

type CarouselBarIndicatorsProps = {
  total?: number;
  activeIndex: number;
  className?: string;
};

export function CarouselBarIndicators({
  total = 3,
  activeIndex,
  className,
}: CarouselBarIndicatorsProps) {
  return (
    <div className={cn("flex gap-2", className)} role="status" aria-label="Hero slides">
      {Array.from({ length: total }).map((_, i) => (
        <span
          key={i}
          className={cn(
            "h-1 flex-1 rounded-full bg-white/35 transition-colors",
            i === activeIndex && "bg-white"
          )}
        />
      ))}
    </div>
  );
}
