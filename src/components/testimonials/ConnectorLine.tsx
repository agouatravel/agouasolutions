export function ConnectorLine() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 700 700"
      preserveAspectRatio="none"
      className="pointer-events-none absolute -left-24 top-0 z-0 h-full w-[140%] text-white/15"
    >
      <path
        d="M0 620 C 160 560, 260 560, 340 480 C 420 400, 380 300, 460 240
           C 540 180, 620 190, 700 140"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
