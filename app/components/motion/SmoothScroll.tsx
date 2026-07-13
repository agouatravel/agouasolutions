"use client";

import { useEffect } from "react";

// A single fast wheel flick (~500-800px) can span the entire scroll distance
// that VideoSection/ServicesShowcaseSection/ProcessSection use to drive their
// animations, so the native instant-jump scroll makes those animations "snap"
// instead of play. Easing the real scroll position toward the wheel target
// spreads that motion across many frames and slows the effective scroll speed.
const EASE = 0.15;
const WHEEL_SPEED = 0.75;
const SETTLE_THRESHOLD = 0.5;

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    let current = window.scrollY;
    let target = window.scrollY;
    let maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    let rafId: number | null = null;
    let animating = false;

    function clamp(value: number) {
      return Math.min(Math.max(value, 0), maxScroll);
    }

    function updateMaxScroll() {
      maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      target = clamp(target);
    }

    function tick() {
      current += (target - current) * EASE;
      if (Math.abs(target - current) < SETTLE_THRESHOLD) {
        current = target;
        window.scrollTo(0, current);
        animating = false;
        rafId = null;
        return;
      }
      window.scrollTo(0, current);
      rafId = requestAnimationFrame(tick);
    }

    function onWheel(e: WheelEvent) {
      // Let pinch-zoom and horizontal gestures pass through untouched.
      if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;

      let delta = e.deltaY;
      if (e.deltaMode === 1) delta *= 16;
      else if (e.deltaMode === 2) delta *= window.innerHeight;

      e.preventDefault();

      if (!animating) {
        current = window.scrollY;
        target = window.scrollY;
        animating = true;
        rafId = requestAnimationFrame(tick);
      }

      target = clamp(target + delta * WHEEL_SPEED);
    }

    updateMaxScroll();
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", updateMaxScroll);

    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", updateMaxScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
