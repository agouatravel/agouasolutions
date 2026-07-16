"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { AgouaMark } from "@/components/brand/AgouaMark";
import { AmbientGlow } from "@/components/ui/AmbientGlow";

const SOCIAL_LINKS = [
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
        <path d="M6.94 8.5H3.56V20.5H6.94V8.5ZM5.25 3.5C4.15 3.5 3.25 4.4 3.25 5.5C3.25 6.6 4.15 7.5 5.25 7.5C6.35 7.5 7.25 6.6 7.25 5.5C7.25 4.4 6.35 3.5 5.25 3.5ZM20.5 20.5H17.13V14.6C17.13 13.2 17.1 11.4 15.16 11.4C13.2 11.4 12.9 12.92 12.9 14.5V20.5H9.53V8.5H12.76V10H12.81C13.26 9.15 14.36 8.25 16 8.25C19.4 8.25 20.5 10.48 20.5 13.4V20.5Z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <rect x={3.5} y={3.5} width={17} height={17} rx={5} stroke="currentColor" strokeWidth={1.4} />
        <circle cx={12} cy={12} r={4} stroke="currentColor" strokeWidth={1.4} />
        <circle cx={17} cy={7} r={1} fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "X",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
        <path d="M3 3l7.5 9.5L3.4 21H6l5.1-6.3L15.5 21H21l-7.9-10L20.4 3H17.8l-4.7 5.8L9 3H3Z" />
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: "#",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <rect x={3} y={6} width={18} height={12} rx={4} stroke="currentColor" strokeWidth={1.4} />
        <path d="M10.5 9.5v5l4.5-2.5Z" fill="currentColor" />
      </svg>
    ),
  },
];

const QUICK_LINKS = [
  { label: "Home", href: "#" },
  { label: "About", href: "#about" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const GET_IN_TOUCH = [
  { label: "Email Us", href: "mailto:info@agouasolutions.com" },
  { label: "Call Us", href: "tel:+966545671133" },
  { label: "Book a Consultancy", href: "#contact" },
];

const PARTNERS = [
  {
    label: "Logoipsum",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} />
        <circle cx={9} cy={11} r={1.1} fill="currentColor" />
        <circle cx={15} cy={11} r={1.1} fill="currentColor" />
        <path d="M8 15c1.5 1 6.5 1 8 0" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Logoipsum",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" stroke="currentColor" strokeWidth={1.4} strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    label: "Logoipsum",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <rect x={4} y={4} width={16} height={16} rx={4} stroke="currentColor" strokeWidth={1.4} />
        <path d="M9 9h6v6H9Z" stroke="currentColor" strokeWidth={1.4} />
      </svg>
    ),
  },
];

export function SiteFooter() {
  const sectionRef = useScrollReveal<HTMLElement>();

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative overflow-hidden bg-brand-navy px-8 pb-10 pt-24 sm:px-16 sm:pt-32"
    >
      <AmbientGlow />
      <div className="relative mx-auto max-w-6xl">
        <div data-reveal>
          <AgouaMark className="h-8 w-auto text-neutral-50" />
        </div>

        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 sm:grid-cols-3 lg:grid-cols-5">
          <div data-reveal className="flex flex-col gap-8">
            <div>
              <h3 className="text-sm font-semibold text-neutral-50">Email</h3>
              <a
                href="mailto:info@agouasolutions.com"
                className="mt-2 block text-sm text-white/50 transition-colors hover:text-brand-teal"
              >
                info@agouasolutions.com
              </a>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-neutral-50">Address</h3>
              <p className="mt-2 text-sm text-white/50">Riyadh, Saudi Arabia</p>
            </div>
          </div>

          <div data-reveal>
            <h3 className="text-sm font-semibold text-neutral-50">Phone Number</h3>
            <div className="mt-2 flex flex-col gap-3">
              <div>
                <p className="text-xs text-white/40">Motab Al Hajri</p>
                <a
                  href="tel:+966545671133"
                  className="text-sm text-white/50 transition-colors hover:text-brand-teal"
                >
                  +966 545 671 133
                </a>
              </div>
              <div>
                <p className="text-xs text-white/40">Fuad Sarhan</p>
                <a
                  href="tel:+966561659080"
                  className="text-sm text-white/50 transition-colors hover:text-brand-teal"
                >
                  +966 561 659 080
                </a>
              </div>
            </div>
          </div>

          <div data-reveal>
            <h3 className="text-sm font-semibold text-neutral-50">Quick Links</h3>
            <ul className="mt-2 flex flex-col gap-3">
              {QUICK_LINKS.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-brand-teal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal>
            <h3 className="text-sm font-semibold text-neutral-50">Get in Touch</h3>
            <ul className="mt-2 flex flex-col gap-3">
              {GET_IN_TOUCH.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-white/50 transition-colors hover:text-brand-teal"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-reveal className="col-span-2 sm:col-span-3 lg:col-span-1">
            <h3 className="text-lg font-medium uppercase leading-snug text-neutral-50">
              Immersive VR &amp;
              <br />
              Digital Experiences
            </h3>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-white/50">
              Merging art with technology to create extraordinary virtual
              worlds and designs that inspire the senses and embody our
              clients&apos; ambitions.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {SOCIAL_LINKS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 text-white/70 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30 hover:text-brand-teal"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-wrap items-center gap-x-10 gap-y-4 border-t border-brand-navy-light/20 pt-8">
          {PARTNERS.map((partner, index) => (
            <div key={index} className="flex items-center gap-2 text-white/30">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 text-white/50 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30">
                {partner.icon}
              </span>
              <span className="text-sm">{partner.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
