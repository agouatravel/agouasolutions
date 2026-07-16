"use client";

import { AmbientGlow } from "@/components/ui/AmbientGlow";
import { usePointerMotionValues } from "@/hooks/usePointerMotionValues";
import { motion } from "framer-motion";
import Image from "next/image";
import { FooterStrip } from "./FooterStrip";
import { HeroAccentLine } from "./HeroAccentLine";
import { HeroImagePlaceholder } from "./HeroImagePlaceholder";
import { HeroText } from "./HeroText";

type HeroProps = {
  ready: boolean;
};

export function Hero({ ready }: HeroProps) {
  const { x: pointerX, y: pointerY } = usePointerMotionValues();

  return (
    <div className="relative flex w-full flex-col overflow-hidden bg-neutral-50">
      <AmbientGlow variant="light" />

      <nav className="sticky top-0 z-20 flex items-center justify-between px-8 py-5 sm:px-16">
        <Image
          src="/agoua-logo.svg"
          alt="Agoua"
          width={139}
          height={32}
          priority
          unoptimized
          className="h-8 w-auto"
        />
        <div className="hidden items-center gap-10 rounded-full border border-brand-navy/40 bg-brand-navy/90 px-8 py-3 text-sm text-white/80 shadow-lg shadow-brand-navy/30 backdrop-blur-md md:flex">
          <a href="#" className="transition-colors hover:text-brand-teal">
            Home
          </a>
          <a href="#about" className="transition-colors hover:text-brand-teal">
            About
          </a>
          <a href="#services" className="transition-colors hover:text-brand-teal">
            Services
          </a>
          <a href="#contact" className="transition-colors hover:text-brand-teal">
            Contact
          </a>
        </div>
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="hidden items-center rounded-full border border-brand-navy/40 bg-brand-navy/90 px-5 py-2.5 text-xs font-medium text-neutral-50 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/50 hover:bg-brand-teal hover:text-brand-navy md:flex"
        >
          Book a Consultancy
        </motion.a>
      </nav>

      <div className="relative z-10 px-8 pb-10 sm:px-16">
        <HeroAccentLine />

        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:items-start">
          <div className="relative z-10 lg:pt-26">
            <HeroText ready={ready} />
          </div>

          <div className="relative h-[420px] w-full sm:h-[520px] lg:mt-20 lg:h-[640px]">
            <HeroImagePlaceholder
              ready={ready}
              pointerX={pointerX}
              pointerY={pointerY}
            />
          </div>
        </div>
      </div>

      <FooterStrip />
    </div>
  );
}
