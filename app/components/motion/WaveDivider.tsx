"use client";

import { useEffect, useRef } from "react";

const WAVE_PATH =
  "M0,40 C150,90 350,0 600,40 C850,80 1050,0 1200,40 C1350,90 1550,0 1800,40 C2050,80 2250,0 2400,40 L2400,120 L0,120 Z";

export default function WaveDivider({ className }: { className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    let ticking = false;
    let tileWidth = container.clientWidth;

    function update() {
      ticking = false;
      if (!track || tileWidth === 0) return;
      const offset = (window.scrollY * 0.35) % tileWidth;
      track.style.transform = `translateX(${-offset}px)`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      if (container) tileWidth = container.clientWidth;
      update();
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div ref={containerRef} className={`overflow-hidden ${className ?? ""}`.trim()} aria-hidden="true">
      <svg ref={trackRef} className="h-full w-[200%]" viewBox="0 0 2400 120" preserveAspectRatio="none">
        <path d={WAVE_PATH} fill="var(--color-tertiary)" />
      </svg>
    </div>
  );
}
