"use client";

import { useEffect, useRef, useState, useCallback, type CSSProperties } from "react";
import { useMotionValue, animate, useMotionValueEvent } from "framer-motion";
import {
  Scene,
  PerspectiveCamera,
  WebGLRenderer,
  BoxGeometry,
  SkinnedMesh,
  MeshStandardMaterial,
  Texture,
  Vector3,
  Quaternion,
  Bone,
  Skeleton,
  Float32BufferAttribute,
  Uint16BufferAttribute,
  FrontSide,
  RepeatWrapping,
  LinearFilter,
  SRGBColorSpace,
  RGBAFormat,
  Color,
  DirectionalLight,
  AmbientLight,
  PlaneGeometry,
  Mesh,
  Group,
  ShadowMaterial,
  PCFShadowMap,
} from "three";

// ============================================================================
// IMAGE SOURCE RESOLUTION
// ============================================================================

type ImageInput = string | { src?: string } | undefined;

function resolveImageSource(input: ImageInput): string | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return input.trim() || undefined;
  return input.src || undefined;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const CAMERA_DISTANCE = 1200;
const CAMERA_NEAR = 100;
const CAMERA_FAR = 2000;
const STICKER_DEPTH = 0.003;
const CANVAS_SCALE = 4; // 4x container size, gives room for shadows without clipping

const BONE_GRID_X = 30;
const BONE_GRID_Y = 30;
const SEGMENTS_W = 80;
const SEGMENTS_H = 60;

// Fixed internal curl radius. The fold start is derived from the peel amount
// so 100% rolls the whole sticker.
const FIXED_CURL_RADIUS = 0.15;
// Constant curl tightness so the peeled flap always visibly curls, even at
// low peel percentages (no dead zone). Peel % only controls how much lifts.
const FIXED_CURL_FACTOR = 0.6;

// Reusable scratch objects, avoid per-frame allocations
const _scratchQuat = new Quaternion();
const _scratchRotAxis = new Vector3();

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function calculateCameraFov(width: number, height: number, distance: number) {
  const aspect = width / height;
  return 2 * Math.atan(width / aspect / (2 * distance)) * (180 / Math.PI);
}

function mapLinear(value: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  if (inMax === inMin) return outMin;
  const t = (value - inMin) / (inMax - inMin);
  return outMin + t * (outMax - outMin);
}

function mapInternalRadiusToUIValue(ui: number) {
  const clamped = Math.max(0.1, Math.min(1, ui));
  return mapLinear(clamped, 0.1, 1, 0.05, 1 / Math.PI);
}

// ============================================================================
// COLOR UTILITIES
// ============================================================================

const cssVariableRegex = /var\s*\(\s*(--[\w-]+)(?:\s*,\s*((?:[^)(]+|\((?:[^)(]+|\([^)(]*\))*\))*))?\s*\)/;

function extractDefaultValue(cssVar: string): string {
  if (!cssVar || !cssVar.startsWith("var(")) return cssVar;
  const match = cssVariableRegex.exec(cssVar);
  if (!match) return cssVar;
  const fallback = (match[2] || "").trim();
  if (fallback.startsWith("var(")) return extractDefaultValue(fallback);
  return fallback || cssVar;
}

function resolveTokenColor(input: string): string {
  if (typeof input !== "string") return input;
  if (!input.startsWith("var(")) return input;
  return extractDefaultValue(input);
}

function parseColorToRgba(input: string): { r: number; g: number; b: number; a: number } {
  if (!input) return { r: 0, g: 0, b: 0, a: 1 };
  const str = input.trim();

  const rgbaMatch = str.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/i);
  if (rgbaMatch) {
    return {
      r: Math.max(0, Math.min(255, parseFloat(rgbaMatch[1]))) / 255,
      g: Math.max(0, Math.min(255, parseFloat(rgbaMatch[2]))) / 255,
      b: Math.max(0, Math.min(255, parseFloat(rgbaMatch[3]))) / 255,
      a: rgbaMatch[4] !== undefined ? Math.max(0, Math.min(1, parseFloat(rgbaMatch[4]))) : 1,
    };
  }

  const hex = str.replace(/^#/, "");
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  if (hex.length === 6) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: 1,
    };
  }
  if (hex.length === 4) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: parseInt(hex[3] + hex[3], 16) / 255,
    };
  }
  if (hex.length === 3) {
    return {
      r: parseInt(hex[0] + hex[0], 16) / 255,
      g: parseInt(hex[1] + hex[1], 16) / 255,
      b: parseInt(hex[2] + hex[2], 16) / 255,
      a: 1,
    };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
}

/**
 * When showing the same image on the back of a thin surface it must be mirrored
 * so it looks correct to the viewer when the sticker flips/curls.
 * Never mutates the front texture, clones first if they're the same object.
 */
function makeBackTextureViewConsistent(tex: Texture | null, frontTex: Texture | null): Texture | null {
  if (!tex) return null;
  const out = tex === frontTex && typeof tex.clone === "function" ? tex.clone() : tex;
  out.wrapS = RepeatWrapping;
  out.repeat.x = -1;
  out.offset.x = 1;
  out.needsUpdate = true;
  return out;
}

