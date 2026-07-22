"use client";

import { useEffect, useRef } from "react";
import Lottie, { type LottieRefCurrentProps } from "lottie-react";

export default function LottieIcon({
  animationData,
  size = 52,
}: {
  animationData: object;
  size?: number;
}) {
  const lottieRef = useRef<LottieRefCurrentProps>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      lottieRef.current?.pause();
    }
  }, []);

  return (
    <Lottie
      lottieRef={lottieRef}
      animationData={animationData}
      loop
      autoplay
      style={{ width: size, height: size }}
    />
  );
}
