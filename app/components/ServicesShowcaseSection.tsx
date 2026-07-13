"use client";

import { useEffect, useRef } from "react";

type Panel = {
  index: string;
  headingBold: string;
  headingItalic: string;
  caption: string;
  bg: string;
  accent: string;
  icon: React.ReactNode;
};

const panels: Panel[] = [
  {
    index: "01",
    headingBold: "Virtual Reality",
    headingItalic: "Experiences",
    caption: "Step Inside The Experience",
    bg: "#04211d",
    accent: "#14b8a6",
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2.2a1.5 1.5 0 0 0-1.3.75l-.5.75a1.5 1.5 0 0 1-2 0l-.5-.75A1.5 1.5 0 0 0 9.2 15H7a3 3 0 0 1-3-3V9Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.2" />
        <circle cx="15.5" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    index: "02",
    headingBold: "Augmented Reality",
    headingItalic: "Solutions",
    caption: "Blending Digital With Real",
    bg: "#0b1d3a",
    accent: "#3b82f6",
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 8V6a1 1 0 0 1 1-1h2M20 8V6a1 1 0 0 0-1-1h-2M4 16v2a1 1 0 0 0 1 1h2M20 16v2a1 1 0 0 1-1 1h-2"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    index: "03",
    headingBold: "Architectural",
    headingItalic: "Visualization",
    caption: "Visualize Before You Build",
    bg: "#1e1033",
    accent: "#7c3aed",
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 21V6l7-3 7 3v15M9 21v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    index: "04",
    headingBold: "Experience Center",
    headingItalic: "Design",
    caption: "Spaces That Sell The Vision",
    bg: "#2a1a05",
    accent: "#f59e0b",
    icon: (
      <svg width="72" height="72" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v7H4z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function ServicesShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const container = containerRef.current;
      if (!container) return;

      const viewportHeight = window.innerHeight;
      const rect = container.getBoundingClientRect();
      const scrolled = Math.max(0, -rect.top);
      const progress = scrolled / viewportHeight;

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const distance = Math.min(Math.abs(progress - i), 1);
        const opacity = 1 - distance;
        panel.style.opacity = String(opacity);
        panel.style.transform = `translateY(${distance * 24}px)`;
        panel.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
      });
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section ref={containerRef} className="relative" style={{ height: `${panels.length * 100}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {panels.map((panel, i) => (
          <div
            key={panel.index}
            ref={(el) => {
              panelRefs.current[i] = el;
            }}
            className="absolute inset-0 flex flex-col justify-center px-6 will-change-transform lg:px-16"
            style={{ background: panel.bg, opacity: i === 0 ? 1 : 0 }}
          >
            <div className="absolute inset-x-0 top-0 flex items-center justify-between p-6 lg:p-10">
              <span className="font-label text-[13px] text-white/60">({panel.index})</span>
              <span className="font-label text-[13px] text-white/60">Explore Services</span>
            </div>

            <div className="mx-auto w-full max-w-6xl">
              <h2
                className="text-[40px] font-semibold leading-tight text-white sm:text-[56px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {panel.headingBold} <span className="italic">{panel.headingItalic}</span>
              </h2>

              <div className="relative mt-10 w-fit -rotate-2 rounded-2xl bg-white p-3 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.5)]">
                <div className="relative h-[280px] w-[320px] overflow-hidden rounded-xl border border-white/10 bg-tertiary sm:h-[320px] sm:w-[380px]">
                  <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
                  <div
                    className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                    style={{ background: `radial-gradient(circle, ${panel.accent}, transparent 70%)` }}
                  />
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70">
                    {panel.icon}
                  </span>
                </div>
                <p className="mt-3 px-1 pb-1 text-[13px] font-semibold uppercase tracking-wide text-tertiary">
                  {panel.caption}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
