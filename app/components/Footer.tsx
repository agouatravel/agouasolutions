import Image from "next/image";
import Link from "next/link";
import Reveal from "./motion/Reveal";
import AgouaMarkReveal from "./motion/AgouaMarkReveal";

const serviceLinks = [
  "Virtual Reality Experiences",
  "Augmented Reality Solutions",
  "Architectural Visualization",
  "Virtual Content Production",
  "Experience Center Design",
  "Digital Twins & Smart Platforms",
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
    <footer className="relative overflow-hidden bg-tertiary">
      <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.06]" />
      <div
        className="pointer-events-none absolute -bottom-1/3 right-1/4 h-[420px] w-[420px] rounded-full opacity-[0.1] blur-3xl"
        style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-6 pb-8 pt-16 lg:px-8 lg:pb-10 lg:pt-20">
        <div className="relative">
        <Reveal className="relative z-10">
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
              className="group mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-white py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-tertiary transition-all duration-300 ease-out hover:scale-[1.04] hover:opacity-90 hover:shadow-lg active:scale-[0.97]"
            >
              Start A Project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tertiary text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
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
                  <Link
                    href={link.href}
                    className="cursor-pointer text-[14px] text-white/50 transition hover:text-primary"
                  >
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
                  <a href="#" className="cursor-pointer text-[14px] text-white/50 transition hover:text-primary">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        </Reveal>

        <AgouaMarkReveal className="pointer-events-none absolute inset-x-6 bottom-0 z-0 mx-auto h-28 max-w-3xl translate-y-[45%] text-white opacity-[0.22] sm:inset-x-10 sm:h-36 sm:max-w-4xl lg:inset-x-16 lg:h-44 lg:max-w-5xl" />
        </div>

        <div className="relative z-10 mt-32 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-4 sm:mt-40 sm:flex-row lg:mt-48">
          <p className="text-[13px] text-white/40">
            © <span className="font-numeric">{new Date().getFullYear()}</span> AGOUA | Al-Samaa Co. All Rights
            Reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="cursor-pointer text-[13px] text-white/40 transition hover:text-primary">
              Terms of Service
            </span>
            <span className="cursor-pointer text-[13px] text-white/40 transition hover:text-primary">
              Privacy Policy
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
