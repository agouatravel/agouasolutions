"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";

const CONTACT_DETAILS = [
  {
    label: "Email",
    value: "info@agouasolutions.com",
    href: "mailto:info@agouasolutions.com",
  },
  {
    label: "Phone",
    value: "+966 54 567 1133",
    href: "tel:+966545671133",
  },
  {
    label: "Location",
    value: "Riyadh, Saudi Arabia",
    href: undefined,
  },
  {
    label: "Website",
    value: "agouasolutions.com",
    href: "https://www.agouasolutions.com",
  },
];

export function ContactSection() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="bg-brand-navy px-8 py-24 sm:px-16 sm:py-32"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-16 lg:grid-cols-2">
        <div data-reveal className="flex flex-col gap-6">
          <p className="text-xs font-medium tracking-[0.4em] text-white/50">
            GET IN TOUCH
          </p>
          <h2 className="text-4xl font-semibold uppercase leading-[1.05] tracking-tight text-neutral-50 sm:text-5xl">
            Let&apos;s Create the
            <br />
            Future Together
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-white/50">
            Thank you for taking the time to explore AGOUA. We look forward
            to building a strong partnership and delivering immersive
            solutions that redefine how ideas are experienced and
            communicated.
          </p>
          <a
            href="mailto:info@agouasolutions.com"
            className="mt-2 inline-flex w-fit items-center rounded-full border border-white/15 bg-white/10 px-6 py-3 text-sm font-medium text-neutral-50 shadow-lg shadow-black/20 backdrop-blur-md transition-colors hover:bg-brand-teal hover:text-brand-navy"
          >
            Email Us
          </a>
        </div>

        <div data-reveal className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {CONTACT_DETAILS.map((detail) => (
            <div
              key={detail.label}
              className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20 backdrop-blur-md"
            >
              <p className="text-xs tracking-[0.2em] text-white/40">
                {detail.label.toUpperCase()}
              </p>
              {detail.href ? (
                <a
                  href={detail.href}
                  className="mt-2 block text-sm font-medium text-neutral-50 transition-colors hover:text-brand-teal"
                >
                  {detail.value}
                </a>
              ) : (
                <p className="mt-2 text-sm font-medium text-neutral-50">
                  {detail.value}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
