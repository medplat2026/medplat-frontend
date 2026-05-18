"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { useBodyScrollLock } from "@/hooks/use-body-scroll-lock";
import { useOutsidePointerDismiss } from "@/hooks/use-outside-pointer-dismiss";
import { cn } from "@/lib/utils";

export type AppModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Renders above the title row (e.g. segmented progress). */
  progress?: ReactNode;
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  /** Max width: `lg` 32rem · `xl` 36rem · `2xl` 42rem · `3xl` 48rem · `4xl` 56rem · `5xl` 64rem */
  size?: "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
  className?: string;
};

const sizeClass: Record<NonNullable<AppModalProps["size"]>, string> = {
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

/**
 * Centered modal shell using the native `<dialog>` element (backdrop + Escape).
 */
export function AppModal({
  open,
  onOpenChange,
  progress,
  title,
  subtitle,
  children,
  footer,
  size = "3xl",
  className,
}: AppModalProps) {
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
        "fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-white p-0 shadow-[0_20px_60px_rgba(15,23,42,0.15)] backdrop:bg-black/40 overscroll-contain",
        sizeClass[size],
        className,
      )}
      onClose={() => onOpenChange(false)}
    >
      <div className="flex max-h-[min(90dvh,880px)] flex-col overflow-hidden">
        <div className="shrink-0 border-b border-border px-6 pb-4 pt-5">
          <div className="relative pr-10">
            <button
              type="button"
              className="absolute right-0 top-0 inline-flex size-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Close"
              onClick={() => onOpenChange(false)}
            >
              <CloseIcon />
            </button>
            {progress ? <div className="mb-4 pr-1">{progress}</div> : null}
            <h2 className="text-lg font-bold text-foreground">{title}</h2>
            {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>

        {footer ? <div className="shrink-0 border-t border-border px-6 py-4">{footer}</div> : null}
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
