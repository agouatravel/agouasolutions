"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

type OrbitAccentProps = {
  ready: boolean;
};

const CENTER = { x: 110, y: 38 };
const RADIUS = { x: 100, y: 30 };
const TILT_DEG = -12;

const DOTS = [
  { offsetDeg: 0, r: 3, opacity: 1 },
  { offsetDeg: 90, r: 2.4, opacity: 0.7 },
  { offsetDeg: 180, r: 2.2, opacity: 0.55 },
  { offsetDeg: 270, r: 2.4, opacity: 0.7 },
];

function pointOnOrbit(angleDeg: number) {
  const angle = (angleDeg * Math.PI) / 180;
  const tilt = (TILT_DEG * Math.PI) / 180;
  const x0 = RADIUS.x * Math.cos(angle);
  const y0 = RADIUS.y * Math.sin(angle);
  return {
    x: CENTER.x + x0 * Math.cos(tilt) - y0 * Math.sin(tilt),
    y: CENTER.y + x0 * Math.sin(tilt) + y0 * Math.cos(tilt),
  };
}

export function OrbitAccent({ ready }: OrbitAccentProps) {
  const ringRef = useRef<SVGEllipseElement>(null);
  const dotRefs = useRef<(SVGCircleElement | null)[]>([]);

  useEffect(() => {
    if (!ready || !ringRef.current) return;

    const ringLength = ringRef.current.getTotalLength();
    gsap.set(ringRef.current, { strokeDashoffset: ringLength });
    const ringTween = gsap.to(ringRef.current, {
      strokeDashoffset: 0,
      duration: 1.2,
      delay: 0.5,
      ease: "power3.inOut",
    });

    const orbit = { angle: 0 };
    const orbitTween = gsap.to(orbit, {
      angle: 360,
      duration: 5,
      repeat: -1,
      ease: "none",
      delay: 1.4,
      onUpdate: () => {
        DOTS.forEach((dot, index) => {
          const point = pointOnOrbit(orbit.angle + dot.offsetDeg);
          const el = dotRefs.current[index];
          el?.setAttribute("cx", point.x.toFixed(2));
          el?.setAttribute("cy", point.y.toFixed(2));
        });
      },
    });

    return () => {
      ringTween.kill();
      orbitTween.kill();
    };
  }, [ready]);

  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute -inset-x-1 -inset-y-2 z-0 h-[calc(100%+1rem)] w-[calc(100%+0.5rem)] sm:-inset-x-2 sm:-inset-y-3"
      viewBox="0 0 220 100"
      fill="none"
    >
      <ellipse
        ref={ringRef}
        cx={CENTER.x}
        cy={CENTER.y}
        rx={RADIUS.x}
        ry={RADIUS.y}
        transform={`rotate(${TILT_DEG} ${CENTER.x} ${CENTER.y})`}
        stroke="#1abc9c"
        strokeOpacity={0.35}
        strokeWidth={3}
      />

      {DOTS.map((dot, index) => (
        <circle
          key={index}
          ref={(el) => {
            dotRefs.current[index] = el;
          }}
          r={dot.r}
          fill="#1abc9c"
          fillOpacity={dot.opacity}
        />
      ))}
    </svg>
  );
}
