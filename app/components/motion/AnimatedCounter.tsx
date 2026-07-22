"use client";

import { useEffect, useRef, useState } from "react";

function easeOutExpo(t: number) {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

export default function AnimatedCounter({
  value,
  start,
  duration = 1400,
  prefix = "",
  suffix = "",
}: {
  value: number;
  start: boolean;
  duration?: number;
  prefix?: string;
  suffix?: string;
}) {
  const [display, setDisplay] = useState(0);
  const startedRef = useRef(false);

  useEffect(() => {
    if (!start || startedRef.current) return;
    startedRef.current = true;

    let raf = 0;
    const t0 = performance.now();

    function tick(now: number) {
      const elapsed = now - t0;
      const progress = Math.min(1, elapsed / duration);
      setDisplay(Math.round(value * easeOutExpo(progress)));
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, value, duration]);

  return (
    <span className="font-numeric">
      {prefix}
      {display}
      {suffix}
    </span>
  );
}
