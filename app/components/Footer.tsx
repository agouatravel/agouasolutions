import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";

const serviceLinks = [
  "Virtual Reality Experiences",
  "Augmented Reality Solutions",
  "Architectural Visualization",
  "Experience Center Design",
];

const quickLinks = [
  { label: "Case Studies", href: "/case-studies" },
  { label: "About", href: "/about" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

const socialLinks = ["Instagram", "LinkedIn"];

function ArrowIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-tertiary">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div
        className="pointer-events-none absolute -top-1/3 left-1/4 h-[420px] w-[420px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
      />
      <div
        className="pointer-events-none absolute -bottom-1/3 right-1/4 h-[420px] w-[420px] rounded-full opacity-[0.1] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-10 pt-16 lg:px-8 lg:pt-20">
        <Reveal>
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/brand/agoua-logo.svg"
              alt="AGOUA Al-Samaa Co."
              width={220}
              height={51}
              className="h-9 w-auto brightness-0 invert"
            />
            <p className="mt-5 max-w-xs text-[14px] leading-relaxed text-white/50">
              World-class Virtual Reality, Augmented Reality, and architectural visualization
              solutions for ambitious brands.
            </p>
            <Link
              href="/contact"
              className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-tertiary transition hover:opacity-90"
            >
              Start A Project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tertiary text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <ArrowIcon />
              </span>
            </Link>
          </div>

          <div>
            <h3 className="italic text-[15px] font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Services
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {serviceLinks.map((label) => (
                <li key={label} className="cursor-default text-[14px] text-white/50 transition hover:text-white">
                  {label}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="italic text-[15px] font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Quick Links
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-[14px] text-white/50 transition hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="italic text-[15px] font-semibold text-white" style={{ fontFamily: "var(--font-display)" }}>
              Follow Us
            </h3>
            <ul className="mt-5 flex flex-col gap-3">
              {socialLinks.map((label) => (
                <li key={label}>
                  <a href="#" className="text-[14px] text-white/50 transition hover:text-white">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-10 sm:grid-cols-2 lg:grid-cols-[1.2fr_1fr_1fr]">
          <div>
            <p className="font-label text-[11px] uppercase tracking-widest text-white/40">Email Us</p>
            <a href="mailto:info@agouasolutions.com" className="mt-1.5 block text-[15px] font-medium text-white">
              info@agouasolutions.com
            </a>
          </div>

          <div>
            <p className="font-label text-[11px] uppercase tracking-widest text-white/40">Call Us</p>
            <a
              href="https://wa.me/966545671133"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 flex items-center gap-2 text-[15px] font-medium text-white"
            >
              +966 54 567 1133
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.8 14.7 3.4 13.4 3.4 12c0-4.7 3.9-8.6 8.6-8.6s8.6 3.9 8.6 8.6-3.9 8.6-8.6 8.6zm4.7-6.4c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.1-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5C10 9.4 9.5 8.2 9.3 7.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.2-.5-.3z" />
              </svg>
            </a>
          </div>

          <div>
            <p className="font-label text-[11px] uppercase tracking-widest text-white/40">Based In</p>
            <div className="mt-2 inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5">
              <span className="text-xl">🇸🇦</span>
              <div>
                <p className="text-[14px] font-semibold text-white">Riyadh</p>
                <p className="text-[12px] text-white/50">Saudi Arabia</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 sm:flex-row">
          <p className="text-[13px] text-white/40">
            © {new Date().getFullYear()} AGOUA | Al-Samaa Co. All Rights Reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-[13px] text-white/40 transition hover:text-white/70">Terms of Service</span>
            <span className="text-[13px] text-white/40 transition hover:text-white/70">Privacy Policy</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
