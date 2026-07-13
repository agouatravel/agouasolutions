"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const GRID_CELL = 44;

export default function Hero() {
  const gridAreaRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const lastCellRef = useRef<{ x: number; y: number } | null>(null);

  const handleGridMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const area = gridAreaRef.current;
    const highlight = highlightRef.current;
    if (!area || !highlight) return;

    const rect = area.getBoundingClientRect();
    const cellX = Math.floor((e.clientX - rect.left) / GRID_CELL);
    const cellY = Math.floor((e.clientY - rect.top) / GRID_CELL);

    if (lastCellRef.current?.x === cellX && lastCellRef.current?.y === cellY) return;
    lastCellRef.current = { x: cellX, y: cellY };

    highlight.style.transform = `translate(${cellX * GRID_CELL}px, ${cellY * GRID_CELL}px)`;
    highlight.style.opacity = "1";
  };

  const handleGridMouseLeave = () => {
    lastCellRef.current = null;
    if (highlightRef.current) highlightRef.current.style.opacity = "0";
  };

  return (
    <section className="relative overflow-hidden bg-background">
      <div
        ref={gridAreaRef}
        onMouseMove={handleGridMouseMove}
        onMouseLeave={handleGridMouseLeave}
        className="relative"
      >
        <div className="bg-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

        <div
          className="pointer-events-none absolute -top-24 right-[8%] h-[420px] w-[420px] rounded-full opacity-[0.18] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
        />
        <div
          className="pointer-events-none absolute -left-24 top-32 h-[380px] w-[380px] rounded-full opacity-[0.14] blur-3xl"
          style={{ background: "radial-gradient(circle, var(--color-secondary), transparent 70%)" }}
        />

        <div className="pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]">
          <div
            ref={highlightRef}
            className="absolute left-0 top-0 h-11 w-11 opacity-0"
            style={{ transition: "opacity 250ms ease, transform 150ms ease-out" }}
          >
            <span
              className="absolute inset-y-0 left-0 w-px"
              style={{
                background: "rgba(20, 184, 166, 0.45)",
                boxShadow: "0 0 24px 8px rgba(20, 184, 166, 0.32), 0 0 52px 20px rgba(20, 184, 166, 0.14)",
              }}
            />
            <span
              className="absolute inset-y-0 right-0 w-px"
              style={{
                background: "rgba(20, 184, 166, 0.45)",
                boxShadow: "0 0 24px 8px rgba(20, 184, 166, 0.32), 0 0 52px 20px rgba(20, 184, 166, 0.14)",
              }}
            />
          </div>
        </div>

        <div className="relative mx-auto flex max-w-5xl flex-col items-center px-6 pb-20 pt-20 text-center lg:pt-28">
          <div className="group/loc animate-fade-up relative z-20 inline-block">
            <button
              type="button"
              className="group inline-flex items-center gap-2.5 rounded-full bg-primary py-2.5 pl-4 pr-5 shadow-[5px_5px_10px_rgba(0,0,0,0.12)] transition-colors duration-500 hover:bg-primary-dim active:scale-[0.97]"
            >
              <svg
                viewBox="0 0 512 512"
                className="h-[18px] w-[18px] shrink-0 transition-transform duration-[1500ms] ease-out group-hover:rotate-[250deg]"
              >
                <path
                  fill="white"
                  d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
                />
              </svg>
              <span className="font-label text-[12px] uppercase tracking-wide text-white">
                Riyadh, KSA — Immersive Technology Studio
              </span>
            </button>

            <div
              className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 w-[170px] origin-bottom -translate-x-1/2 scale-0 opacity-0 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.74,-0.03,0.05,1.24)] group-hover/loc:pointer-events-auto group-hover/loc:scale-100 group-hover/loc:opacity-100"
            >
              <div
                className="relative h-[76px] overflow-hidden rounded-[16px] border border-primary/30 shadow-[1px_4px_16px_rgba(5,11,24,0.35)] [animation:location-card-in_0.4s_ease_both]"
              >
                <span
                  className="absolute rounded-full bg-white/70"
                  style={{
                    top: "1.6em", left: "45%", width: "1.4em", height: "1em",
                    filter: "blur(2px)",
                    animation: "location-clouds 42s ease infinite",
                  }}
                />
                <span
                  className="absolute rounded-full bg-white/60"
                  style={{
                    top: "0.3em", right: "-0.6em", width: "3.4em", height: "1.3em",
                    filter: "blur(3px)",
                    animation: "location-clouds 30s ease infinite",
                  }}
                />
                <span
                  className="absolute rounded-full bg-white/80"
                  style={{
                    top: "2.1em", right: "2.6em", width: "1em", height: "0.5em",
                    filter: "blur(1.5px)",
                    animation: "location-clouds 55s ease infinite",
                  }}
                />

                <div className="relative h-full w-full overflow-hidden rounded-[15px]">
                  <Image
                    src="/images/Map_image.png"
                    alt="Stylized map of AGOUA's location in Riyadh, Saudi Arabia"
                    fill
                    className="pointer-events-none object-cover"
                  />
                  <span
                    className="pointer-events-none absolute z-[5] h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                    style={{ left: "48%", top: "42%", animation: "location-pulse-white 2s infinite" }}
                  />
                  <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col justify-end bg-gradient-to-t from-neutral/95 to-neutral/0 p-2.5 pt-5">
                    <span
                      className="text-[13px] font-semibold leading-none text-white"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      Riyadh
                    </span>
                    <p className="mt-0.5 text-[10px] font-medium text-white/70">Saudi Arabia</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <h1 className="animate-fade-up mt-8 text-[2.6rem] leading-[1.08] tracking-tight text-foreground [animation-delay:80ms] sm:text-6xl lg:text-[4.5rem]">
            <span className="font-bold" style={{ fontFamily: "var(--font-headline)" }}>
              Creating the Future of
            </span>
            <br />
            <span style={{ fontFamily: "var(--font-pixel)", color: "var(--color-primary)" }}>
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
              className="group inline-flex items-center gap-3 rounded-full bg-tertiary py-2 pl-7 pr-2 text-[15px] font-medium text-white shadow-[0_8px_28px_-8px_rgba(20,184,166,0.45),0_18px_44px_-14px_rgba(59,130,246,0.35)] transition hover:opacity-90"
            >
              Book a Consultation
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-tertiary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M7 17 17 7M9 7h8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Link>

            <a
              href="https://wa.me/966545671133"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 rounded-full border border-border-hairline bg-surface py-3.5 px-7 text-[15px] font-medium text-foreground transition hover:border-foreground/20"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#25D366">
                <path d="M12 2C6.5 2 2 6.5 2 12c0 1.8.5 3.6 1.4 5.1L2 22l5.1-1.3c1.4.8 3.1 1.2 4.9 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18.1c-1.6 0-3.1-.4-4.5-1.2l-.3-.2-3.3.9.9-3.2-.2-.3C3.8 14.7 3.4 13.4 3.4 12c0-4.7 3.9-8.6 8.6-8.6s8.6 3.9 8.6 8.6-3.9 8.6-8.6 8.6zm4.7-6.4c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.3-.7.8-.8 1-.1.2-.3.2-.6.1-.3-.1-1.2-.4-2.2-1.4-.8-.7-1.4-1.6-1.5-1.9-.1-.3 0-.4.1-.6.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.4 0-.5C10 9.4 9.5 8.2 9.3 7.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.3-.9.9-.9 2.2s1 2.5 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.5-.6 1.8-1.2.2-.6.2-1.1.1-1.2-.1-.2-.3-.2-.5-.3z" />
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
