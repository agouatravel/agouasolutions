"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useInViewOnce } from "./motion/Reveal";
import AnimatedCounter from "./motion/AnimatedCounter";
import StickerPeel from "./motion/StickerPeel";

const VISIBLE_MIN = 3;
const VISIBLE_MAX = 5;
const ROTATE_INTERVAL_MS = 9000;
// Peel start angle: 0/90/180/270 open from an edge (right/top/left/bottom),
// 45/135/225/315 open from a corner — cycling through all eight keeps the
// "which side folds first" varied instead of always the same corner.
const CURL_ANGLES = [0, 45, 90, 135, 180, 225, 270, 315];

function shuffle<T>(arr: T[]) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const stats = [
  { value: 30, suffix: "+", label: "Brands Served" },
  { value: 8, prefix: "4-", tag: "Weeks", label: "Avg. Launch Time" },
  { value: 3, label: "Regions Served" },
  { value: 100, suffix: "%", label: "In-House Production" },
];

// [from, to] gradient pairs cycled across client tiles for visual variety.
const PALETTE: [string, string][] = [
  ["#14b8a6", "#0d8f81"],
  ["#3b82f6", "#2563eb"],
  ["#7c3aed", "#5b21b6"],
  ["#f59e0b", "#b45309"],
  ["#e11d48", "#9f1239"],
];

const clientNames = [
  "Nova Realty",
  "Zenith Towers",
  "Falcon Retail",
  "Vertex Living",
  "Origin Malls",
  "Skyline Group",
  "Atlas Hospitality",
  "Meridian Homes",
  "Cedar Exhibits",
  "Halo Retail",
  "Orbit Expo",
  "Terra Developments",
];

function initialsOf(name: string) {
  const words = name.split(" ").filter(Boolean);
  return ((words[0]?.[0] ?? "") + (words[1]?.[0] ?? "")).toUpperCase();
}

