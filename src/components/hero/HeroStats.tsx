import { motion, type Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

// Placeholder figures — swap for AGOUA's real numbers when available.
const STATS = [
  { value: "50+", label: "Projects Delivered" },
  { value: "5+", label: "Years of Experience" },
  { value: "100%", label: "Client Satisfaction" },
];

export function HeroStats() {
  return (
    <motion.div variants={item} className="flex items-center gap-8">
      {STATS.map((stat, index) => (
        <div key={stat.label} className="flex items-center gap-8">
          {index > 0 && <span className="h-8 w-px bg-neutral-200" />}
          <div className="flex flex-col">
            <span className="text-xl font-semibold text-brand-navy">
              {stat.value}
            </span>
            <span className="text-xs text-neutral-500">{stat.label}</span>
          </div>
        </div>
      ))}
    </motion.div>
  );
}
