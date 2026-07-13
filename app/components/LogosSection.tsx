"use client";

import { useInViewOnce } from "./motion/Reveal";

const rowOne = [
  "Nova Realty",
  "Zenith Towers",
  "Falcon Retail",
  "Vertex Living",
  "Origin Malls",
  "Skyline Group",
];

const rowTwo = [
  "Atlas Hospitality",
  "Meridian Homes",
  "Cedar Exhibits",
  "Halo Retail",
  "Orbit Expo",
  "Terra Developments",
];

function LogoPill({ name }: { name: string }) {
  return (
    <span
      className="inline-flex shrink-0 items-center rounded-full border border-border-hairline bg-surface px-6 py-3 text-[15px] font-semibold text-foreground/45 shadow-sm transition hover:border-primary-dim/40 hover:text-foreground"
      style={{ fontFamily: "var(--font-display)" }}
    >
      {name}
    </span>
  );
}

function MarqueeRow({ items, direction }: { items: string[]; direction: "left" | "right" }) {
  const doubled = [...items, ...items];
  return (
    <div
      className={`flex w-max gap-4 ${direction === "left" ? "animate-marquee-left" : "animate-marquee-right"}`}
    >
      {doubled.map((name, i) => (
        <LogoPill key={`${name}-${i}`} name={name} />
      ))}
    </div>
  );
}

export default function LogosSection() {
  const { ref: headingRef, visible } = useInViewOnce<HTMLDivElement>(0.3);

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
        className={`relative mt-16 flex flex-col gap-5 transition-all duration-700 ease-out [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <MarqueeRow items={rowOne} direction="left" />
        <MarqueeRow items={rowTwo} direction="right" />
      </div>
    </section>
  );
}