// ============================================================================
// COMPONENT
// ============================================================================

interface StickerPeelProps {
  image?: ImageInput;
  imageWidth?: number;
  imageHeight?: number;
  curlRotation?: number;
  hoverPeel?: number;
  pressPeel?: number;
  transition?: {
    type?: "tween" | "spring";
    duration?: number;
    ease?: string;
    delay?: number;
    stiffness?: number;
    damping?: number;
    mass?: number;
    bounce?: number;
    restDelta?: number;
    restSpeed?: number;
  };
  backColor?: string;
  shadowEnabled?: boolean;
  shadow?: { opacity?: number; color?: string; x?: number; y?: number };
  style?: CSSProperties;
}

export default function StickerPeel({
  image,
  imageWidth = 200,
  imageHeight = 200,
  curlRotation = 240,
  hoverPeel = 45,
  pressPeel = 64,
  transition = { type: "tween", duration: 0.6, ease: "easeInOut" },
  backColor = "#000000",
  shadowEnabled = true,
  shadow,
  style,
}: StickerPeelProps) {
  const shadowCfg = { opacity: 30, color: "#000000", x: -300, y: 140, ...shadow };
  const castShadowOpacity = shadowEnabled ? shadowCfg.opacity : 0;
  const shadowColor = shadowCfg.color;
  const shadowPositionX = shadowCfg.x;
  const shadowPositionY = shadowCfg.y;

  // ------------------------------------------------------------------
  // Refs
  // ------------------------------------------------------------------
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- three.js scene graph refs, precise typing isn't worth the churn here
  const sceneRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rendererRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cameraRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const meshRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const groupRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bonesRef = useRef<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bonesInitialPositionsRef = useRef<any[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const imageLoadAbortRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const lightRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ambientLightRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const backgroundPlaneRef = useRef<any>(null);
  const curlRotationRef = useRef(curlRotation);
  const pendingUpdateRef = useRef(false);
  const lastRetryAttemptRef = useRef(0);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const animationControlsRef = useRef<Record<string, any>>({});
  const isHoveringRef = useRef(false);
  const isPressedRef = useRef(false);
  const lastBuiltSizeRef = useRef<{ width: number; height: number } | null>(null);
  const isAnimatingRef = useRef(false);
  const renderLoopIdRef = useRef<number | null>(null);

  const resolvedImageUrl = resolveImageSource(image);
  const hasContent = !!resolvedImageUrl;

  const curlAmountMotion = useMotionValue(0);
  const animatedCurlRef = useRef({ amount: 0 });

  const [textureLoaded, setTextureLoaded] = useState(false);
  const [contextLost, setContextLost] = useState(false);
  const [sceneReady, setSceneReady] = useState(false);

  // ================================================================
  // CREATE STICKER GEOMETRY WITH 2D BILINEAR SKINNING
  // ================================================================
  const createStickerGeometry = useCallback((width: number, height: number, gridX: number, gridY: number) => {
    const geometry = new BoxGeometry(width, height, STICKER_DEPTH, SEGMENTS_W, SEGMENTS_H, 1);

    const position = geometry.attributes.position;
    const vertex = new Vector3();
    const skinIndexes: number[] = [];
    const skinWeights: number[] = [];

    for (let i = 0; i < position.count; i++) {
      vertex.fromBufferAttribute(position, i);

      const normalizedX = (vertex.x + width / 2) / width;
      const normalizedY = (vertex.y + height / 2) / height;
      const gridXPos = normalizedX * (gridX - 1);
      const gridYPos = normalizedY * (gridY - 1);
      const x0 = Math.floor(gridXPos);
      const y0 = Math.floor(gridYPos);
      const x1 = Math.min(x0 + 1, gridX - 1);
      const y1 = Math.min(y0 + 1, gridY - 1);
      const tx = gridXPos - x0;
      const ty = gridYPos - y0;

      const idx00 = y0 * gridX + x0;
      const idx10 = y0 * gridX + x1;
      const idx01 = y1 * gridX + x0;
      const idx11 = y1 * gridX + x1;

      skinIndexes.push(idx00, idx10, idx01, idx11);
      skinWeights.push((1 - tx) * (1 - ty), tx * (1 - ty), (1 - tx) * ty, tx * ty);
    }

    geometry.setAttribute("skinIndex", new Uint16BufferAttribute(skinIndexes, 4));
    geometry.setAttribute("skinWeight", new Float32BufferAttribute(skinWeights, 4));
    geometry.computeVertexNormals();
    return geometry;
  }, []);

  // ================================================================
  // BONE ANIMATION (2D Bone Grid with Fold Line)
  // ================================================================
  const updateBones = useCallback(() => {
    if (!bonesRef.current.length || !meshRef.current || !bonesInitialPositionsRef.current.length) return;
    if (!meshRef.current.skeleton) return;

    const skeletonBones = meshRef.current.skeleton.bones;
    if (!skeletonBones?.length) return;

    meshRef.current.updateMatrixWorld(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    skeletonBones.forEach((bone: any) => {
      if (bone && typeof bone.updateMatrixWorld === "function") bone.updateMatrixWorld(true);
    });
    meshRef.current.skeleton.update();

    const bones = bonesRef.current;
    const initialPositions = bonesInitialPositionsRef.current;
    const amount = Math.min(1, Math.max(0, animatedCurlRef.current.amount));
    const curlStart = 1 - amount;
    const curlFactor = amount <= 0 ? 1e-4 : FIXED_CURL_FACTOR;
    const r = mapInternalRadiusToUIValue(FIXED_CURL_RADIUS);

    const { geometry } = meshRef.current;
    const width: number = geometry.parameters.width;
    const height: number = geometry.parameters.height;

    const curlRotationRad = curlRotationRef.current * (Math.PI / 180);
    const dirX = Math.cos(curlRotationRad);
    const dirY = Math.sin(curlRotationRad);

    _scratchRotAxis.set(-dirY, dirX, 0).normalize();

    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const maxDistAlongDir = Math.max(
      halfWidth * dirX + halfHeight * dirY,
      halfWidth * dirX - halfHeight * dirY,
      -halfWidth * dirX + halfHeight * dirY,
      -halfWidth * dirX - halfHeight * dirY
    );
    const diagonalLength = Math.sqrt(width * width + height * height);
    const maxDistFromCenter = diagonalLength / 2;
    const foldOffset = -maxDistAlongDir + curlStart * 2 * maxDistAlongDir;

    const radiusWorld = r * maxDistFromCenter;
    const RPrime = radiusWorld / curlFactor;
    const arcLimit = Math.PI * radiusWorld;

    for (let i = 0; i < bones.length; i++) {
      const bone = bones[i];
      const initialPos = initialPositions[i];
      const distOnDir = initialPos.x * dirX + initialPos.y * dirY;
      const signedDist = distOnDir - foldOffset;

      if (signedDist > 0) {
        let xRel: number, zRel: number, finalAngle: number;

        const angle_s = (signedDist * curlFactor) / radiusWorld;
        if (signedDist <= arcLimit) {
          xRel = RPrime * Math.sin(angle_s);
          zRel = RPrime * (1 - Math.cos(angle_s));
          finalAngle = angle_s;
        } else {
          const Phi = Math.PI * curlFactor;
          const xArcEnd = RPrime * Math.sin(Phi);
          const zArcEnd = RPrime * (1 - Math.cos(Phi));
          const extra = signedDist - arcLimit;
          xRel = xArcEnd + extra * Math.cos(Phi);
          zRel = zArcEnd + extra * Math.sin(Phi);
          finalAngle = Phi;
        }

        const dx = xRel - signedDist;
        bone.position.x = initialPos.x + dx * dirX;
        bone.position.y = initialPos.y + dx * dirY;
        bone.position.z = initialPos.z + zRel;
        _scratchQuat.setFromAxisAngle(_scratchRotAxis, -finalAngle);
        bone.quaternion.copy(_scratchQuat);
      } else {
        bone.position.copy(initialPos);
        bone.quaternion.identity();
      }
    }

    meshRef.current.skeleton?.update();
  }, []);

  const scheduleBoneUpdate = useCallback(() => {
    if (pendingUpdateRef.current) return;
    pendingUpdateRef.current = true;
    requestAnimationFrame(() => {
      pendingUpdateRef.current = false;
      updateBones();
    });
  }, [updateBones]);

  useMotionValueEvent(curlAmountMotion, "change", (latest) => {
    animatedCurlRef.current.amount = latest;
    scheduleBoneUpdate();
  });

  // ================================================================
  // RENDERING, single frame, no loop
  // ================================================================
  const renderFrame = useCallback(() => {
    if (!rendererRef.current || !sceneRef.current || !cameraRef.current) return;
    const gl = rendererRef.current.getContext();
    if (!gl || gl.isContextLost()) return;

    if (meshRef.current?.skeleton) {
      meshRef.current.updateMatrixWorld(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      meshRef.current.skeleton.bones.forEach((bone: any) => {
        if (bone && typeof bone.updateMatrixWorld === "function") {
          bone.updateMatrixWorld(true);
        }
      });
      meshRef.current.skeleton.update();
    }
    rendererRef.current.render(sceneRef.current, cameraRef.current);
  }, []);

  // Gated animation render loop, only runs while a tween is in flight
  const startRenderLoop = useCallback(() => {
    if (isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    const loop = () => {
      if (!isAnimatingRef.current) return;
      renderFrame();
      renderLoopIdRef.current = requestAnimationFrame(loop);
    };
    renderLoopIdRef.current = requestAnimationFrame(loop);
  }, [renderFrame]);

  const stopRenderLoop = useCallback(() => {
    isAnimatingRef.current = false;
    if (renderLoopIdRef.current !== null) {
      cancelAnimationFrame(renderLoopIdRef.current);
      renderLoopIdRef.current = null;
    }
    requestAnimationFrame(() => renderFrame());
  }, [renderFrame]);

  // ================================================================
  // BACK TEXTURE CREATION
  // ================================================================
  const createBackTexture = useCallback((img: HTMLImageElement, backColorValue: string) => {
    const backCanvas = document.createElement("canvas");
    backCanvas.width = img.width;
    backCanvas.height = img.height;
    const backCtx = backCanvas.getContext("2d");
    if (!backCtx) return null;

    const resolved = resolveTokenColor(backColorValue);
    const { r, g, b, a: backA } = parseColorToRgba(resolved);
    const backR = Math.round(r * 255);
    const backG = Math.round(g * 255);
    const backB = Math.round(b * 255);

    backCtx.drawImage(img, 0, 0);
    const imageData = backCtx.getImageData(0, 0, img.width, img.height);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const imgR = imageData.data[i];
      const imgG = imageData.data[i + 1];
      const imgB = imageData.data[i + 2];

      if (backA >= 1) {
        imageData.data[i] = backR;
        imageData.data[i + 1] = backG;
        imageData.data[i + 2] = backB;
      } else if (backA > 0) {
        imageData.data[i] = Math.round(backR * backA + imgR * (1 - backA));
        imageData.data[i + 1] = Math.round(backG * backA + imgG * (1 - backA));
        imageData.data[i + 2] = Math.round(backB * backA + imgB * (1 - backA));
      }
    }

    backCtx.putImageData(imageData, 0, 0);
    const tex = new Texture(backCanvas);
    tex.needsUpdate = true;
    tex.minFilter = LinearFilter;
    tex.colorSpace = SRGBColorSpace;
    tex.format = RGBAFormat;
    return tex;
  }, []);

  // ================================================================
  // SCENE SETUP, driven by imageWidth x imageHeight
  // ================================================================
  const setupScene = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return null;

    const meshW = imageWidth;
    const meshH = imageHeight;
    if (meshW <= 0 || meshH <= 0) return null;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const canvasWidth = meshW * CANVAS_SCALE;
    const canvasHeight = meshH * CANVAS_SCALE;

    const scene = new Scene();
    sceneRef.current = scene;

    const camera = new PerspectiveCamera(
      calculateCameraFov(canvasWidth, canvasHeight, CAMERA_DISTANCE),
      canvasWidth / canvasHeight,
      CAMERA_NEAR,
      CAMERA_FAR
    );
    camera.position.set(0, 0, CAMERA_DISTANCE);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    if (rendererRef.current) {
      try {
        rendererRef.current.dispose();
        rendererRef.current.forceContextLoss();
      } catch {
        // ignore
      }
      rendererRef.current = null;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let renderer: any;
    try {
      renderer = new WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });
      const gl = renderer.getContext();
      if (!gl || gl.isContextLost()) {
        setContextLost(true);
        renderer.dispose();
        renderer.forceContextLoss();
        return null;
      }
      renderer.setSize(Math.round(canvasWidth * dpr), Math.round(canvasHeight * dpr), false);
      renderer.setPixelRatio(1);
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = PCFShadowMap;
      rendererRef.current = renderer;
    } catch {
      setContextLost(true);
      return null;
    }

    canvasRef.current.style.width = `${canvasWidth}px`;
    canvasRef.current.style.height = `${canvasHeight}px`;

    const geometry = createStickerGeometry(meshW, meshH, BONE_GRID_X, BONE_GRID_Y);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const bones: any[] = [];
    const boneSpacingX = meshW / (BONE_GRID_X - 1);
    const boneSpacingY = meshH / (BONE_GRID_Y - 1);
    for (let y = 0; y < BONE_GRID_Y; y++) {
      for (let x = 0; x < BONE_GRID_X; x++) {
        const bone = new Bone();
        bone.position.x = -meshW / 2 + x * boneSpacingX;
        bone.position.y = -meshH / 2 + y * boneSpacingY;
        bone.position.z = 0;
        bones.push(bone);
      }
    }
    bonesRef.current = bones;
    bonesInitialPositionsRef.current = bones.map((b) => b.position.clone());

    const skeleton = new Skeleton(bones);

    const resolved = resolveTokenColor(backColor);
    const backColorRgba = parseColorToRgba(resolved);

    const frontMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      side: FrontSide,
      transparent: true,
      roughness: 0.2,
      metalness: 0.4,
      emissive: 0xffffff,
      emissiveIntensity: 0.8,
    });
    const backMaterial = new MeshStandardMaterial({
      color: 0xffffff,
      side: FrontSide,
      transparent: true,
      roughness: 0.3,
      metalness: 0,
      emissive: 0xffffff,
      emissiveIntensity: 0.3,
    });
    const sideMaterial = new MeshStandardMaterial({
      color: new Color(backColorRgba.r, backColorRgba.g, backColorRgba.b),
      transparent: true,
      opacity: 1,
      roughness: 0.1,
      metalness: 0,
    });

    // BoxGeometry face order: +X, -X, +Y, -Y, +Z (front), -Z (back)
    const materials = [sideMaterial, sideMaterial, sideMaterial, sideMaterial, frontMaterial, backMaterial];

    const mesh = new SkinnedMesh(geometry, materials);
    mesh.frustumCulled = false;
    bones.forEach((bone) => {
      mesh.add(bone);
      bone.updateMatrixWorld(true);
    });
    mesh.bind(skeleton);
    mesh.updateMatrixWorld(true);
    skeleton.update();
    mesh.castShadow = true;
    mesh.receiveShadow = false;

    const group = new Group();
    groupRef.current = group;
    mesh.position.set(0, 0, 0);
    group.add(mesh);
    meshRef.current = mesh;
    lastBuiltSizeRef.current = { width: meshW, height: meshH };
    scene.add(group);

    // Lighting
    const shadowIntensity = 1;
    const ambientLight = new AmbientLight(0xffffff, Math.max(1 - shadowIntensity * 0.6, 0.4));
    ambientLightRef.current = ambientLight;
    scene.add(ambientLight);

    const directionalLight = new DirectionalLight(0xffffff, 0.3 + shadowIntensity * 1.7);
    directionalLight.position.set(shadowPositionX, shadowPositionY, 400);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 1;
    directionalLight.shadow.camera.far = 2000;
    directionalLight.shadow.bias = -0.00001;
    directionalLight.shadow.radius = 8;

    const baseShadowSize = Math.max(canvasWidth, canvasHeight);
    const shadowCameraSize = Math.max(baseShadowSize, baseShadowSize * (3.5 / CANVAS_SCALE));
    const shadowOffsetX = shadowPositionX * 0.3;
    const shadowOffsetY = shadowPositionY * 0.3;
    directionalLight.shadow.camera.left = -shadowCameraSize / 2 + shadowOffsetX;
    directionalLight.shadow.camera.right = shadowCameraSize / 2 + shadowOffsetX;
    directionalLight.shadow.camera.top = shadowCameraSize / 2 + shadowOffsetY;
    directionalLight.shadow.camera.bottom = -shadowCameraSize / 2 + shadowOffsetY;
    lightRef.current = directionalLight;
    scene.add(directionalLight);

    const scRgba = parseColorToRgba(resolveTokenColor(shadowColor));
    const shadowMat = new ShadowMaterial({
      opacity: castShadowOpacity / 100,
      color: new Color(scRgba.r, scRgba.g, scRgba.b),
    });
    const planeGeometry = new PlaneGeometry(shadowCameraSize, shadowCameraSize);
    const backgroundPlane = new Mesh(planeGeometry, shadowMat);
    backgroundPlane.receiveShadow = true;
    backgroundPlane.position.set(0, 0, -1);
    backgroundPlaneRef.current = backgroundPlane;
    scene.add(backgroundPlane);

    renderer.render(scene, camera);
    setSceneReady(true);
    return { scene, camera, renderer, mesh, bones };
  }, [createStickerGeometry, shadowPositionX, shadowPositionY, castShadowOpacity, shadowColor, backColor, imageWidth, imageHeight]);

  // ================================================================
  // TEXTURE LOADING
  // ================================================================
  const loadTexture = useCallback(() => {
    if (!resolvedImageUrl || !meshRef.current) {
      setTextureLoaded(false);
      return;
    }
    setTextureLoaded(false);
    imageLoadAbortRef.current = false;

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      if (imageLoadAbortRef.current || !meshRef.current) return;
      loadedImageRef.current = img;

      if (!meshRef.current?.material) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const materials = meshRef.current.material as any[];
      const hasTexture = Array.isArray(materials) && materials[4]?.map;
      let texture: Texture;

      if (hasTexture) {
        texture = materials[4].map;
        if (texture) texture.needsUpdate = true;
      } else {
        texture = new Texture(img);
        texture.needsUpdate = true;
        texture.minFilter = LinearFilter;
        texture.colorSpace = SRGBColorSpace;
        texture.format = RGBAFormat;
      }

      const backColorRgba = parseColorToRgba(resolveTokenColor(backColor));
      const rawBackTexture = backColorRgba.a <= 0 ? texture : createBackTexture(img, backColor);
      const backTexture = makeBackTextureViewConsistent(rawBackTexture, texture);

      if (Array.isArray(materials)) {
        if (materials[4]) {
          if (materials[4].map !== texture) {
            materials[4].map = texture;
            texture.needsUpdate = true;
          }
          materials[4].transparent = true;
          materials[4].alphaTest = 0.01;
          materials[4].emissiveMap = texture;
          materials[4].emissive = new Color(0xffffff);
          materials[4].emissiveIntensity = 0.8;
          materials[4].needsUpdate = true;
        }
        if (materials[5]) {
          if (backTexture) {
            materials[5].map = backTexture;
            materials[5].transparent = true;
            materials[5].alphaTest = 0.01;
            if (backColorRgba.a <= 0) {
              materials[5].emissiveMap = texture;
              materials[5].emissive = new Color(0xffffff);
              materials[5].emissiveIntensity = 0.8;
            }
          }
          materials[5].needsUpdate = true;
        }
        for (let i = 0; i < 4; i++) {
          if (materials[i] && texture) {
            materials[i].map = texture;
            materials[i].transparent = true;
            materials[i].alphaTest = 0.01;
            materials[i].emissiveMap = texture;
            materials[i].emissive = new Color(0xffffff);
            materials[i].emissiveIntensity = 0.8;
            materials[i].needsUpdate = true;
          }
        }
      }

      setTextureLoaded(true);
      setSceneReady(true);

      if (!imageLoadAbortRef.current && meshRef.current) {
        requestAnimationFrame(() => {
          if (imageLoadAbortRef.current || !meshRef.current) return;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (meshRef.current.material as any[]).forEach((mat: any) => {
            if (mat) {
              mat.needsUpdate = true;
              if (mat.map) mat.map.needsUpdate = true;
            }
          });
          meshRef.current.updateMatrixWorld(true);
          meshRef.current.skeleton?.update();
          updateBones();
          renderFrame();
        });
      }
    };

    img.onerror = () => {
      if (!imageLoadAbortRef.current) console.error("Sticker texture failed to load");
      setTextureLoaded(false);
      if (!imageLoadAbortRef.current && meshRef.current) renderFrame();
    };

    img.src = resolvedImageUrl;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolvedImageUrl, backColor, createBackTexture, renderFrame]);

  // ================================================================
  // HOVER / PRESS ANIMATION
  // ================================================================
  const buildTransitionConfig = useCallback((transitionValue: StickerPeelProps["transition"]) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const config: Record<string, any> = { ...(transitionValue?.type && { type: transitionValue.type }) };
    if (!transitionValue?.type || transitionValue.type === "tween") {
      config.duration = transitionValue?.duration ?? 0.6;
      if (transitionValue?.ease) config.ease = transitionValue.ease;
      if (transitionValue?.delay !== undefined) config.delay = transitionValue.delay;
    }
    if (transitionValue?.type === "spring") {
      (["stiffness", "damping", "mass", "bounce", "restDelta", "restSpeed", "duration"] as const).forEach((k) => {
        if (transitionValue[k] !== undefined) config[k] = transitionValue[k];
      });
    }
    return config;
  }, []);

  const animateCurlTo = useCallback(
    (targetNormalized: number) => {
      animationControlsRef.current.curlAmount?.stop();
      const cfg = buildTransitionConfig(transition);
      startRenderLoop();
      animationControlsRef.current.curlAmount = animate(curlAmountMotion, targetNormalized, {
        ...cfg,
        onComplete: () => stopRenderLoop(),
      });
    },
    [transition, curlAmountMotion, buildTransitionConfig, startRenderLoop, stopRenderLoop]
  );

  const handlePointerEnter = useCallback(() => {
    if (isHoveringRef.current) return;
    isHoveringRef.current = true;
    if (containerRef.current) containerRef.current.style.cursor = "pointer";
    if (!isPressedRef.current) {
      animateCurlTo(hoverPeel / 100);
    }
  }, [hoverPeel, animateCurlTo]);

  const handlePointerLeave = useCallback(() => {
    isHoveringRef.current = false;
    isPressedRef.current = false;
    if (containerRef.current) containerRef.current.style.cursor = "auto";
    animateCurlTo(0);
  }, [animateCurlTo]);

  const handlePointerDown = useCallback(() => {
    isPressedRef.current = true;
    animateCurlTo(pressPeel / 100);
  }, [pressPeel, animateCurlTo]);

  const handlePointerUp = useCallback(() => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    if (isHoveringRef.current) {
      animateCurlTo(hoverPeel / 100);
    } else {
      animateCurlTo(0);
    }
  }, [hoverPeel, animateCurlTo]);

  // ================================================================
  // CLEANUP HELPER
  // ================================================================
  const cleanupScene = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    stopRenderLoop();
    setSceneReady(false);
    if (meshRef.current) {
      const oldMesh = meshRef.current;
      groupRef.current?.remove(oldMesh);
      sceneRef.current?.remove(oldMesh);
      oldMesh.geometry?.dispose();
      if (Array.isArray(oldMesh.material)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        oldMesh.material.forEach((mat: any) => {
          mat.map?.dispose();
          mat.dispose();
        });
      } else if (oldMesh.material) {
        oldMesh.material.map?.dispose();
        oldMesh.material.dispose();
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      oldMesh.skeleton?.bones.forEach((bone: any) => bone.parent?.remove(bone));
      meshRef.current = null;
    }
    bonesRef.current = [];
    bonesInitialPositionsRef.current = [];
    groupRef.current = null;
    if (rendererRef.current) {
      try {
        rendererRef.current.dispose();
        // dispose() only frees three.js-side bookkeeping (programs, caches);
        // it does not release the underlying WebGL context. Without this,
        // every card that ever mounts (LogosSection reshuffles indefinitely
        // every 9s) leaks a real context until the browser hits its context
        // limit and starts force-evicting the oldest one — a heavy stall
        // that was showing up as scroll jank.
        rendererRef.current.forceContextLoss();
      } catch {
        // ignore
      }
      rendererRef.current = null;
    }
    if (sceneRef.current) {
      try {
        while (sceneRef.current.children.length > 0) {
          const child = sceneRef.current.children[0];
          sceneRef.current.remove(child);
          child.dispose?.();
        }
        sceneRef.current.clear();
      } catch {
        // ignore
      }
      sceneRef.current = null;
    }
    cameraRef.current = null;
    lightRef.current = null;
    ambientLightRef.current = null;
    backgroundPlaneRef.current = null;
    loadedImageRef.current = null;
    animationControlsRef.current.curlAmount?.stop();
    animationControlsRef.current = {};
    imageLoadAbortRef.current = true;
  }, [stopRenderLoop]);

  // ================================================================
  // EFFECTS
  // ================================================================

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const onLost = (e: Event) => {
      e.preventDefault();
      setContextLost(true);
    };
    const onRestored = () => {
      setContextLost(false);
      setSceneReady(false);
      if (hasContent) {
        const s = setupScene();
        if (s && meshRef.current) {
          meshRef.current.skeleton?.update();
          updateBones();
          renderFrame();
          loadTexture();
        }
      }
    };

    canvas.addEventListener("webglcontextlost", onLost, false);
    canvas.addEventListener("webglcontextrestored", onRestored, false);
    return () => {
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    };
  }, [hasContent, setupScene, updateBones, renderFrame, loadTexture]);

  useEffect(() => {
    if (!contextLost || !hasContent) return;
    const now = Date.now();
    if (now - lastRetryAttemptRef.current < 2000) return;
    lastRetryAttemptRef.current = now;
    setContextLost(false);
    setSceneReady(false);
    imageLoadAbortRef.current = false;
    const t = setTimeout(() => {
      const s = setupScene();
      if (s && meshRef.current) {
        meshRef.current.skeleton?.update();
        updateBones();
        renderFrame();
        loadTexture();
      }
    }, 100);
    return () => clearTimeout(t);
  }, [
    resolvedImageUrl,
    curlRotation,
    backColor,
    shadowPositionX,
    shadowPositionY,
    castShadowOpacity,
    contextLost,
    hasContent,
    setupScene,
    updateBones,
    renderFrame,
    loadTexture,
  ]);

  useEffect(() => {
    if (!hasContent) {
      imageLoadAbortRef.current = true;
      // eslint-disable-next-line react-hooks/set-state-in-effect -- tearing down the WebGL scene when the image is removed is synchronous cleanup, not a derived-render loop
      setSceneReady(false);
      if (rendererRef.current) {
        try {
          rendererRef.current.dispose();
          rendererRef.current.forceContextLoss();
        } catch {
          // ignore
        }
        rendererRef.current = null;
      }
      if (sceneRef.current) {
        try {
          sceneRef.current.clear();
        } catch {
          // ignore
        }
        sceneRef.current = null;
      }
      meshRef.current = null;
      bonesRef.current = [];
      bonesInitialPositionsRef.current = [];
      lightRef.current = null;
      ambientLightRef.current = null;
      backgroundPlaneRef.current = null;
      loadedImageRef.current = null;
      return;
    }

    imageLoadAbortRef.current = false;
    const sceneSetup = setupScene();

    if (!sceneSetup) {
      const t = setTimeout(() => {
        const retry = setupScene();
        if (retry && meshRef.current) {
          meshRef.current.skeleton?.update();
          updateBones();
          renderFrame();
          loadTexture();
        }
      }, 100);
      return () => clearTimeout(t);
    }

    if (meshRef.current) {
      meshRef.current.skeleton?.update();
      updateBones();
      renderFrame();
      loadTexture();
    }

    return () => {
      cleanupScene();
    };
  }, [hasContent, setupScene, loadTexture, updateBones, renderFrame, cleanupScene]);

  useEffect(() => {
    if (!sceneRef.current || !meshRef.current) return;
    const built = lastBuiltSizeRef.current;
    if (built && built.width === imageWidth && built.height === imageHeight) return;
    // Size changes rebuild the whole scene (simpler + rare in practice here).
    cleanupScene();
    const s = setupScene();
    if (s && meshRef.current) {
      updateBones();
      renderFrame();
      loadTexture();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imageWidth, imageHeight]);

  useEffect(() => {
    curlRotationRef.current = curlRotation;
    if (!meshRef.current || !bonesRef.current.length) return;
    updateBones();
    renderFrame();
  }, [curlRotation, updateBones, renderFrame]);

  useEffect(() => {
    if (!meshRef.current?.material || !loadedImageRef.current) return;
    const img = loadedImageRef.current;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const materials = meshRef.current.material as any[];
    if (!Array.isArray(materials)) return;

    const backColorRgba = parseColorToRgba(resolveTokenColor(backColor));
    const frontTexture = materials[4]?.map;
    const rawBackTexture = backColorRgba.a <= 0 && frontTexture ? frontTexture : createBackTexture(img, backColor);
    const backTexture = makeBackTextureViewConsistent(rawBackTexture, frontTexture);

    if (materials[5]) {
      if (materials[5].map && materials[5].map !== frontTexture && materials[5].map !== backTexture) {
        materials[5].map.dispose();
      }
      if (backTexture) {
        materials[5].map = backTexture;
        materials[5].transparent = true;
        materials[5].alphaTest = 0.01;
        if (backColorRgba.a <= 0) {
          materials[5].emissiveIntensity = materials[4]?.emissiveIntensity ?? 0.8;
          materials[5].emissive = materials[4]?.emissive ?? new Color(0xffffff);
        }
      }
      materials[5].needsUpdate = true;
    }
    for (let i = 0; i < 4; i++) {
      if (!materials[i]) continue;
      if (frontTexture) {
        materials[i].map = frontTexture;
        materials[i].transparent = true;
        materials[i].alphaTest = 0.01;
        materials[i].emissiveMap = frontTexture;
        materials[i].emissive = materials[4]?.emissive ?? new Color(0xffffff);
        materials[i].emissiveIntensity = materials[4]?.emissiveIntensity ?? 0.8;
      } else {
        materials[i].map = null;
        materials[i].color.setRGB(backColorRgba.r, backColorRgba.g, backColorRgba.b);
        materials[i].transparent = true;
        materials[i].opacity = 1;
      }
      materials[i].needsUpdate = true;
    }
    renderFrame();
  }, [backColor, createBackTexture, renderFrame]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!lightRef.current) return;
      lightRef.current.position.set(shadowPositionX, shadowPositionY, 400);
      lightRef.current.shadow.bias = -0.00001;
      lightRef.current.shadow.radius = 8;
      const canvasW = imageWidth * CANVAS_SCALE;
      const canvasH = imageHeight * CANVAS_SCALE;
      const base = Math.max(canvasW, canvasH);
      const size = Math.max(base, base * (3.5 / CANVAS_SCALE));
      lightRef.current.shadow.camera.left = -size / 2 + shadowPositionX * 0.3;
      lightRef.current.shadow.camera.right = size / 2 + shadowPositionX * 0.3;
      lightRef.current.shadow.camera.top = size / 2 + shadowPositionY * 0.3;
      lightRef.current.shadow.camera.bottom = -size / 2 + shadowPositionY * 0.3;
      lightRef.current.shadow.camera.updateProjectionMatrix();
      lightRef.current.shadow.needsUpdate = true;
      renderFrame();
    }, 50);
    return () => clearTimeout(t);
  }, [shadowPositionX, shadowPositionY, imageWidth, imageHeight, renderFrame]);

  useEffect(() => {
    if (!lightRef.current || !ambientLightRef.current) return;
    lightRef.current.intensity = 0.3 + 1.7;
    ambientLightRef.current.intensity = Math.max(1 - 0.6, 0.4);
    renderFrame();
  }, [renderFrame]);

  useEffect(() => {
    const t = setTimeout(() => {
      if (!backgroundPlaneRef.current) return;
      const mat = backgroundPlaneRef.current.material;
      mat.opacity = castShadowOpacity / 100;
      const scRgba = parseColorToRgba(resolveTokenColor(shadowColor));
      mat.color.setRGB(scRgba.r, scRgba.g, scRgba.b);
      mat.needsUpdate = true;
      const canvasW = imageWidth * CANVAS_SCALE;
      const canvasH = imageHeight * CANVAS_SCALE;
      const base = Math.max(canvasW, canvasH);
      const planeSize = Math.max(base, base * (3.5 / CANVAS_SCALE));
      const oldGeo = backgroundPlaneRef.current.geometry;
      backgroundPlaneRef.current.geometry = new PlaneGeometry(planeSize, planeSize);
      oldGeo.dispose();
      renderFrame();
    }, 50);
    return () => clearTimeout(t);
  }, [castShadowOpacity, shadowColor, imageWidth, imageHeight, renderFrame]);

  useEffect(() => {
    if (!hasContent || contextLost) return;
    let checkCount = 0;
    const check = () => {
      if (rendererRef.current) {
        const gl = rendererRef.current.getContext();
        if (!gl || gl.isContextLost()) setContextLost(true);
      }
      checkCount++;
    };
    const fast = setInterval(() => {
      if (checkCount < 5) check();
      else clearInterval(fast);
    }, 500);
    const slow = setInterval(() => {
      if (checkCount >= 5) check();
    }, 3000);
    return () => {
      clearInterval(fast);
      clearInterval(slow);
    };
  }, [hasContent, contextLost]);

  useEffect(() => {
    if (!hasContent || contextLost || sceneReady) return;
    const t = setTimeout(() => {
      if (!sceneRef.current && !contextLost) setContextLost(true);
    }, 2000);
    return () => clearTimeout(t);
  }, [hasContent, contextLost, sceneReady]);

  // ================================================================
  // RENDER
  // ================================================================
  if (!hasContent) return null;

  if (contextLost) {
    return (
      <div
        style={{
          position: "relative",
          width: imageWidth,
          height: imageHeight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#999",
          fontSize: 13,
          textAlign: "center",
          padding: 16,
          boxSizing: "border-box",
        }}
      >
        Preview unavailable
      </div>
    );
  }

  const offsetPercent = ((CANVAS_SCALE - 1) / 2) * 100;
  void textureLoaded;

  return (
    <div
      ref={containerRef}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      style={{
        ...style,
        position: "relative",
        width: imageWidth,
        height: imageHeight,
        overflow: "visible",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: 0,
        padding: 0,
        background: "transparent",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: `-${offsetPercent}%`,
          left: `-${offsetPercent}%`,
          display: "block",
          pointerEvents: "none",
          cursor: "auto",
          opacity: sceneReady ? 1 : 0,
          transition: "opacity 250ms ease",
        }}
      />
    </div>
  );
}
