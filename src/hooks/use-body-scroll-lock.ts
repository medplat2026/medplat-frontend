import { useEffect } from "react";

/** Shell layouts mark their scroll column so overlays can hide nested overflow (body lock alone is not enough). */
export const APP_SCROLL_CONTAINER_ATTR = "data-app-scroll-container";

let lockDepth = 0;
let snapshot: { htmlOverflow: string; bodyOverflow: string; bodyPaddingRight: string } | null = null;
let containerSnapshots: { el: HTMLElement; overflow: string }[] | null = null;

function scrollbarWidth(): number {
  if (typeof window === "undefined") return 0;
  return Math.max(0, window.innerWidth - document.documentElement.clientWidth);
}

/** Increment scroll lock; returned function decrements. Safe when multiple overlays stack. */
function acquireBodyScrollLock(): () => void {
  if (lockDepth === 0) {
    snapshot = {
      htmlOverflow: document.documentElement.style.overflow,
      bodyOverflow: document.body.style.overflow,
      bodyPaddingRight: document.body.style.paddingRight,
    };
    containerSnapshots = [];
    document.querySelectorAll<HTMLElement>(`[${APP_SCROLL_CONTAINER_ATTR}]`).forEach((el) => {
      containerSnapshots!.push({ el, overflow: el.style.overflow });
      el.style.overflow = "hidden";
    });
    const gap = scrollbarWidth();
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (gap > 0) document.body.style.paddingRight = `${gap}px`;
  }
  lockDepth += 1;
  return () => {
    lockDepth = Math.max(0, lockDepth - 1);
    if (lockDepth === 0 && snapshot) {
      document.documentElement.style.overflow = snapshot.htmlOverflow;
      document.body.style.overflow = snapshot.bodyOverflow;
      document.body.style.paddingRight = snapshot.bodyPaddingRight;
      snapshot = null;
      containerSnapshots?.forEach(({ el, overflow }) => {
        el.style.overflow = overflow;
      });
      containerSnapshots = null;
    }
  };
}

/**
 * Prevents the page behind overlays from scrolling (wheel / trackpad would still move the document otherwise).
 */
export function useBodyScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;
    return acquireBodyScrollLock();
  }, [locked]);
}
