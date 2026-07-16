"use client";

import { motion, type Variants } from "framer-motion";
import { TrustedByRow } from "./TrustedByRow";
import { HeroStats } from "./HeroStats";
import { OrbitAccent } from "./OrbitAccent";

type HeroTextProps = {
  ready: boolean;
};

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function HeroText({ ready }: HeroTextProps) {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate={ready ? "visible" : "hidden"}
      className="relative flex max-w-xl flex-col gap-8"
    >
      <h1 className="relative text-5xl font-semibold uppercase leading-[1.05] tracking-tight text-brand-navy sm:text-6xl">
        <motion.span variants={item} className="block">
          Immersive{" "}
          <span className="relative inline-block">
            <OrbitAccent ready={ready} />
            <span className="relative z-10">Digital</span>
          </span>
        </motion.span>
        <motion.span variants={item} className="block">
          Experiences
        </motion.span>
      </h1>

      <motion.p variants={item} className="mt-[5px] max-w-md text-base leading-relaxed text-neutral-600">
        AGOUA delivers world-class Virtual Reality and advanced digital
        solutions that transform ambitious visions into immersive
        experiences that inspire, influence, and create lasting impact.
      </motion.p>

      <motion.div variants={item} className="flex items-center gap-6">
        <motion.a
          href="#contact"
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="rounded-full border border-brand-navy/40 bg-brand-navy/90 px-6 py-3 text-sm font-medium text-neutral-50 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/50 hover:bg-brand-teal hover:text-brand-navy"
        >
          Get Started
        </motion.a>
        <motion.a
          href="#contact"
          whileHover={{ x: 4 }}
          className="text-base font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-4"
        >
          Contact Us
        </motion.a>
      </motion.div>

      <TrustedByRow />

      <HeroStats />
    </motion.div>
  );
}
