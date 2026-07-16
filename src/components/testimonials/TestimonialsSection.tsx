"use client";

import { useId } from "react";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { TestimonialCard } from "./TestimonialCard";
import { ConnectorLine } from "./ConnectorLine";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const TESTIMONIALS = [
  {
    quote:
      "AGOUA's virtual tours let our buyers walk through units before a single wall was built — it completely changed how we sell off-plan.",
    name: "Real Estate Developer",
  },
  {
    quote:
      "The architectural visualizations were precise enough to catch design issues we would have only found on site.",
    name: "Architecture Firm Principal",
  },
  {
    quote:
      "Integrating the virtual walkthrough with our CRM gave us real data on which units buyers actually cared about.",
    name: "Sales & Marketing Director",
  },
];

export function TestimonialsSection() {
  const sectionRef = useScrollReveal<HTMLElement>();
  const gradientId = useId();

  return (
    <section ref={sectionRef} className="relative overflow-hidden bg-brand-navy px-8 py-24 sm:px-16 sm:py-32">
      <AmbientGlow />
      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div data-reveal className="flex flex-col gap-6">
          <h2 className="text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-neutral-50 sm:text-5xl">
            Voices of the
            <br />
            Future
          </h2>
          <svg
            aria-hidden
            viewBox="0 0 400 4"
            preserveAspectRatio="none"
            className="h-1 w-full max-w-md text-white/70"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="currentColor" stopOpacity={0} />
                <stop offset="100%" stopColor="currentColor" stopOpacity={1} />
              </linearGradient>
            </defs>
            <line
              x1={4}
              y1={2}
              x2={396}
              y2={2}
              stroke={`url(#${gradientId})`}
              strokeWidth={2}
              strokeLinecap="round"
            />
          </svg>
          <p className="max-w-sm text-sm leading-relaxed text-white/50">
            Here&apos;s what real estate developers, architects, and
            marketing teams say about working with AGOUA — and how immersive
            technology is changing the way they present, sell, and validate
            their projects.
          </p>
        </div>

        <div className="relative flex flex-col gap-6">
          <ConnectorLine />
          {TESTIMONIALS.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </div>
    </section>
  );
}
