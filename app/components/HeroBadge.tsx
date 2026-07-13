"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Tagline = {
  text: string;
  showMap?: boolean;
  icon: React.ReactNode;
};

const ROTATE_MS = 3500;
const FADE_MS = 450;

const taglines: Tagline[] = [
  {
    text: "Riyadh, KSA — Immersive Technology Studio",
    showMap: true,
    icon: (
      <svg viewBox="0 0 512 512" className="h-[18px] w-[18px] shrink-0">
        <path
          fill="white"
          d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zm50.7-186.9L162.4 380.6c-19.4 7.5-38.5-11.6-31-31l55.5-144.3c3.3-8.5 9.9-15.1 18.4-18.4l144.3-55.5c19.4-7.5 38.5 11.6 31 31L325.1 306.7c-3.2 8.5-9.9 15.1-18.4 18.4zM288 256a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
        />
      </svg>
    ),
  },
  {
    text: "VR · AR · Architectural Visualization",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
        <rect x="2.5" y="7.5" width="19" height="10" rx="4" stroke="white" strokeWidth="1.6" />
        <circle cx="8.5" cy="12.5" r="1.6" stroke="white" strokeWidth="1.6" />
        <circle cx="15.5" cy="12.5" r="1.6" stroke="white" strokeWidth="1.6" />
        <path d="M10.5 12.5h3" stroke="white" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    text: "Trusted by 30+ Developers & Retailers",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
        <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.6" />
        <path d="M8 12.5l2.5 2.5L16 9.5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    text: "Dedicated In-House Studio Team",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" className="h-[18px] w-[18px] shrink-0">
        <path
          d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
          stroke="white"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function BadgeContent({ tagline }: { tagline: Tagline }) {
  return (
    <>
      {tagline.icon}
      <span className="font-label whitespace-nowrap text-[12px] uppercase tracking-wide text-white">
        {tagline.text}
      </span>
    </>
  );
}

export default function HeroBadge() {
  const [index, setIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState<number | null>(null);
  const [widthPx, setWidthPx] = useState<number | undefined>(undefined);
  const measureRefs = useRef<(HTMLDivElement | null)[]>([]);
  const widthsRef = useRef<number[]>([]);
  const pausedRef = useRef(false);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function measure() {
      widthsRef.current = measureRefs.current.map((el) => el?.getBoundingClientRect().width ?? 0);
      setWidthPx(widthsRef.current[0]);
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    if (reducedMotionRef.current) return;

    const id = setInterval(() => {
      if (pausedRef.current) return;
      setIndex((i) => {
        const next = (i + 1) % taglines.length;
        setPrevIndex(i);
        if (widthsRef.current[next]) setWidthPx(widthsRef.current[next]);
        return next;
      });
    }, ROTATE_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (prevIndex === null) return;
    const t = setTimeout(() => setPrevIndex(null), FADE_MS);
    return () => clearTimeout(t);
  }, [prevIndex]);

  const current = taglines[index];

  return (
    <div
      className="group/loc animate-fade-up relative z-20 inline-block"
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      <button
        type="button"
        className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-primary py-2.5 pl-4 pr-5 shadow-[5px_5px_10px_rgba(0,0,0,0.12)] transition-[background-color,width] duration-500 hover:bg-primary-dim active:scale-[0.97]"
        style={{ width: widthPx, transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
      >
        <span className="sr-only">AGOUA — Riyadh-based immersive technology studio</span>

        <span key={index} aria-hidden className="badge-cycle-in flex items-center gap-2.5">
          <BadgeContent tagline={current} />
        </span>

        {prevIndex !== null && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2" aria-hidden>
            <span key={`prev-${prevIndex}`} className="badge-cycle-out flex items-center gap-2.5">
              <BadgeContent tagline={taglines[prevIndex]} />
            </span>
          </span>
        )}
      </button>

      <div className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0" aria-hidden>
        {taglines.map((t, i) => (
          <div
            key={i}
            ref={(el) => {
              measureRefs.current[i] = el;
            }}
            className="inline-flex items-center gap-2.5 whitespace-nowrap rounded-full py-2.5 pl-4 pr-5"
          >
            <BadgeContent tagline={t} />
          </div>
        ))}
      </div>

      {current.showMap && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-1 w-[170px] origin-bottom -translate-x-1/2 scale-0 opacity-0 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.74,-0.03,0.05,1.24)] group-hover/loc:pointer-events-auto group-hover/loc:scale-100 group-hover/loc:opacity-100">
          <div className="relative h-[76px] overflow-hidden rounded-[16px] border border-primary/30 shadow-[1px_4px_16px_rgba(5,11,24,0.35)] [animation:location-card-in_0.4s_ease_both]">
            <span
              className="absolute rounded-full bg-white/70"
              style={{
                top: "1.6em",
                left: "45%",
                width: "1.4em",
                height: "1em",
                filter: "blur(2px)",
                animation: "location-clouds 42s ease infinite",
              }}
            />
            <span
              className="absolute rounded-full bg-white/60"
              style={{
                top: "0.3em",
                right: "-0.6em",
                width: "3.4em",
                height: "1.3em",
                filter: "blur(3px)",
                animation: "location-clouds 30s ease infinite",
              }}
            />
            <span
              className="absolute rounded-full bg-white/80"
              style={{
                top: "2.1em",
                right: "2.6em",
                width: "1em",
                height: "0.5em",
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
      )}
    </div>
  );
}
