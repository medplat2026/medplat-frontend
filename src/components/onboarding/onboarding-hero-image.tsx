"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { ONBOARDING_COPY, onboardingHeroSlide } from "@/constants/onboarding";
import { CarouselBarIndicators } from "@/components/onboarding/carousel-bar-indicators";
import { cn } from "@/lib/utils";

const SLIDE_COUNT = 3;
const AUTO_ADVANCE_MS = 5000;

export type OnboardingHeroImageProps = {
  alt: string;
  /** Which slide (0–2) to show first; also resets when this value changes (e.g. step navigation). */
  carouselActiveIndex?: number;
  className?: string;
};

export function OnboardingHeroImage({
  alt,
  carouselActiveIndex = 0,
  className,
}: OnboardingHeroImageProps) {
  const initial = Math.max(0, Math.min(SLIDE_COUNT - 1, Math.floor(carouselActiveIndex)));
  const [slide, setSlide] = useState(initial);

  useEffect(() => {
    setSlide(Math.max(0, Math.min(SLIDE_COUNT - 1, Math.floor(carouselActiveIndex))));
  }, [carouselActiveIndex]);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    const id = window.setInterval(() => {
      setSlide((s) => (s + 1) % SLIDE_COUNT);
    }, AUTO_ADVANCE_MS);
    return () => window.clearInterval(id);
  }, []);

  const src = onboardingHeroSlide(slide);
  const isSvg = src.endsWith(".svg");

  return (
    <div
      className={cn(
        "relative min-h-[240px] w-full flex-1 overflow-hidden lg:min-h-screen",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        priority
        unoptimized={isSvg}
        className="object-cover transition-opacity duration-500"
        sizes="(max-width: 1024px) 100vw, 42vw"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 z-10 space-y-4 p-6 text-white sm:p-8">
        <p className="max-w-sm text-sm font-medium leading-relaxed sm:text-base">{ONBOARDING_COPY.tagline}</p>
        <CarouselBarIndicators activeIndex={slide} total={SLIDE_COUNT} />
      </div>
    </div>
  );
}
