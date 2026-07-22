"use client";

import Image from "next/image";
import { useRef } from "react";

interface BeforeAfterSliderProps {
  afterSrc: string;
  afterAlt: string;
  accent: string;
  beforeLabel?: string;
  afterLabel?: string;
  className?: string;
}

/**
 * Drag (or tap-and-drag on touch) to reveal the delivered render over a
 * blueprint placeholder. There's no real "before" photo for these projects
 * yet — the blueprint stands in for the concept stage rather than faking one.
 */
export default function BeforeAfterSlider({
  afterSrc,
  afterAlt,
  accent,
  beforeLabel = "Concept",
  afterLabel = "Delivered",
  className,
}: BeforeAfterSliderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const afterRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);

  const setPosition = (clientX: number) => {
    const el = containerRef.current;
    const after = afterRef.current;
    const handle = handleRef.current;
    if (!el || !after || !handle) return;
    const rect = el.getBoundingClientRect();
    const pct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100));
    after.style.clipPath = `inset(0 ${100 - pct}% 0 0)`;
    handle.style.left = `${pct}%`;
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = true;
    e.currentTarget.setPointerCapture(e.pointerId);
    setPosition(e.clientX);
  };
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    setPosition(e.clientX);
  };
  const handlePointerUp = () => {
    draggingRef.current = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      className={`relative select-none overflow-hidden ${className ?? ""}`}
      style={{ cursor: "ew-resize", touchAction: "none" }}
    >
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: "#0b1424",
          backgroundImage: `linear-gradient(${accent}40 1px, transparent 1px), linear-gradient(90deg, ${accent}40 1px, transparent 1px)`,
          backgroundSize: "26px 26px",
        }}
      >
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: `radial-gradient(120% 90% at 50% 50%, ${accent}26, transparent 70%)` }}
        />
        <span className="absolute left-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white/70 backdrop-blur-sm">
          {beforeLabel}
        </span>
      </div>

      <div ref={afterRef} className="absolute inset-0" style={{ clipPath: "inset(0 50% 0 0)" }}>
        <Image
          src={afterSrc}
          alt={afterAlt}
          fill
          sizes="(min-width: 640px) 33vw, 50vw"
          className="object-cover"
        />
        <span className="absolute right-4 top-4 rounded-full bg-black/40 px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
          {afterLabel}
        </span>
      </div>

      <div
        ref={handleRef}
        className="pointer-events-none absolute inset-y-0 z-20 w-0.5 -translate-x-1/2 bg-white"
        style={{ left: "50%" }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-lg">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M8 7 4 12l4 5M16 7l4 5-4 5"
              stroke="#0f172a"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </div>
    </div>
  );
}
