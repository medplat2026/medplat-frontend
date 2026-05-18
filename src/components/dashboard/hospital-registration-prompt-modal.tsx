"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useOutsidePointerDismiss } from "@/hooks/use-outside-pointer-dismiss";
import { cn } from "@/lib/utils";

export type HospitalRegistrationPromptModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onKickstart: () => void;
  className?: string;
};

/** Intro modal after hospital onboarding — prompts full profile registration. */
export function HospitalRegistrationPromptModal({
  open,
  onOpenChange,
  onKickstart,
  className,
}: HospitalRegistrationPromptModalProps) {
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

  function handleKickstart() {
    onOpenChange(false);
    onKickstart();
  }

  return (
    <dialog
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-[55] w-[calc(100%-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-white p-0 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop:bg-black/40 overscroll-contain",
        className,
      )}
      onClose={() => onOpenChange(false)}
    >
      <div className="flex flex-col items-center px-8 pb-5 pt-10 text-center">
        <div
          className="mb-6 flex size-[72px] items-center justify-center rounded-full bg-[#F28B82] text-3xl font-bold leading-none text-white shadow-sm"
          aria-hidden
        >
          !
        </div>
        <h2 className="text-xl font-bold tracking-tight text-foreground">Register your Hospital</h2>
        <p className="mt-3 max-w-[320px] text-sm leading-relaxed text-muted-foreground">
          Join our network to receive patient referrals, manage cases, and provide quality care.
        </p>
      </div>

      <div className="border-t border-border px-6 pb-6 pt-5">
        <Button type="button" fullWidth className="rounded-xl py-3.5 text-sm font-semibold" onClick={handleKickstart}>
          Kick-start your registration
        </Button>
      </div>
    </dialog>
  );
}
