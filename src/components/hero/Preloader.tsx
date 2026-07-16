"use client";

import { useEffect, useId, useRef } from "react";
import gsap from "gsap";
import {
  AGOUA_MARK_HEIGHT as MARK_HEIGHT,
  AGOUA_MARK_WIDTH as MARK_WIDTH,
  AGOUA_MARK_OUTER_TRANSFORM as MARK_OUTER_TRANSFORM,
  AGOUA_MARK_INNER_TRANSFORM as MARK_INNER_TRANSFORM,
  AGOUA_MARK_PATHS as MARK_PATHS,
} from "@/lib/agouaMark";

type PreloaderProps = {
  onComplete: () => void;
};

const COUNT_DURATION_SECONDS = 1.5;
const EXIT_DURATION_SECONDS = 0.5;

export function Preloader({ onComplete }: PreloaderProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const clipRectRef = useRef<SVGRectElement>(null);
  const clipId = useId();

  useEffect(() => {
    const counter = { value: 1 };
    const timeline = gsap.timeline({ onComplete });

    timeline.to(counter, {
      value: 100,
      duration: COUNT_DURATION_SECONDS,
      ease: "power1.inOut",
      onUpdate: () => {
        const rounded = Math.round(counter.value);
        const fillHeight = (rounded / 100) * MARK_HEIGHT;

        if (percentRef.current) percentRef.current.textContent = `${rounded}%`;
        if (barRef.current) barRef.current.style.width = `${rounded}%`;
        clipRectRef.current?.setAttribute("y", `${MARK_HEIGHT - fillHeight}`);
        clipRectRef.current?.setAttribute("height", `${fillHeight}`);
      },
    });

    timeline.to(rootRef.current, {
      yPercent: -100,
      duration: EXIT_DURATION_SECONDS,
      ease: "power4.inOut",
    });

    return () => {
      timeline.kill();
    };
  }, [onComplete]);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-6 bg-brand-navy"
    >
      <svg
        viewBox={`0 0 ${MARK_WIDTH} ${MARK_HEIGHT}`}
        className="h-14 w-auto sm:h-16"
        aria-label="Agoua"
      >
        <defs>
          <clipPath id={clipId}>
            <rect ref={clipRectRef} x={0} y={MARK_HEIGHT} width={MARK_WIDTH} height={0} />
          </clipPath>
        </defs>

        {/* faint outline of the mark, always visible */}
        <g fill="#ffffff" fillOpacity={0.15}>
          <g transform={MARK_OUTER_TRANSFORM}>
            <g transform={MARK_INNER_TRANSFORM}>
              {MARK_PATHS.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>
          </g>
        </g>

        {/* solid white fill, revealed bottom-up as loading progresses */}
        <g fill="#ffffff" clipPath={`url(#${clipId})`}>
          <g transform={MARK_OUTER_TRANSFORM}>
            <g transform={MARK_INNER_TRANSFORM}>
              {MARK_PATHS.map((d, index) => (
                <path key={index} d={d} />
              ))}
            </g>
          </g>
        </g>
      </svg>

      <div className="h-px w-56 overflow-hidden bg-brand-navy-light/30">
        <div ref={barRef} className="h-full w-0 bg-brand-teal" />
      </div>
      <span ref={percentRef} className="text-xs tabular-nums text-white/50">
        1%
      </span>
    </div>
  );
}