// Generates a duotone monogram tile as an inline SVG data URI, standing in
// for a real client logo (these are placeholder brand names, not real
// companies with actual marks) so the sticker has a front image to peel.
function monogramImage(name: string, [from, to]: [string, string]) {
  const initials = initialsOf(name);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="360">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${from}"/>
        <stop offset="100%" stop-color="${to}"/>
      </linearGradient>
    </defs>
    <rect width="480" height="360" fill="url(#g)"/>
    <text x="50%" y="52%" text-anchor="middle" dominant-baseline="middle" font-family="sans-serif" font-weight="700" font-size="150" fill="rgba(255,255,255,0.16)">${initials}</text>
    <text x="50%" y="82%" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="28" fill="#ffffff">${name}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

const clients = clientNames.map((name, i) => ({
  name,
  image: monogramImage(name, PALETTE[i % PALETTE.length]),
}));

type DisplayedClient = (typeof clients)[number] & { curlRotation: number; cycle: number };

export default function LogosSection() {
  // Large top rootMargin pre-warms the WebGL sticker canvases well before the
  // section reaches the viewport, so the (heavy, one-time) mount cost of 3-5
  // three.js scenes lands while the user is still scrolling toward it instead
  // of landing exactly as the section enters view, which read as scroll jank.
  const { ref: headingRef, visible } = useInViewOnce<HTMLDivElement>(0, "800px 0px 0px 0px");
  const gridRef = useRef<HTMLDivElement>(null);
  const spotlightRef = useRef<HTMLDivElement>(null);
  const [displayed, setDisplayed] = useState<DisplayedClient[]>([]);
  const pausedRef = useRef(false);

  useEffect(() => {
    if (!visible) return;

    let cycle = 0;
    const rotate = () => {
      // Hovering a card freezes the lineup in place — skip this tick
      // entirely rather than reshuffling out from under the cursor.
      if (pausedRef.current) return;
      cycle += 1;
      const count = VISIBLE_MIN + Math.floor(Math.random() * (VISIBLE_MAX - VISIBLE_MIN + 1));
      const picked = shuffle(clients).slice(0, count);
      setDisplayed(
        picked.map((client) => ({
          ...client,
          curlRotation: CURL_ANGLES[Math.floor(Math.random() * CURL_ANGLES.length)],
          cycle,
        }))
      );
    };

    rotate();
    const id = setInterval(rotate, ROTATE_INTERVAL_MS);
    return () => clearInterval(id);
  }, [visible]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    pausedRef.current = true;
    const grid = gridRef.current;
    const spotlight = spotlightRef.current;
    if (!grid || !spotlight) return;
    const rect = grid.getBoundingClientRect();
    spotlight.style.transform = `translate(${e.clientX - rect.left}px, ${e.clientY - rect.top}px)`;
    spotlight.style.opacity = "1";
  };

  const handleMouseLeave = () => {
    pausedRef.current = false;
    if (spotlightRef.current) spotlightRef.current.style.opacity = "0";
  };

  return (
    <section className="relative z-10 overflow-hidden bg-background py-20 sm:py-28">
      <div
        ref={headingRef}
        className={`relative mx-auto max-w-3xl px-6 text-center transition-all duration-700 ease-out lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
      >
        <span className="font-label inline-flex items-center gap-2 rounded-full border border-border-hairline bg-surface px-4 py-1.5 text-[11px] uppercase tracking-widest text-muted">
          Trusted By
        </span>
        <h2
          className="mt-6 text-[28px] font-semibold leading-tight text-foreground sm:text-[36px]"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Chosen by 30+ Developers, Retailers &amp;{" "}
          <span style={{ fontFamily: "var(--font-pixel)", color: "var(--color-primary)" }}>
            Experience Brands
          </span>
        </h2>
      </div>

      <div
        className={`relative mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-8 px-6 transition-all duration-700 ease-out sm:grid-cols-4 lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "80ms" }}
      >
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="flex items-center justify-center gap-2 whitespace-nowrap">
              <span
                className="text-[30px] font-normal leading-tight text-foreground sm:text-[36px]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <AnimatedCounter
                  value={stat.value}
                  start={visible}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </span>
              {stat.tag ? (
                <span className="font-label rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[10px] uppercase tracking-wide text-primary-dim">
                  {stat.tag}
                </span>
              ) : null}
            </p>
            <p className="mt-1.5 text-[13px] text-muted">{stat.label}</p>
          </div>
        ))}
      </div>

      <div
        className={`relative mx-auto mt-16 max-w-6xl px-6 transition-all duration-700 ease-out lg:px-8 ${
          visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0"
        }`}
        style={{ transitionDelay: "150ms" }}
      >
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative flex flex-nowrap justify-center gap-5 overflow-x-auto pb-2 sm:overflow-visible sm:pb-0"
        >
          <div
            ref={spotlightRef}
            className="pointer-events-none absolute left-0 top-0 z-10 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 opacity-0"
            style={{
              background: "radial-gradient(circle, rgba(20,184,166,0.14), transparent 70%)",
              transition: "opacity 300ms ease",
            }}
          />
          {/* 3-5 cards shown at once (count randomized too), reshuffled from
              the full client list every 3s with a random peel direction each
              time. Sticker canvases only mount once this section has
              scrolled into view. Hovering the row pauses the rotation.
              Each card fades/blurs in with a slight per-index stagger for a
              softer crossfade instead of a synchronized on/off blink. */}
          <AnimatePresence mode="popLayout" initial={false}>
            {displayed.map((client, i) => (
              <motion.div
                key={`${client.name}-${client.cycle}`}
                layout
                initial={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -10, filter: "blur(6px)" }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: i * 0.07 }}
                className="shrink-0"
              >
                <StickerPeel
                  image={client.image}
                  imageWidth={190}
                  imageHeight={143}
                  backColor="#0b1424"
                  curlRotation={client.curlRotation}
                  shadowEnabled={false}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
