"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AboutImagePlaceholder } from "./AboutImagePlaceholder";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const TAGS = ["Virtual Reality", "3D Visualization", "Architecture"];

export function AboutSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative overflow-hidden bg-brand-navy px-8 pb-24 pt-10 sm:px-16 sm:pb-32 sm:pt-14"
    >
      <AmbientGlow />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div data-reveal>
          <AboutImagePlaceholder />
        </div>

        <div data-reveal className="flex flex-col gap-8">
          <p className="text-xs font-medium tracking-[0.4em] text-white/50">
            WHO WE ARE
          </p>

          <h2 className="text-4xl font-semibold uppercase leading-[1.1] tracking-tight text-neutral-50 sm:text-5xl">
            Creating the Future
            <br />
            of Immersive Experiences
          </h2>

          <div className="flex flex-wrap items-center gap-3">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 px-4 py-1.5 text-xs text-white/80 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30"
              >
                {tag}
              </span>
            ))}
          </div>

          <p className="max-w-md text-sm leading-relaxed text-white/60">
            AGOUA delivers world-class Virtual Reality and advanced digital
            solutions that redefine how organizations present, experience,
            and interact with their ideas — transforming visions into
            compelling experiences that inspire, influence, and create
            lasting impact.
          </p>

          <div className="flex items-center gap-6">
            <a
              href="#services"
              className="rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 px-6 py-3 text-sm font-medium text-neutral-50 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30"
            >
              Learn More
            </a>
            <a
              href="#"
              className="group flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-neutral-50"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors group-hover:border-brand-teal/40 group-hover:bg-brand-navy-light/30">
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                  <path d="M8 5v14l11-7Z" />
                </svg>
              </span>
              Watch a Video
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
