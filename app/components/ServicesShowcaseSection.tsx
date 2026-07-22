"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Panel = {
  index: string;
  headingBold: string;
  headingItalic: string;
  caption: string;
  kicker: string;
  bg: string;
  accent: string;
  image?: string;
  icon: React.ReactNode;
};

const panels: Panel[] = [
  {
    index: "01",
    headingBold: "Virtual Reality",
    headingItalic: "Experiences",
    caption: "Step Inside The Experience",
    kicker: "Full Immersion",
    bg: "#04211d",
    accent: "#14b8a6",
    image: "/images/services/vr-experiences.jpg",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 9a3 3 0 0 1 3-3h10a3 3 0 0 1 3 3v3a3 3 0 0 1-3 3h-2.2a1.5 1.5 0 0 0-1.3.75l-.5.75a1.5 1.5 0 0 1-2 0l-.5-.75A1.5 1.5 0 0 0 9.2 15H7a3 3 0 0 1-3-3V9Z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
        <circle cx="8.5" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
        <circle cx="15.5" cy="10.5" r="1.3" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    index: "02",
    headingBold: "Augmented Reality",
    headingItalic: "Solutions",
    caption: "Blending Digital With Real",
    kicker: "Real-World Overlay",
    bg: "#0b1d3a",
    accent: "#3b82f6",
    image: "/images/services/ar-solutions.jpg",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 8V6a1 1 0 0 1 1-1h2M20 8V6a1 1 0 0 0-1-1h-2M4 16v2a1 1 0 0 0 1 1h2M20 16v2a1 1 0 0 1-1 1h-2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <rect x="9" y="9" width="6" height="6" rx="1" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    index: "03",
    headingBold: "Architectural",
    headingItalic: "Visualization",
    caption: "Interior, Exterior & Landscape — Visualized Before You Build",
    kicker: "Design, Rendered Real",
    bg: "#1e1033",
    accent: "#7c3aed",
    image: "/images/services/architectural-visualization.jpg",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 21V6l7-3 7 3v15M9 21v-6h6v6"
          stroke="currentColor"
          strokeWidth="1.4"
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
    kicker: "Built To Impress",
    bg: "#2a1a05",
    accent: "#f59e0b",
    image: "/images/services/experience-center.jpg",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <path
          d="M4 4h7v7H4zM13 4h7v4h-7zM13 11h7v9h-7zM4 14h7v7H4z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    index: "05",
    headingBold: "Virtual Content",
    headingItalic: "Production",
    caption: "Stories That Move Decisions",
    kicker: "3D & VR Storytelling",
    bg: "#2a0a12",
    accent: "#e11d48",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
        <rect x="2.5" y="6" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M16.5 10.5l5-2.7v8.4l-5-2.7" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function ServicesShowcaseSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<(HTMLDivElement | null)[]>([]);
  const imageRefs = useRef<(HTMLImageElement | null)[]>([]);
  const dotRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  // Cached document-relative top, so scroll doesn't force a layout read via
  // getBoundingClientRect() on every frame (see VideoSection for why that jank-causing
  // pattern was removed there too).
  const topRef = useRef(0);

  useEffect(() => {
    let ticking = false;

    function measure() {
      const container = containerRef.current;
      if (!container) return;
      topRef.current = container.getBoundingClientRect().top + window.scrollY;
    }

    function update() {
      ticking = false;
      const viewportHeight = window.innerHeight;
      const scrolled = Math.max(0, window.scrollY - topRef.current);
      const progress = scrolled / viewportHeight;
      const activeIndex = Math.min(panels.length - 1, Math.round(progress));

      panelRefs.current.forEach((panel, i) => {
        if (!panel) return;
        const distance = Math.min(Math.abs(progress - i), 1);
        const opacity = 1 - distance;
        panel.style.opacity = String(opacity);
        panel.style.transform = `translateY(${distance * 24}px)`;
        panel.style.pointerEvents = opacity > 0.5 ? "auto" : "none";
        // All 5 panels are mounted at once (for the cross-fade), and each
        // runs a continuous 16s Ken Burns zoom plus a mix-blend-overlay grain
        // layer. Left running on every panel simultaneously regardless of
        // visibility, that's 4-5 concurrently animating full-viewport images
        // — pausing the ones that are essentially invisible removes most of
        // that cost and was the main source of jank scrolling through this
        // section.
        const image = imageRefs.current[i];
        if (image) image.style.animationPlayState = opacity < 0.05 ? "paused" : "running";
      });

      dotRefs.current.forEach((dot, i) => {
        if (!dot) return;
        const active = i === activeIndex;
        dot.style.height = active ? "28px" : "8px";
        dot.style.opacity = active ? "1" : "0.35";
        dot.style.background = active ? panels[activeIndex].accent : "#ffffff";
      });

      if (barRef.current) {
        const overall = Math.min(1, Math.max(0, progress / (panels.length - 1)));
        barRef.current.style.width = `${overall * 100}%`;
        barRef.current.style.background = panels[activeIndex].accent;
      }
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      measure();
      onScroll();
    }

    measure();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
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
            className="absolute inset-0 flex flex-col justify-end will-change-transform"
            style={{ opacity: i === 0 ? 1 : 0 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              {panel.image ? (
                <Image
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  src={panel.image}
                  alt={`${panel.headingBold} ${panel.headingItalic}`}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="animate-kenburns object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(120% 90% at 50% 30%, ${panel.accent}33, ${panel.bg} 70%)` }}
                >
                  <div className="bg-grid absolute inset-0 opacity-[0.12]" />
                  <span
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.14]"
                    style={{ color: panel.accent }}
                  >
                    <svg width="360" height="360" viewBox="0 0 24 24" fill="none">
                      <rect x="2.5" y="6" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="0.6" />
                      <path d="M16.5 10.5l5-2.7v8.4l-5-2.7" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" />
                    </svg>
                  </span>
                </div>
              )}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background: `linear-gradient(180deg, ${panel.bg}b3 0%, ${panel.bg}40 32%, ${panel.bg}00 52%, ${panel.bg}e6 92%)`,
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 mix-blend-overlay"
                style={{ background: `radial-gradient(120% 90% at 85% 100%, ${panel.accent}55, transparent 65%)` }}
              />
              <div className="grain pointer-events-none absolute inset-0 opacity-[0.05] mix-blend-overlay" />
            </div>

            <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between p-6 lg:p-10">
              <span className="font-label text-[13px] tracking-wide text-white/70">
                (<span className="font-numeric">{panel.index}</span> /{" "}
                <span className="font-numeric">{String(panels.length).padStart(2, "0")}</span>)
              </span>
              <span className="font-label hidden text-[13px] tracking-wide text-white/70 sm:block">
                Explore Services
              </span>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-16 lg:px-16 lg:pb-24">
              <div className="flex items-center gap-3">
                <span
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border"
                  style={{ borderColor: `${panel.accent}66`, color: panel.accent, background: `${panel.accent}1a` }}
                >
                  {panel.icon}
                </span>
                <span
                  className="font-label text-[12px] font-medium uppercase tracking-[0.18em]"
                  style={{ color: panel.accent }}
                >
                  {panel.kicker}
                </span>
              </div>

              <h2
                className="mt-5 max-w-3xl text-[42px] font-semibold leading-[0.98] text-white sm:text-[64px] lg:text-[76px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {panel.headingBold}
                <br />
                <span className="italic" style={{ color: panel.accent }}>
                  {panel.headingItalic}
                </span>
              </h2>

              <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <p className="text-[15px] font-medium text-white/80 sm:text-[16px]">{panel.caption}</p>

                <button
                  type="button"
                  className="group inline-flex items-center gap-2.5 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-tertiary shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] transition-all duration-300 ease-out hover:scale-[1.04] hover:pr-2 hover:shadow-[0_24px_60px_-15px_rgba(0,0,0,0.7)] active:scale-[0.97]"
                >
                  Explore Service
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1"
                    style={{ background: panel.accent }}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17 17 7M9 7h8v8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
              </div>
            </div>
          </div>
        ))}

        <div className="pointer-events-none absolute inset-y-0 right-6 z-20 hidden flex-col items-center justify-center gap-2.5 lg:flex lg:right-10">
          {panels.map((p, dotIndex) => (
            <span
              key={p.index}
              ref={(el) => {
                dotRefs.current[dotIndex] = el;
              }}
              className="w-[3px] rounded-full transition-[height,opacity] duration-300 ease-out"
              style={{ height: dotIndex === 0 ? "28px" : "8px", background: "#ffffff", opacity: dotIndex === 0 ? 1 : 0.35 }}
            />
          ))}
        </div>

        <div className="absolute inset-x-0 bottom-0 z-20 h-[3px] bg-white/10">
          <div ref={barRef} className="h-full transition-[width] duration-150 ease-out" style={{ width: "0%" }} />
        </div>
      </div>
    </section>
  );
}
