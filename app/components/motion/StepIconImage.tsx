"use client";

import { forwardRef } from "react";

const StepIconImage = forwardRef<HTMLImageElement, { src: string; alt: string; size?: number }>(
  function StepIconImage({ src, alt, size = 128 }, ref) {
    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        style={{
          width: size,
          height: size,
          clipPath: "circle(0% at 50% 50%)",
          willChange: "clip-path",
        }}
      />
    );
  }
);

export default StepIconImage;
