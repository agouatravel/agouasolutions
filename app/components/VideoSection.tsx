"use client";

import { useEffect, useRef } from "react";

const MAX_CARD_WIDTH = 1280;
const SIDE_PADDING = 48;
const CORNER_RADIUS = 24;
const GROWTH_VH = 60;
const DWELL_VH = 15;

export default function VideoSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const captionRef = useRef<HTMLDivElement>(null);
  const sizeRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    let ticking = false;

    function computeBaseSize() {
      const viewportWidth = window.innerWidth;
      const initialWidth = Math.min(viewportWidth - SIDE_PADDING, MAX_CARD_WIDTH);
      const initialHeight = (initialWidth * 9) / 16;
      sizeRef.current = { width: initialWidth, height: initialHeight };
    }

    // Everything below is transform/opacity-only (no width/height/border-radius
    // layout writes) so the browser never has to reflow or repaint the box-shadow
    // at a new size on every scroll frame — that reflow was the source of the jank.
    function update() {
      ticking = false;
      const container = containerRef.current;
      const card = cardRef.current;
      const button = buttonRef.current;
      const caption = captionRef.current;
      if (!container || !card || !button || !caption) return;

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const { width: initialWidth, height: initialHeight } = sizeRef.current;

      const rect = container.getBoundingClientRect();
      const growthDistance = (GROWTH_VH / 100) * viewportHeight;
      const scrolled = -rect.top;
      const progress = growthDistance > 0 ? Math.min(Math.max(scrolled / growthDistance, 0), 1) : 0;

      const scaleX = initialWidth / viewportWidth + (1 - initialWidth / viewportWidth) * progress;
      const scaleY = initialHeight / viewportHeight + (1 - initialHeight / viewportHeight) * progress;
      const avgScale = Math.sqrt(scaleX * scaleY);
      const visualRadius = CORNER_RADIUS * (1 - progress);

      card.style.transform = `scale(${scaleX}, ${scaleY})`;
      card.style.borderRadius = `${visualRadius / avgScale}px`;

      // Counter-scale the button/caption so the parent's non-uniform scale
      // doesn't stretch them into an oval or squash the text.
      const counterX = avgScale / scaleX;
      const counterY = avgScale / scaleY;
      button.style.transform = `translate(-50%, -50%) scale(${counterX}, ${counterY})`;
      caption.style.transform = `scale(${counterX}, ${counterY})`;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    function onResize() {
      computeBaseSize();
      onScroll();
    }

    computeBaseSize();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative mt-2 sm:mt-3"
      style={{ height: `${100 + GROWTH_VH + DWELL_VH}vh` }}
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-background">
        <div
          ref={cardRef}
          className="absolute inset-0 overflow-hidden border border-border-hairline bg-tertiary shadow-[0_30px_80px_-30px_rgba(5,11,24,0.45)] will-change-transform"
          style={{ borderRadius: `${CORNER_RADIUS}px`, transformOrigin: "center" }}
        >
          <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.08]" />

          <button
            ref={buttonRef}
            type="button"
            aria-label="Play video"
            className="group absolute left-1/2 top-1/2 flex h-20 w-20 items-center justify-center rounded-full bg-white shadow-[0_8px_28px_-8px_rgba(20,184,166,0.45),0_18px_44px_-14px_rgba(59,130,246,0.35)] transition-shadow hover:shadow-[0_10px_32px_-8px_rgba(20,184,166,0.55),0_22px_44px_-14px_rgba(59,130,246,0.45)]"
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" className="ml-1">
              <path d="M8 5v14l11-7-11-7z" fill="var(--color-tertiary)" />
            </svg>
          </button>

          <div
            ref={captionRef}
            className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-1 p-8 text-center"
            style={{ transformOrigin: "bottom center" }}
          >
            <span className="font-label text-[11px] uppercase tracking-widest text-white/50">
              Watch the Showreel
            </span>
            <span
              className="text-[20px] font-semibold text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              See AGOUA in Action
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
