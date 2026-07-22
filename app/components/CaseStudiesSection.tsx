"use client";

import { useRef } from "react";
import Image from "next/image";
import Reveal from "./motion/Reveal";
import BeforeAfterSlider from "./motion/BeforeAfterSlider";

type CaseStudy = {
  client: string;
  project: string;
  category: string;
  monogram: string;
  accent: string;
  description: string;
  image: string;
  featured?: boolean;
  beforeAfter?: boolean;
};

const caseStudies: CaseStudy[] = [
  {
    client: "Nova Realty",
    project: "VR Property Showroom",
    category: "Virtual Reality",
    monogram: "NR",
    accent: "#14b8a6",
    description:
      "A virtual reality showroom letting buyers walk through Nova Realty developments before a single brick is laid.",
    image: "/images/case-studies/nova-realty.jpg",
    beforeAfter: true,
  },
  {
    client: "Zenith Towers",
    project: "Interactive Sales Suite",
    category: "Product Visualization",
    monogram: "ZT",
    accent: "#3b82f6",
    description:
      "An interactive sales suite that turns floor plans into a live, explorable 3D experience for Zenith Towers.",
    image: "/images/case-studies/zenith-towers.jpg",
  },
  {
    client: "Falcon Retail",
    project: "AR Shopping Experience",
    category: "Augmented Reality",
    monogram: "FR",
    accent: "#7c3aed",
    description: "An AR shopping experience letting Falcon Retail customers preview products in their own space.",
    image: "/images/case-studies/falcon-retail.jpg",
  },
  {
    client: "Vertex Living",
    project: "Digital Twin Showcase",
    category: "Digital Twin",
    monogram: "VL",
    accent: "#f59e0b",
    description:
      "A live digital twin of Vertex Living's flagship property, updated in real time for remote tours.",
    image: "/images/case-studies/vertex-living.jpg",
  },
  {
    client: "Halo Retail",
    project: "Flagship Launch Activation",
    category: "Event Activation",
    monogram: "HR",
    accent: "#14b8a6",
    description:
      "An immersive launch activation that turned Halo Retail's flagship opening into a fully interactive event.",
    image: "/images/case-studies/halo-retail.jpg",
    featured: true,
  },
  {
    client: "Skyline Group",
    project: "Experience Center Build-Out",
    category: "Experience Center",
    monogram: "SG",
    accent: "#14b8a6",
    description:
      "A dedicated experience center built for Skyline Group to showcase every project in one immersive space.",
    image: "/images/case-studies/skyline-group.jpg",
  },
  {
    client: "Cedar Exhibits",
    project: "Immersive Trade Show Booth",
    category: "Event Activation",
    monogram: "CE",
    accent: "#3b82f6",
    description:
      "An immersive trade show booth that gave Cedar Exhibits a standout, fully interactive presence on the floor.",
    image: "/images/case-studies/cedar-exhibits.jpg",
  },
  {
    client: "Orbit Expo",
    project: "Training Simulation Platform",
    category: "Training Simulation",
    monogram: "OE",
    accent: "#7c3aed",
    description:
      "A VR training simulation platform built to onboard Orbit Expo staff faster, with zero physical setup.",
    image: "/images/case-studies/orbit-expo.jpg",
  },
];

// Subtle cursor-driven 3D tilt, clamped to a few degrees — reads as a premium
// hover response rather than a gimmick, and never touches color.
const TILT_MAX_DEG = 5;

function useTilt() {
  const ref = useRef<HTMLDivElement>(null);
  // Cached once per hover instead of read on every mousemove — the repeated
  // getBoundingClientRect() calls were forcing a synchronous layout on every
  // single mouse move, which is what made the hover feel janky.
  const rectRef = useRef<DOMRect | null>(null);
  const pendingRef = useRef<{ px: number; py: number } | null>(null);
  const rafRef = useRef<number | null>(null);

  const applyTilt = () => {
    rafRef.current = null;
    const el = ref.current;
    const pending = pendingRef.current;
    if (!el || !pending) return;
    el.style.transform = `perspective(900px) rotateX(${(-pending.py * TILT_MAX_DEG).toFixed(2)}deg) rotateY(${(pending.px * TILT_MAX_DEG).toFixed(2)}deg) translateY(-4px)`;
  };

  const handleMouseEnter = () => {
    rectRef.current = ref.current?.getBoundingClientRect() ?? null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = rectRef.current;
    if (!rect) return;
    pendingRef.current = {
      px: (e.clientX - rect.left) / rect.width - 0.5,
      py: (e.clientY - rect.top) / rect.height - 0.5,
    };
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(applyTilt);
    }
  };

  const handleMouseLeave = () => {
    rectRef.current = null;
    pendingRef.current = null;
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    if (ref.current) ref.current.style.transform = "";
  };

  return { ref, handleMouseEnter, handleMouseMove, handleMouseLeave };
}

