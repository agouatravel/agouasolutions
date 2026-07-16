"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Float, MeshDistortMaterial } from "@react-three/drei";
import type { MotionValue } from "framer-motion";
import type { Mesh } from "three";

type ProceduralPlaceholderProps = {
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
};

/**
 * Stylized fallback shown until a real /models/vr-headset.glb is dropped in
 * (or if it fails to load). Still fully mouse-interactive in 3D so the page
 * never looks broken while waiting on a real asset.
 */
export function ProceduralPlaceholder({
  pointerX,
  pointerY,
}: ProceduralPlaceholderProps) {
  const mesh = useRef<Mesh>(null);

  useFrame((_, delta) => {
    if (!mesh.current) return;
    const targetY = pointerX.get() * 0.6;
    const targetX = pointerY.get() * 0.3;
    mesh.current.rotation.y += (targetY - mesh.current.rotation.y) * 0.05;
    mesh.current.rotation.x += (targetX - mesh.current.rotation.x) * 0.05;
    mesh.current.rotation.z += delta * 0.04;
  });

  return (
    <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
      <mesh ref={mesh} scale={1.6}>
        <icosahedronGeometry args={[1, 8]} />
        <MeshDistortMaterial
          color="#14151a"
          roughness={0.15}
          metalness={0.6}
          distort={0.35}
          speed={1.8}
        />
      </mesh>
    </Float>
  );
}
