"use client";

import { motion } from "framer-motion";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

export function DiveSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden bg-brand-navy px-8 pb-24 sm:px-16 sm:pb-32"
    >
      <AmbientGlow />
      <div
        data-reveal
        className="relative mx-auto flex aspect-[16/9] w-full max-w-6xl items-end overflow-hidden rounded-3xl border border-brand-navy-light/30 bg-brand-navy-light/20 p-8 shadow-xl shadow-brand-navy/30 backdrop-blur-md sm:aspect-[21/9] sm:p-14"
      >
        <div className="absolute inset-0 flex items-center justify-center text-white/25">
          <p className="max-w-xs px-6 text-center text-xs leading-relaxed">
            Full-width banner photo goes here
            <br />
            Drop it at{" "}
            <code className="text-[11px] text-white/50">
              public/dive-banner.jpg
            </code>
          </p>
        </div>

        <div className="relative z-10 flex w-full flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-neutral-50 sm:text-5xl">
            Dive Into the
            <br />
            Future
          </h2>

          <div className="flex items-center gap-4 sm:max-w-sm">
            <motion.span
              whileHover={{ scale: 1.08 }}
              animate={{ scale: [1, 1.06, 1] }}
              transition={{ scale: { duration: 2.4, repeat: Infinity, ease: "easeInOut" } }}
              className="flex h-12 w-12 shrink-0 cursor-pointer items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 text-white shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4 translate-x-0.5" fill="currentColor">
                <path d="M8 5v14l11-7Z" />
              </svg>
            </motion.span>
            <p className="text-xs leading-relaxed text-white/50">
              Step into AGOUA&apos;s immersive digital world. Explore
              limitless possibilities in Virtual Reality, architectural
              visualization, and interactive experiences built to bring
              your vision to life.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
