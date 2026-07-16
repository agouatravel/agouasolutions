"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * Attach the returned ref to a section, then mark any direct/nested
 * elements inside it with `data-reveal` — each one fades/slides in,
 * staggered, the first time the section scrolls into view.
 */
export function useScrollReveal<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const targets = containerRef.current.querySelectorAll("[data-reveal]");
    if (!targets.length) return;

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 32 });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        stagger: 0.12,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return containerRef;
}
