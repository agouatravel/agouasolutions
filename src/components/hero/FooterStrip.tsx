"use client";

import { motion } from "framer-motion";

const BRANDS = [
  {
    label: "Logoipsum",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <circle cx={12} cy={12} r={9} stroke="currentColor" strokeWidth={1.5} />
        <circle cx={9} cy={11} r={1.1} fill="currentColor" />
        <circle cx={15} cy={11} r={1.1} fill="currentColor" />
        <path d="M8 15c1.5 1 6.5 1 8 0" stroke="currentColor" strokeWidth={1.4} strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Logoipsum",
    icon: (
      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none">
        <path
          d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export function FooterStrip() {
  return (
    <div className="relative h-20 w-full sm:h-24">
      <svg
        aria-hidden
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
      >
        {/* same sharp flat-diagonal-flat shape as HeroAccentLine, filled */}
        <path d="M0 15 H450 L520 175 H1200 V200 H0 Z" fill="#0a2e5d" />
      </svg>

      <div className="relative flex h-full items-end gap-6 px-8 pb-3 sm:gap-8 sm:px-16 sm:pb-4">
        <span className="mb-2 hidden h-px w-16 bg-gradient-to-r from-transparent via-brand-teal/40 to-brand-teal/40 sm:block" />
        {BRANDS.map((brand, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -3 }}
            className="mt-6 flex items-center gap-3 rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 py-2 pl-2 pr-5 text-sm text-white/70 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30 hover:text-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-teal/15 text-brand-teal ring-1 ring-inset ring-brand-teal/30 backdrop-blur-sm">
              {brand.icon}
            </span>
            <span className="font-medium">{brand.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
