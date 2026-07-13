"use client";

import { useRef } from "react";
import { useInViewOnce } from "./motion/Reveal";

type Item = {
  badge: string;
  heading: string;
  body: string;
  bg: string;
  text: string;
  glow: string;
  border: string;
  icon: React.ReactNode;
};

const items: Item[] = [
  {
    badge: "Dedicated Studio Team",
    heading: "Work With A Dedicated Studio Team",
    body: "Get hands-on VR, AR, and visualization support from our in-house team — no scattered freelancers, no hand-offs.",
    bg: "rgba(20,184,166,0.12)",
    text: "#0d8f81",
    glow: "rgba(20,184,166,0.14)",
    border: "rgba(20,184,166,0.4)",
    icon: (
      <path
        d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-4 4v-4H6.5A2.5 2.5 0 0 1 4 13.5v-8Z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    badge: "Rapid Deployment",
    heading: "Launch Experiences In Weeks",
    body: "We design, build, and deploy immersive experiences fast, with pipelines built for tight event and launch timelines.",
    bg: "rgba(59,130,246,0.12)",
    text: "#2563eb",
    glow: "rgba(59,130,246,0.14)",
    border: "rgba(59,130,246,0.4)",
    icon: (
      <path
        d="M3.5 16.5 10 10l4 4 6.5-6.5M20.5 7.5v-3h-3"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    badge: "Built To Scale",
    heading: "Scale From Demo To Experience Center",
    body: "Start with a single VR showcase and expand into a full multi-room experience center as your needs grow.",
    bg: "rgba(139,92,246,0.12)",
    text: "#7c3aed",
    glow: "rgba(139,92,246,0.14)",
    border: "rgba(139,92,246,0.4)",
    icon: (
      <path
        d="M9 3H3v6M15 21h6v-6M3 3l7 7M21 21l-7-7"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
  {
    badge: "End-To-End Delivery",
    heading: "Focus On Your Vision, We Handle Production",
    body: "We manage hardware, content, and on-site installation so your team can focus on the experience, not the execution.",
    bg: "rgba(245,158,11,0.14)",
    text: "#b45309",
    glow: "rgba(245,158,11,0.16)",
    border: "rgba(245,158,11,0.4)",
    icon: (
      <path
        d="M4 15a8 8 0 1 1 16 0M12 15l4-5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  },
];

function DeliveryCell({ item, index, visible }: { item: Item; index: number; visible: boolean }) {
  const cellRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cellRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={cellRef}
      onMouseMove={handleMouseMove}
      className={`group relative flex flex-col items-center gap-4 overflow-hidden border-r border-b border-border-hairline px-8 py-14 text-center transition-all duration-700 ease-out hover:border-r-[var(--cell-border)] hover:border-b-[var(--cell-border)] ${
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
      }`}
      style={
        {
          transitionDelay: visible ? `${index * 90}ms` : "0ms",
          "--cell-border": item.border,
        } as React.CSSProperties
      }
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), ${item.glow}, transparent 65%)`,
        }}
      />

      <span
        className="font-label relative inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-widest"
        style={{ backgroundColor: item.bg, color: item.text }}
      >
        {item.badge}
      </span>

      <span
        className="relative flex h-11 w-11 items-center justify-center text-foreground transition-transform duration-300 group-hover:scale-110"
        style={{ color: item.text }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="h-full w-full">
          {item.icon}
        </svg>
      </span>

      <h3
        className="relative text-[20px] font-semibold leading-tight text-foreground sm:text-[22px]"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {item.heading}
      </h3>

      <p className="relative max-w-sm text-[15px] leading-relaxed text-muted">{item.body}</p>
    </div>
  );
}

export default function DeliverySection() {
  const { ref: sectionRef, visible } = useInViewOnce<HTMLElement>(0.2);

  return (
    <section ref={sectionRef} className="relative z-10 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center lg:px-8">
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-border-hairline bg-surface px-4 py-1.5 text-[11px] uppercase tracking-widest text-muted">
          How We Deliver
        </span>
        <h2
          className="mt-6 text-[28px] font-semibold leading-tight text-foreground sm:text-[36px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Built To Support Your{" "}
          <span style={{ fontFamily: "var(--font-pixel)", color: "var(--color-primary)" }}>
            Immersive Roadmap
          </span>
        </h2>
      </div>

      <div className="relative mx-auto mt-16 grid max-w-6xl grid-cols-1 border-t border-l border-border-hairline sm:grid-cols-2">
        {items.map((item, i) => (
          <DeliveryCell key={item.heading} item={item} index={i} visible={visible} />
        ))}
        <span
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 hidden h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-foreground sm:block"
        />
      </div>
    </section>
  );
}
