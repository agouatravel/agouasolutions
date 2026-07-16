"use client";

import { motion, useTransform, type MotionValue } from "framer-motion";

type StatsBadgeProps = {
  ready: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export function StatsBadge({ ready, pointerX, pointerY }: StatsBadgeProps) {
  const translateX = useTransform(pointerX, [-1, 1], [-6, 6]);
  const translateY = useTransform(pointerY, [-1, 1], [-6, 6]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={ready ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ x: translateX, y: translateY }}
      className="absolute left-4 top-1/3 flex flex-col gap-1 rounded-2xl bg-white/80 px-5 py-4 shadow-lg shadow-black/5 backdrop-blur sm:left-6"
    >
      <motion.span
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="text-2xl font-semibold text-brand-navy"
      >
        47.2%
      </motion.span>
      <span className="text-xs text-neutral-500">Reality</span>
    </motion.div>
  );
}
