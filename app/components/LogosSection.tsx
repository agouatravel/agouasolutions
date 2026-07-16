"use client";

import { useRef } from "react";
import { useInViewOnce } from "./motion/Reveal";

const clients = [
  "Nova Realty",
  "Zenith Towers",
  "Falcon Retail",
  "Vertex Living",
  "Origin Malls",
  "Skyline Group",
  "Atlas Hospitality",
  "Meridian Homes",
  "Cedar Exhibits",
  "Halo Retail",
  "Orbit Expo",
  "Terra Developments",
];

function initialsOf(name: string) {
  const words = name.split(" ").filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

function ClientCell({ name }: { name: string }) {
  const initials = initialsOf(name);

  return (
    <div className="group aspect-[4/3] [perspective:1000px]">
      <div
        className="relative h-full w-full [transform-style:preserve-3d] group-hover:[transform:rotateX(180deg)]"
        style={{ transition: "transform 750ms cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-surface px-4 [backface-visibility:hidden]">
          <span
            className="text-center text-[15px] font-semibold text-foreground/40 transition-colors duration-300 group-hover:text-foreground sm:text-[16px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </span>
        </div>

        <div
          className="absolute inset-0 flex items-center justify-center overflow-hidden rounded-xl bg-surface px-4 [backface-visibility:hidden] [transform:rotateX(180deg)]"
          style={{ background: "radial-gradient(circle at 50% 40%, var(--color-primary), var(--color-secondary))" }}
        >
          <span
            aria-hidden="true"
            className="absolute inset-0 flex select-none items-center justify-center text-[64px] font-bold italic leading-none text-white/15 sm:text-[80px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {initials}
          </span>
          <span className="relative text-center text-[13px] font-semibold text-white sm:text-[14px]" style={{ fontFamily: "var(--font-display)" }}>
            {name}
          </span>
        </div>
      </div>
    </div>
  );
}

export default function LogosSection() {
  const { ref: headingRef, visible } = useInViewOnce<HTMLDivElement>(0.3);
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const grid = gridRef.current;
    const spotlight = spotlightRef.current;
    if (!grid || !spotlight) return;
    const rect = grid.getBoundingClientRect();
    spotlight.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
    spotlight.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  };

  return (
    <section className="relative z-10 overflow-hidden bg-background py-20 sm:py-28">
      <div
        ref={headingRef}
        className={`relative mx-auto max-w-3xl px-6 text-center transition-all duration-700 ease-out lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-border-hairline bg-surface px-4 py-1.5 text-[11px] uppercase tracking-widest text-muted">
          Trusted By
        </span>
        <h2
          className="mt-6 text-[28px] font-semibold leading-tight text-foreground sm:text-[36px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Chosen by 30+ Developers, Retailers &amp;{" "}
          <span style={{ fontFamily: "var(--font-pixel)", color: "var(--color-primary)" }}>
            Experience Brands
          </span>
        </h2>
      </div>

      <div
        className={`relative mx-auto mt-16 max-w-6xl px-6 transition-all duration-700 ease-out lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-6"
        >
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute left-0 top-0 z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.14), transparent 70%)",
              transition: "opacity 300ms ease",
            }}
          />
          {clients.map((name) => (
            <ClientCell key={name} name={name} />
          ))}
        </div>
      </div>
    </section>
  );
}
