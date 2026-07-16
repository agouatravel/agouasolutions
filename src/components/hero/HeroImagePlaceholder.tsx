"use client";

import Image from "next/image";
import { motion, useTransform, type MotionValue } from "framer-motion";

type HeroImagePlaceholderProps = {
  ready: boolean;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export function HeroImagePlaceholder({
  ready,
  pointerX,
  pointerY,
}: HeroImagePlaceholderProps) {
  const rotateY = useTransform(pointerX, [-1, 1], [-6, 6]);
  const rotateX = useTransform(pointerY, [-1, 1], [4, -4]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={ready ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      style={{ perspective: 1000 }}
      className="flex h-full w-full items-center justify-center"
    >
      <motion.div style={{ rotateX, rotateY }} className="w-full max-w-xs sm:max-w-sm">
        <Image
          src="/herosection.png"
          alt="AGOUA — immersive VR experience"
          width={720}
          height={920}
          priority
          className="h-auto w-full"
        />
      </motion.div>
    </motion.div>
  );
}
