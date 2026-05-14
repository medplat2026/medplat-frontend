"use client";

import { useEffect, useRef, type RefObject } from "react";

/**
 * Closes when the user presses outside the panel (e.g. modal backdrop). Uses capture so it works
 * with native `<dialog>` top-layer behavior where backdrop hits may not target the dialog node.
 */
export function useOutsidePointerDismiss(
  open: boolean,
  boundaryRef: RefObject<HTMLElement | null>,
  onDismiss: () => void,
): void {
  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      const el = boundaryRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const { clientX, clientY } = event;
      const inside =
        clientX >= r.left && clientX <= r.right && clientY >= r.top && clientY <= r.bottom;
      if (!inside) onDismissRef.current();
    }

    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [open, boundaryRef]);
}
