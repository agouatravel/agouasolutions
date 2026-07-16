"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { ContactShadows, Environment } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import { VRModel } from "./VRModel";
import { ProceduralPlaceholder } from "./ProceduralPlaceholder";
import { ModelErrorBoundary } from "./ModelErrorBoundary";

const MODEL_URL = "/models/vr-headset.glb";

type VRSceneProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export function VRScene({ pointerX, pointerY }: VRSceneProps) {
  const placeholder = (
    <ProceduralPlaceholder pointerX={pointerX} pointerY={pointerY} />
  );

  return (
    <Canvas
      camera={{ position: [0, 0, 4.5], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 4, 2]} intensity={1.4} />
      <Suspense fallback={placeholder}>
        <ModelErrorBoundary fallback={placeholder}>
          <VRModel url={MODEL_URL} pointerX={pointerX} pointerY={pointerY} />
        </ModelErrorBoundary>
        <Environment preset="city" />
        <ContactShadows
          position={[0, -1.4, 0]}
          opacity={0.35}
          blur={2.5}
          far={3}
        />
      </Suspense>
    </Canvas>
  );
}