function CaseStudyCard({ study, index }: { study: CaseStudy; index: number }) {
  const { ref, handleMouseEnter, handleMouseMove, handleMouseLeave } = useTilt();
  const sizeClass = study.featured ? "aspect-[16/9]" : "aspect-[4/3]";
  const indexLabel = String(index + 1).padStart(2, "0");

  if (study.beforeAfter) {
    return (
      <Reveal delay={index * 90}>
        <div>
          <div
            className={`relative overflow-hidden rounded-2xl border border-border-hairline bg-surface shadow-[0_20px_50px_-30px_rgba(5,11,24,0.4)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-1.5 hover:shadow-[0_30px_60px_-30px_rgba(5,11,24,0.5)] ${sizeClass}`}
          >
            <BeforeAfterSlider
              afterSrc={study.image}
              afterAlt={`${study.client} — ${study.project}`}
              accent={study.accent}
              className="h-full w-full"
            />
          </div>
          <div className="mt-4 flex items-start justify-between gap-3">
            <div>
              <p className="font-display text-[15px] font-semibold text-foreground">{study.project}</p>
              <p className="mt-0.5 text-[13px] text-muted">{study.category}</p>
            </div>
            <span className="font-numeric shrink-0 text-[13px] text-muted/40">{indexLabel}</span>
          </div>
        </div>
      </Reveal>
    );
  }

  return (
    <Reveal delay={index * 90}>
      <div className={study.featured ? "sm:col-span-2" : undefined}>
        <div
          ref={ref}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          style={{ transformStyle: "preserve-3d" }}
          className={`group relative overflow-hidden rounded-2xl border shadow-[0_20px_50px_-30px_rgba(5,11,24,0.4)] transition-[transform,box-shadow] duration-300 ease-out will-change-transform hover:shadow-[0_30px_60px_-30px_rgba(5,11,24,0.5)] ${
            study.featured ? "border-white/10 bg-tertiary" : "border-border-hairline bg-surface"
          } ${sizeClass}`}
        >
          <Image
            src={study.image}
            alt={`${study.client} — ${study.project}`}
            fill
            sizes="(min-width: 640px) 33vw, 50vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
          <div
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(180deg, transparent 45%, rgba(5,11,24,0.65) 100%)" }}
          />

          <span className="font-label absolute left-3 top-3 rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-wide text-white/80 backdrop-blur-sm">
            {study.category}
          </span>
          <span className="font-numeric absolute right-3 top-3 flex h-9 w-9 select-none items-center justify-center rounded-full bg-black/30 text-[12px] font-semibold text-white/80 backdrop-blur-sm">
            {indexLabel}
          </span>

          {/* Solid fill instead of backdrop-blur — blurring a layer while it's
              also being translated forces a re-composite of everything behind
              it every frame, which was the other big source of hover jank. */}
          <div className="absolute inset-0 flex translate-y-full transform-gpu flex-col justify-between bg-tertiary/85 p-6 transition-transform duration-300 ease-out will-change-transform group-hover:translate-y-0">
            <p className="text-[13px] leading-relaxed text-white opacity-0 transition-opacity delay-300 duration-300 ease-out group-hover:opacity-100">
              {study.description}
            </p>

            <div className="group/cta flex w-fit cursor-pointer items-center gap-3 opacity-0 transition-opacity delay-500 duration-300 ease-out group-hover:opacity-100">
              <span className="relative text-[13px] font-medium text-white">
                View Project
                <span className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-white transition-transform duration-300 ease-out group-hover/cta:scale-x-100" />
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-tertiary transition-transform duration-300 ease-out group-hover/cta:scale-110 group-hover/cta:translate-x-1">
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
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="font-display text-[15px] font-semibold text-foreground">{study.project}</p>
            <p className="mt-0.5 text-[13px] text-muted">{study.client}</p>
          </div>
        </div>
      </div>
    </Reveal>
  );
}

function CaseStudyRow({ studies, startIndex }: { studies: CaseStudy[]; startIndex: number }) {
  return (
    <div className="grid grid-cols-2 items-start gap-x-6 gap-y-10 sm:grid-cols-3">
      {studies.map((study, i) => (
        <CaseStudyCard key={study.client} study={study} index={startIndex + i} />
      ))}
    </div>
  );
}

export default function CaseStudiesSection() {
  const rows = [caseStudies.slice(0, 3), caseStudies.slice(3, 5), caseStudies.slice(5, 8)];

  return (
    <section className="relative z-10 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="text-[28px] font-semibold leading-tight text-foreground sm:text-[36px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Featured <span className="italic">Case Studies</span>
          </h2>

          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-tertiary py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-white transition-all duration-300 ease-out hover:scale-[1.04] hover:opacity-90 hover:shadow-lg active:scale-[0.97]"
          >
            View all
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-tertiary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
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
        </Reveal>

        <div className="mt-12 flex flex-col gap-10 sm:gap-14">
          {rows.map((row, i) => {
            const startIndex = rows.slice(0, i).reduce((sum, r) => sum + r.length, 0);
            return <CaseStudyRow key={i} studies={row} startIndex={startIndex} />;
          })}
        </div>
      </div>
    </section>
  );
}
