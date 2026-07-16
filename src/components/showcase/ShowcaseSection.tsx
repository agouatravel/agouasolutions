"use client";

import { useState } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ShowcaseImagePlaceholder } from "./ShowcaseImagePlaceholder";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const TABS = ["Innovation", "Technology", "Experience"];

export function ShowcaseSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const [activeTab, setActiveTab] = useState(TABS[0]);

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-navy px-8 py-24 sm:px-16 sm:py-32">
      <AmbientGlow />
      <div className="relative z-10 mx-auto max-w-6xl">
        <h2
          data-reveal
          className="mb-16 text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-neutral-50 sm:text-6xl"
        >
          Shaping the Visual
          <br />
          and Digital Future
        </h2>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[160px_1fr_1fr]">
          <div data-reveal className="flex flex-row gap-6 lg:flex-col lg:gap-4">
            {TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`text-left text-sm transition-colors ${
                  tab === activeTab
                    ? "font-medium text-neutral-50"
                    : "text-white/40 hover:text-white/70"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div data-reveal>
            <ShowcaseImagePlaceholder />
          </div>

          <div data-reveal className="flex flex-col gap-5">
            <h3 className="text-2xl font-medium leading-snug text-neutral-50">
              How We Bring
              <br />
              Visions to Life
            </h3>
            <p className="max-w-sm text-sm leading-relaxed text-white/50">
              Elevating presentation and design standards by delivering
              integrated VR, architectural, and digital content solutions
              that transform complex ideas into immersive, interactive
              experiences.
            </p>
            <a
              href="#services"
              className="text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-brand-teal"
            >
              Learn More
            </a>

            <div className="mt-8 flex items-center justify-between border-t border-brand-navy-light/20 pt-6 text-xs text-white/40">
              <span>AGOUA Digital Studio</span>
              <span className="text-neutral-50">Riyadh, KSA</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
