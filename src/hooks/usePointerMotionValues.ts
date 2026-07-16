"use client";

import { useEffect } from "react";
import { useMotionValue } from "framer-motion";

/**
 * Tracks the pointer position normalized to [-1, 1] on both axes,
 * exposed as Framer Motion values so both DOM parallax (useTransform)
 * and the three.js render loop (via `.get()` inside useFrame) can read
 * the same source without triggering React re-renders per mouse move.
 */
export function usePointerMotionValues() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    function handlePointerMove(event: PointerEvent) {
      x.set((event.clientX / window.innerWidth) * 2 - 1);
      y.set((event.clientY / window.innerHeight) * 2 - 1);
    }

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, [x, y]);

  return { x, y };
}
