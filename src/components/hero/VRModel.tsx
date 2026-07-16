"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF, Float } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import type { Group } from "three";

type VRModelProps = {
  url: string;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

export function VRModel({ url, pointerX, pointerY }: VRModelProps) {
  const group = useRef<Group>(null);
  const { scene } = useGLTF(url);

  useFrame(() => {
    if (!group.current) return;
    const targetY = pointerX.get() * 0.5;
    const targetX = pointerY.get() * 0.25;
    group.current.rotation.y += (targetY - group.current.rotation.y) * 0.05;
    group.current.rotation.x += (targetX - group.current.rotation.x) * 0.05;
  });

  return (
    <Float speed={1.5} rotationIntensity={0.25} floatIntensity={0.5}>
      <group ref={group} scale={1.4} position={[0, -0.3, 0]}>
        <primitive object={scene} />
      </group>
    </Float>
  );
}

export function preloadVRModel(url: string) {
  useGLTF.preload(url);
}
