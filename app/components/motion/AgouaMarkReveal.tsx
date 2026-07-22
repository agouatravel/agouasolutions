"use client";

import { useEffect, useId, useRef } from "react";

const LETTER_PATHS = [
  "m 81.23,260.805 11.695,21.634 h 7.119 L 143.672,199.53 H 113.773 Z M 86.619,238.912 73.907,215.723 H 95.365 V 199.53 H 49.602 v 6.477 l 28.068,49.745 z",
  "m 179.263,282.439 c -19.118,0 -27.458,-9.845 -27.458,-32.387 v 0 -5.31 h 25.425 v 7.253 c 0,9.069 3.558,13.603 10.678,13.603 v 0 h 14.339 c 7.119,0 11.696,-0.648 11.696,-9.715 v 0 -3.499 h 24.408 v 1.555 c 0,20.079 -8.136,28.5 -27.459,28.5 v 0 z m 18.205,-54.279 h 15.458 v -2.074 c 0,-6.865 -1.831,-9.715 -8.645,-9.715 v 0 h -16.373 c -7.12,0 -10.678,4.534 -10.678,13.602 v 0 8.031 h -25.425 v -6.087 c 0,-23.448 9.051,-32.387 27.458,-32.387 v 0 h 21.255 c 9.865,0 15.865,5.311 17.493,15.286 v 0 h 1.016 l 13.221,-15.286 h 6.103 v 44.693 l -40.883,0.13 z",
  "m 300.892,282.439 v -16.841 h 4.576 c 7.118,0 10.679,-4.534 10.679,-13.603 v 0 -22.022 c 0,-9.068 -3.561,-13.602 -10.679,-13.602 v 0 h -4.576 V 199.53 h 13.22 c 18.408,0 27.46,8.939 27.46,32.387 v 0 18.135 c 0,23.448 -9.052,32.387 -27.46,32.387 v 0 z m -18.814,0 c -18.408,0 -27.459,-8.939 -27.459,-32.387 v 0 -18.135 c 0,-23.448 9.051,-32.387 27.459,-32.387 v 0 h 13.22 v 16.841 h -4.576 c -7.119,0 -10.679,4.534 -10.679,13.602 v 0 22.022 c 0,9.069 3.56,13.603 10.679,13.603 v 0 h 4.576 v 16.841 z",
  "m 414.994,282.439 v -53.762 c 0,-9.068 -2.543,-12.306 -9.661,-12.306 v 0 h -3.661 V 199.53 h 12.306 c 18.406,0 26.441,7.643 26.441,31.09 v 0 51.819 z m -57.154,0 V 230.62 c 0,-23.447 8.034,-31.09 26.441,-31.09 v 0 h 12.306 v 16.841 h -3.661 c -7.119,0 -9.662,3.238 -9.662,12.306 v 0 53.762 z",
  "m 494.926,282.439 -11.695,-21.634 32.543,-61.275 h 29.9 l -43.63,82.909 z m -43.323,-76.433 v -6.476 h 45.764 v 16.193 h -21.459 l 12.713,23.188 -8.949,16.841 z",
];

function seededRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Math.sin can differ in its last few bits between the server and client JS
// engines, so round outputs to avoid a hydration mismatch on these values.
function round(n: number) {
  return Math.round(n * 1000) / 1000;
}

const BLOBS = Array.from({ length: 46 }, (_, i) => ({
  cx: round(seededRandom(i * 3 + 1) * 661.43),
  cy: round(seededRandom(i * 3 + 2) * 153.38),
  r: round(32 + seededRandom(i * 3 + 3) * 34),
  threshold: round(seededRandom(i * 7 + 11) * 0.8),
}));

