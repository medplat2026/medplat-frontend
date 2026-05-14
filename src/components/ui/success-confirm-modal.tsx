"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useOutsidePointerDismiss } from "@/hooks/use-outside-pointer-dismiss";
import { cn } from "@/lib/utils";

const DEFAULT_ILLUSTRATION_SRC = "/assets/dashboard/complete.svg";

export type SuccessConfirmModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmLabel?: string;
  /** Overrides the default dashboard success illustration. */
  illustration?: ReactNode;
  className?: string;
};

/**
 * Centered success state aligned with dashboard mockups: asset illustration, slate heading, gray body copy, soft confirm CTA.
 */
export function SuccessConfirmModal({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  illustration,
  className,
}: SuccessConfirmModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  useBodyScrollLock(open);
  useOutsidePointerDismiss(open, ref, () => onOpenChange(false));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open) {
      if (!el.open) el.showModal();
    } else if (el.open) {
      el.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-[60] w-[calc(100%-2rem)] max-w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-[#E5E7EB] bg-[#DFE1E6] p-0 shadow-[0_20px_60px_rgba(15,23,42,0.12)] backdrop:bg-black/40 overscroll-contain",
        className,
      )}
      onClose={() => onOpenChange(false)}
    >
      <div className="relative flex flex-col overflow-hidden rounded-2xl">
        <div className="absolute right-4 top-4 z-10">
          <button
            type="button"
            className="inline-flex size-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#9CA3AF] shadow-sm transition-colors hover:bg-[#F9FAFB] hover:text-[#6B7280]"
            aria-label="Close"
            onClick={() => onOpenChange(false)}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex flex-col items-center px-8 pb-6 pt-16 text-center">
          <div className="mb-8 flex w-full max-w-[240px] shrink-0 justify-center">
            {illustration ?? (
              <img
                src={DEFAULT_ILLUSTRATION_SRC}
                alt=""
                width={192}
                height={167}
                decoding="async"
                className="h-auto w-full max-w-[220px] object-contain select-none"
              />
            )}
          </div>
          <h2 className="text-lg font-bold leading-snug tracking-tight text-[#1F2937]">{title}</h2>
          <p className="mt-3 max-w-[300px] text-sm font-normal leading-relaxed text-[#6B7280]">{description}</p>
        </div>

        <div className="border-t border-[#E5E7EB] bg-[#F3F4F6] px-6 pb-6 pt-4">
          <button
            type="button"
            className="w-full rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] py-3.5 text-sm font-semibold text-[#6B7280] transition-colors hover:bg-white hover:text-[#4B5563]"
            onClick={() => onOpenChange(false)}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </dialog>
  );
}

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
