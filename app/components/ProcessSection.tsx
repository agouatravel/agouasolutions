"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Reveal from "./motion/Reveal";

type Step = {
  step: string;
  phase: string;
  title: string;
  description: string;
  accent: string;
  icon: React.ReactNode;
};

const steps: Step[] = [
  {
    step: "Step 1",
    phase: "Discover",
    title: "Define The Experience Goal",
    description:
      "We start by understanding your goals, audience, and the immersive experience that will make the biggest impact.",
    accent: "#14b8a6",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.2" />
        <path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    step: "Step 2",
    phase: "Design",
    title: "Prototype The Experience",
    description:
      "We block out the experience flow and build an early VR/AR prototype before full production begins.",
    accent: "#3b82f6",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 20l1-4.5L15.5 5 19 8.5 8.5 19 4 20Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <path d="M13 7l4 4" stroke="currentColor" strokeWidth="1.2" />
      </svg>
    ),
  },
  {
    step: "Step 3",
    phase: "Build",
    title: "Develop & Integrate",
    description: "Our team builds the full experience and integrates hardware, content, and on-site systems.",
    accent: "#7c3aed",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path
          d="M14.7 6.3a3 3 0 0 0-4.1 3.5L4 16.4V20h3.6l6.6-6.6a3 3 0 0 0 3.5-4.1l-2 2-1.9-.5-.5-1.9 2-2Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    step: "Step 4",
    phase: "Deploy",
    title: "Launch & Support",
    description: "We install on-site, run final QA, and stay on to support the experience after launch.",
    accent: "#f59e0b",
    icon: (
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
        <path
          d="M12 3c2.5 2 4 5.5 4 9 0 1.8-.4 3.3-1 4.5l-3-1.8-3 1.8c-.6-1.2-1-2.7-1-4.5 0-3.5 1.5-7 4-9Z"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinejoin="round"
        />
        <circle cx="12" cy="10.5" r="1.4" stroke="currentColor" strokeWidth="1.2" />
        <path d="M9 17.5 7 21M15 17.5l2 3.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

const TRIGGER_FRACTION = 0.4;

const ChevronMarker = forwardRef<HTMLSpanElement, { active: boolean }>(function ChevronMarker(
  { active },
  ref
) {
  return (
    <span
      ref={ref}
      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
        active
          ? "border-primary bg-primary shadow-[0_0_0_4px_rgba(20,184,166,0.18)]"
          : "border-border-hairline bg-background"
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 9l6 6 6-6"
          stroke={active ? "white" : "#9aa2b1"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
});

export default function ProcessSection() {
  const listRef = useRef<HTMLDivElement>(null);
  const markerRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const bgLineRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let ticking = false;

    // Marker positions are re-measured on every frame (cheap: only 4 elements)
    // instead of cached once, so the line never drifts out of sync with the
    // actual DOM if a layout shift happens after mount.
    function update() {
      ticking = false;
      const list = listRef.current;
      const fillLine = fillLineRef.current;
      const bgLine = bgLineRef.current;
      const markers = markerRefs.current;
      if (!list || !fillLine || !bgLine || markers.some((m) => !m)) return;

      const listRect = list.getBoundingClientRect();
      const offsets = markers.map((marker) => marker!.getBoundingClientRect().top - listRect.top + marker!.offsetHeight / 2);
      // Tuck the line a few px under the marker (which sits above it via z-index)
      // rather than stopping exactly at its edge, so the glow ring around the
      // active marker never leaves a visible gap before the line starts.
      const inset = markers[0]!.offsetHeight / 2 - 4;
      const left = markers[0]!.getBoundingClientRect().left - listRect.left + markers[0]!.offsetWidth / 2;

      const first = offsets[0] + inset;
      const last = offsets[offsets.length - 1] - inset;

      bgLine.style.left = `${left}px`;
      bgLine.style.top = `${first}px`;
      bgLine.style.height = `${Math.max(last - first, 0)}px`;
      fillLine.style.left = `${left}px`;
      fillLine.style.top = `${first}px`;

      const triggerY = window.innerHeight * TRIGGER_FRACTION;
      const localProgress = triggerY - listRect.top;
      const filled = Math.min(Math.max(localProgress - first, 0), last - first);
      fillLine.style.height = `${filled}px`;

      let nextActive = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (localProgress >= offsets[i]) nextActive = i;
      }
      setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));
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
    <section className="relative z-10 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <h2
            className="text-[28px] font-semibold leading-tight text-foreground sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A Faster Way To Design And
            <br />
            <span className="italic">Build Immersive Experiences</span>
          </h2>
          <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-muted">
            We simplify the delivery process for immersive projects by combining strategy, design, and
            production into one focused workflow built for faster launches.
          </p>
        </Reveal>

        <div ref={listRef} className="relative mt-16 sm:mt-20">
          <div ref={bgLineRef} className="absolute hidden w-[3px] -translate-x-1/2 rounded-full bg-border-hairline sm:block" />
          <div
            ref={fillLineRef}
            className="absolute hidden w-[3px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-primary to-primary/30 sm:block"
            style={{ height: 0 }}
          />

          {steps.map((item, i) => (
            <div
              key={item.step}
              className="grid grid-cols-[90px_24px_1fr] gap-4 py-6 first:pt-0 last:pb-0 sm:grid-cols-[110px_28px_1fr] sm:gap-6 lg:grid-cols-[110px_28px_1fr_240px] lg:gap-8"
            >
              <div className="flex flex-col items-start gap-2">
                <span className="font-label inline-flex items-center rounded-full bg-surface px-3 py-1 text-[11px] uppercase tracking-wide text-muted">
                  {item.step}
                </span>
                <span
                  className={`text-[20px] font-semibold italic transition-colors duration-300 sm:text-[22px] ${
                    i <= activeIndex ? "text-foreground" : "text-muted/50"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.phase}
                </span>
              </div>

              <div className="relative flex justify-center">
                <ChevronMarker
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  active={i <= activeIndex}
                />
              </div>

              <div>
                <h3
                  className={`text-[18px] font-semibold transition-colors duration-300 sm:text-[20px] ${
                    i <= activeIndex ? "text-foreground" : "text-muted/60"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p
                  className={`mt-2 max-w-md text-[14px] leading-relaxed transition-colors duration-300 ${
                    i <= activeIndex ? "text-muted" : "text-muted/40"
                  }`}
                >
                  {item.description}
                </p>
              </div>

              <div className="hidden lg:block">
                <div className="rounded-2xl border border-border-hairline bg-surface p-2 shadow-[0_20px_50px_-24px_rgba(5,11,24,0.35)]">
                  <div className="relative h-[130px] w-full overflow-hidden rounded-xl border border-white/10 bg-tertiary">
                    <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.08]" />
                    <div
                      className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
                      style={{ background: `radial-gradient(circle, ${item.accent}, transparent 70%)` }}
                    />
                    <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white/70">
                      {item.icon}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
