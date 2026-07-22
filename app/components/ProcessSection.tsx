"use client";

import { forwardRef, useEffect, useRef, useState } from "react";
import Reveal from "./motion/Reveal";
import StepIconImage from "./motion/StepIconImage";

type Step = {
  step: string;
  phase: string;
  title: string;
  description: string;
  iconSrc: string;
};

const steps: Step[] = [
  {
    step: "Step 1",
    phase: "Understanding",
    title: "Define The Vision & Requirements",
    description:
      "We define the client's vision, objectives, and project requirements to ensure complete alignment from the start.",
    iconSrc: "/steps%20icons/minimal-geometric-line-art-compass-icon--outer-rin.svg",
  },
  {
    step: "Step 2",
    phase: "Concept & Design",
    title: "Shape The Creative Direction",
    description:
      "We develop the creative and technical concept, translating ideas into structured immersive solutions and visual direction.",
    iconSrc: "/steps%20icons/minimal-geometric-line-art-icon-of-two-overlapping.svg",
  },
  {
    step: "Step 3",
    phase: "Development",
    title: "Build & Integrate The Experience",
    description:
      "We build high-quality 3D environments and integrate VR/AR technologies to create fully interactive experiences.",
    iconSrc: "/steps%20icons/minimal-geometric-line-art-vr-headset-icon--rounde.svg",
  },
  {
    step: "Step 4",
    phase: "Delivery",
    title: "Finalize & Deliver With Impact",
    description:
      "We finalize, optimize, and deliver the immersive solution in a presentation-ready format for seamless use and impact.",
    iconSrc: "/steps%20icons/minimal-geometric-line-art-rocket-icon--angled-sli.svg",
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
      className={`relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border bg-background transition-all duration-300 ${
        active
          ? "border-primary shadow-[0_0_0_4px_rgba(20,184,166,0.18)]"
          : "border-border-hairline"
      }`}
    >
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 9l6 6 6-6"
          stroke={active ? "var(--color-primary)" : "#9aa2b1"}
          strokeWidth="3.5"
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
  const iconRefs = useRef<(HTMLImageElement | null)[]>([]);
  const bgLineRef = useRef<HTMLDivElement>(null);
  const fillLineRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  // Marker/line geometry only changes on mount or resize, never on scroll.
  // Caching it here (instead of calling getBoundingClientRect() on the list and
  // all 4 markers every scroll frame) removes the layout-forcing reads that were
  // fighting the other scroll-linked sections' writes and causing jank.
  const geometryRef = useRef({ listTop: 0, offsets: [] as number[], first: 0, last: 0 });

  useEffect(() => {
    let ticking = false;

    function measure() {
      const list = listRef.current;
      const bgLine = bgLineRef.current;
      const fillLine = fillLineRef.current;
      const markers = markerRefs.current;
      if (!list || !bgLine || !fillLine || markers.some((m) => !m)) return;

      const listRect = list.getBoundingClientRect();
      const offsets = markers.map(
        (marker) => marker!.getBoundingClientRect().top - listRect.top + marker!.offsetHeight / 2
      );
      const left = markers[0]!.getBoundingClientRect().left - listRect.left + markers[0]!.offsetWidth / 2;

      // Line spans exactly from the first arrow marker to the last one.
      const first = offsets[0];
      const last = offsets[offsets.length - 1];

      geometryRef.current = { listTop: listRect.top + window.scrollY, offsets, first, last };

      bgLine.style.left = `${left}px`;
      bgLine.style.top = `${first}px`;
      bgLine.style.height = `${Math.max(last - first, 0)}px`;
      fillLine.style.left = `${left}px`;
      fillLine.style.top = `${first}px`;
    }

    function update() {
      ticking = false;
      const fillLine = fillLineRef.current;
      const { listTop, offsets, first, last } = geometryRef.current;
      if (!fillLine || offsets.length === 0) return;

      const listRectTop = listTop - window.scrollY;
      const triggerY = window.innerHeight * TRIGGER_FRACTION;
      const localProgress = triggerY - listRectTop;
      const filled = Math.min(Math.max(localProgress - first, 0), last - first);
      fillLine.style.height = `${filled}px`;

      let nextActive = 0;
      for (let i = 0; i < offsets.length; i++) {
        if (localProgress >= offsets[i]) nextActive = i;
        // Each icon "materializes" via a growing circular clip as the scroll
        // progress moves through that step's own slice of the timeline: it
        // starts empty exactly when this step activates and finishes right
        // before the next step's marker activates, instead of just popping in.
        const windowStart = offsets[i];
        const windowEnd = i === offsets.length - 1 ? offsets[i] + 260 : offsets[i + 1];
        const span = windowEnd - windowStart || 1;
        const iconProgress = Math.min(Math.max((localProgress - windowStart) / span, 0), 1);
        const icon = iconRefs.current[i];
        if (icon) icon.style.clipPath = `circle(${(iconProgress * 75).toFixed(1)}% at 50% 50%)`;
      }
      setActiveIndex((prev) => (prev === nextActive ? prev : nextActive));
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      measure();
      update();
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
    <section className="relative z-10 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
          <h2
            className="text-[20px] font-semibold leading-tight text-foreground sm:text-[24px]"
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

        <div ref={listRef} className="relative mt-12 sm:mt-14">
          <div ref={bgLineRef} className="absolute hidden w-[20px] -translate-x-1/2 rounded-full bg-border-hairline sm:block" />
          <div
            ref={fillLineRef}
            className="absolute hidden w-[20px] origin-top -translate-x-1/2 rounded-full bg-gradient-to-b from-primary to-primary/30 sm:block"
            style={{ height: 0 }}
          />

          {steps.map((item, i) => (
            <div
              key={item.step}
              className="grid grid-cols-[90px_24px_1fr] grid-rows-2 items-center gap-x-2 gap-y-1 py-1 first:pt-0 last:pb-0 sm:grid-cols-[110px_28px_1fr] sm:gap-x-3 lg:grid-cols-[110px_28px_1fr_220px] lg:gap-x-4"
            >
              <span className="font-label col-start-1 row-start-1 inline-flex w-fit items-center rounded-full bg-surface px-3 py-1 text-[11px] font-extrabold uppercase tracking-wide text-muted">
                Step <span className="font-numeric">{i + 1}</span>
              </span>

              <div className="relative col-start-2 row-start-1 flex items-center justify-center self-stretch">
                <ChevronMarker
                  ref={(el) => {
                    markerRefs.current[i] = el;
                  }}
                  active={i <= activeIndex}
                />
              </div>

              <h3
                className={`col-start-3 row-start-1 text-[14px] font-semibold transition-colors duration-300 sm:text-[15px] ${
                  i <= activeIndex ? "text-foreground" : "text-muted/60"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.title}
              </h3>

              <span
                className={`col-start-1 row-start-2 text-[16px] font-semibold italic transition-colors duration-300 sm:text-[18px] ${
                  i <= activeIndex ? "text-foreground" : "text-muted/50"
                }`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                {item.phase}
              </span>

              <p
                className={`col-start-3 row-start-2 max-w-md text-[13px] leading-relaxed transition-colors duration-300 ${
                  i <= activeIndex ? "text-muted" : "text-muted/40"
                }`}
              >
                {item.description}
              </p>

              <div className="col-start-4 row-span-2 row-start-1 hidden items-center justify-center lg:flex">
                <StepIconImage
                  ref={(el) => {
                    iconRefs.current[i] = el;
                  }}
                  src={item.iconSrc}
                  alt={item.phase}
                  size={128}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
