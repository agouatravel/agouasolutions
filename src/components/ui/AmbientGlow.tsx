type AmbientGlowProps = {
  variant?: "dark" | "light";
};

// No blobs left — kept as a no-op so existing <AmbientGlow /> call sites
// don't need to be touched if a glow effect is wanted again later.
export function AmbientGlow(props: AmbientGlowProps) {
  void props;
  return null;
}