export default function AgouaMarkReveal({ className }: { className?: string }) {
  const maskId = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let ticking = false;
    // Document-relative top, cached on mount/resize rather than read every
    // scroll frame (matches the pattern used elsewhere in the site).
    const topRef = { current: 0 };

    function computeLayout() {
      if (!el) return;
      topRef.current = el.getBoundingClientRect().top + window.scrollY;
    }

    // Reveal starts once the element peeks in 85% down the viewport, and
    // finishes a bit before the page's true max scroll (not fixed viewport
    // fraction, and not the exact last pixel). This footer is short enough
    // that its top can never travel past ~700px from the viewport top before
    // the page runs out of room to scroll, so a fixed "end" threshold further
    // up the viewport was unreachable and the mark would sit permanently
    // half-masked. Deriving the end point from the actual max scroll instead
    // makes the window adapt to any page length or footer height. The extra
    // COMPLETION_BUFFER pulls that end point earlier by a chunk of a
    // viewport, so the reveal fully completes before the literal bottom of
    // the page — without it, anyone who stops scrolling even slightly short
    // of the absolute last pixel (which is normal; almost nobody scrolls to
    // the literal limit) would be left with a permanently half-masked logo.
    function update() {
      ticking = false;
      if (!el) return;
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      const rectTop = topRef.current - scrollY;
      const maxScrollY = Math.max(document.documentElement.scrollHeight - vh, 0);
      const COMPLETION_BUFFER = vh * 0.35;
      const endRectTop = topRef.current - Math.max(maxScrollY - COMPLETION_BUFFER, 0);
      const startRectTop = vh * 0.85;
      const span = Math.max(startRectTop - endRectTop, 1);
      const progress = Math.min(1, Math.max(0, (startRectTop - rectTop) / span));
      el.style.setProperty("--p", progress.toString());
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      computeLayout();
      update();
    }

    computeLayout();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`agoua-mark relative ${className ?? ""}`.trim()}
      style={{ "--p": 0 } as React.CSSProperties}
    >
      {/* Soft teal bloom that fades in alongside the reveal, so the mark
          reads as a glowing brand mark materializing rather than a flat
          gray watermark just fading in. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          opacity: "var(--p)",
          background: "radial-gradient(60% 90% at 50% 50%, var(--color-primary), transparent 75%)",
          filter: "blur(40px)",
          transition: "opacity 450ms ease-out",
        }}
      />
      {/* Grounded teal shadow sitting just below the text, like the mark is
          casting soft light onto the floor beneath it. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0"
        style={{
          height: "45%",
          transform: "translateY(65%)",
          opacity: "var(--p)",
          background: "radial-gradient(50% 100% at 50% 0%, var(--color-primary), transparent 72%)",
          filter: "blur(28px)",
          transition: "opacity 450ms ease-out",
        }}
      />
      <svg
        viewBox="0 0 661.42927 153.38342"
        className="relative h-full w-full"
        aria-hidden="true"
        style={{ filter: "drop-shadow(0 0 24px rgba(20, 184, 166, var(--p)))" }}
      >
        <defs>
          <mask id={maskId}>
            {BLOBS.map((b, i) => (
              <circle
                key={i}
                cx={b.cx}
                cy={b.cy}
                r={b.r}
                fill="white"
                style={{
                  transformBox: "fill-box",
                  transformOrigin: "center",
                  transform: `scale(clamp(0, calc((var(--p) - ${b.threshold}) * 22), 1))`,
                  transition: "transform 450ms ease-out",
                }}
              />
            ))}
            <rect
              x={-40}
              y={-40}
              width={661.43 + 80}
              height={153.38 + 80}
              fill="white"
              style={{
                transformBox: "fill-box",
                transformOrigin: "center",
                transform: "scale(clamp(0, calc((var(--p) - 0.8) * 7), 1))",
                transition: "transform 450ms ease-out",
              }}
            />
          </mask>
        </defs>
        <g mask={`url(#${maskId})`}>
          <g transform="translate(988.39109,-202.08989)">
            <g transform="translate(-1054.5272,-21.112761)">
              <g transform="matrix(1.3333333,0,0,-1.3333333,0,599.788)">
                {LETTER_PATHS.map((d, i) => (
                  <path key={i} d={d} fill="currentColor" />
                ))}
              </g>
            </g>
          </g>
        </g>
      </svg>
    </div>
  );
}
