"use client";

import Link from "next/link";
import HeroBadge from "./HeroBadge";
import KineticGrid from "./motion/KineticGrid";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <KineticGrid
        background="transparent"
        dotColor="rgba(5, 11, 24, 0.45)"
        lineColor="rgba(20, 184, 166, 0.61)"
        trailColor="#14B8A6"
        spacing={44}
        radius={380}
        strength={4}
        trail
        style={{ height: "auto" }}
        canvasStyle={{
          maskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 60% 50% at 50% 0%, black, transparent)",
        }}
      >
        <div
          className="pointer-events-none absolute -top-24 right-[8%] h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-24 top-32 h-[380px] w-[380px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
        />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-20 text-center lg:pt-28">
          <HeroBadge />

          <h1 className="animate-fade-up mt-8 text-[2.6rem] leading-[1.08] tracking-tight text-foreground [animation-delay:80ms] sm:text-6xl lg:text-[4.5rem]">
            <span className="font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              Creating the Future of
            </span>
            <br />
            <span
              className="font-bold"
              style={{ fontFamily: "var(--font-pixel)", color: "var(--color-primary)" }}
            >
              Immersive Experiences
            </span>
          </h1>

          <p className="animate-fade-up mt-7 max-w-2xl text-balance text-lg leading-relaxed text-muted [animation-delay:160ms]">
            AGOUA delivers world-class Virtual Reality and advanced digital solutions that
            redefine how organizations present, experience, and interact with their ideas.
          </p>

          <div className="animate-fade-up mt-10 flex flex-col items-center gap-4 sm:flex-row [animation-delay:280ms]">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-3 rounded-full bg-tertiary py-2 pl-7 pr-2 text-[15px] font-medium text-white shadow-[0_8px_28px_-8px_rgba(20,184,166,0.45),0_18px_44px_-14px_rgba(59,130,246,0.35)] transition-all duration-300 ease-out hover:scale-[1.035] hover:opacity-90 hover:shadow-[0_12px_36px_-8px_rgba(20,184,166,0.55),0_22px_52px_-14px_rgba(59,130,246,0.45)] active:scale-[0.97]"
            >
              Book a Consultation
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-tertiary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <a
              href="https://wa.me/966545671133"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-border-hairline bg-surface py-3.5 px-7 text-[15px] font-medium text-foreground transition-all duration-300 ease-out hover:scale-[1.035] hover:border-foreground/20 hover:shadow-md active:scale-[0.97]"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.8 14.7 3.4 13.4 3.4 12c0-4.7 3.9-8.6 8.6-8.6s8.6 3.9 8.6 8.6-3.9 8.6-8.6 8.6zm4.7-6.4c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.1-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5C10 9.4 9.5 8.2 9.3 7.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.2-.5-.3z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </KineticGrid>
    </section>
  );
}
