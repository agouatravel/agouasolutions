"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { ServiceCard } from "./ServiceCard";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const SERVICES = [
  {
    title: "Virtual Reality Solutions",
    description:
      "Immersive VR experiences that transform ideas, spaces, and concepts into interactive digital environments for simulation, presentation, and decision-making.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <path
          d="M4 9a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2.5a2 2 0 0 1-1.6-.8L12 14l-1.9 2.2a2 2 0 0 1-1.6.8H6a2 2 0 0 1-2-2Z"
          stroke="currentColor"
          strokeWidth={1.4}
        />
        <circle cx={9} cy={12} r={1.2} fill="currentColor" />
        <circle cx={15} cy={12} r={1.2} fill="currentColor" />
      </svg>
    ),
  },
  {
    title: "Architectural Visualization",
    description:
      "High-end 3D visualization and photorealistic renders for interior, exterior, and landscape design — enabling clients to experience spaces before they're built.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.4} />
        <path
          d="M15.5 8.5 13 13l-4.5 2.5L11 11Z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    title: "Virtual Tours & Experience Centers",
    description:
      "Interactive virtual tours, showrooms, and experience centers that transform how organizations present projects and engage their audiences.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none">
        <rect x={3} y={8} width={18} height={9} rx={4} stroke="currentColor" strokeWidth={1.4} />
        <path d="M8 11v3M6.5 12.5h3" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
        <circle cx={16} cy={11.5} r={0.9} fill="currentColor" />
        <circle cx={18} cy={13.5} r={0.9} fill="currentColor" />
      </svg>
    ),
  },
];

export function ServicesSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative overflow-hidden bg-brand-navy px-8 py-24 sm:px-16 sm:py-32"
    >
      <AmbientGlow />
      <div className="relative z-10 mx-auto max-w-6xl">
        <div data-reveal className="mb-16 flex items-end justify-between">
          <h2 className="text-4xl font-semibold uppercase tracking-tight text-neutral-50 sm:text-5xl">
            Our Service
          </h2>
          <div className="hidden items-center gap-3 sm:flex">
            <button
              type="button"
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 text-white/70 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30 hover:text-brand-teal"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              type="button"
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 text-white/70 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30 hover:text-brand-teal"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
                <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {SERVICES.map((service) => (
            <ServiceCard key={service.title} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
}
