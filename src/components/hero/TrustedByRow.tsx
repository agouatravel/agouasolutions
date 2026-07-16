import { motion, type Variants } from "framer-motion";

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

const AVATAR_COLORS = ["#f6c453", "#8fb8e0", "#f0a875", "#c9c2b6"];

export function TrustedByRow() {
  return (
    <motion.div variants={item} className="flex flex-col gap-3">
      <span className="text-xs tracking-[0.2em] text-neutral-500">
        Trusted by Clients
      </span>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {AVATAR_COLORS.map((color, index) => (
            <span
              key={color}
              className="h-9 w-9 rounded-full border-2 border-neutral-50"
              style={{ backgroundColor: color, zIndex: AVATAR_COLORS.length - index }}
            />
          ))}
        </div>
        <span className="text-lg font-semibold text-brand-navy">20+</span>
      </div>
    </motion.div>
  );
}
