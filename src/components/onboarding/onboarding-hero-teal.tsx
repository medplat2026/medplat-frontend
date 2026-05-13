import { ONBOARDING_COPY } from "@/constants/onboarding";
import { CarouselBarIndicators } from "@/components/onboarding/carousel-bar-indicators";
import { cn } from "@/lib/utils";

export function OnboardingHeroTeal({
  carouselActiveIndex = 0,
  className,
}: {
  carouselActiveIndex?: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[240px] w-full flex-1 flex-col overflow-hidden bg-onboarding-teal lg:min-h-screen",
        className
      )}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80' viewBox='0 0 120 80'%3E%3Cpath d='M0 40h12l6-10 6 20 6-25 8 30 8-35 10 40 10-30 12 25 12-20 10 15 10-10' fill='none' stroke='white' stroke-width='2'/%3E%3C/svg%3E")`,
          backgroundSize: "220px 140px",
        }}
      />
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center gap-8 p-8">
        <div className="grid max-w-xs grid-cols-3 gap-4 text-white/90 drop-shadow-sm">
          <span className="text-5xl" aria-hidden>
            🩺
          </span>
          <span className="text-5xl" aria-hidden>
            🌡️
          </span>
          <span className="text-5xl" aria-hidden>
            💊
          </span>
        </div>
      </div>
      <div className="relative z-10 mt-auto space-y-4 p-6 text-white sm:p-8">
        <p className="max-w-sm text-sm font-medium leading-relaxed sm:text-base">{ONBOARDING_COPY.tagline}</p>
        <CarouselBarIndicators activeIndex={carouselActiveIndex} />
      </div>
    </div>
  );
}
