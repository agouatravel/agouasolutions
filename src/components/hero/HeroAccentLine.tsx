export function HeroAccentLine() {
  return (
    <svg
      aria-hidden
      preserveAspectRatio="none"
      viewBox="0 0 1200 200"
      className="pointer-events-none absolute inset-x-0 top-1/2 z-0 h-40 w-full -translate-y-1/2 text-neutral-300"
    >
      <path
        d="M0 175 H420 L580 45 H1200"
        fill="none"
        stroke="currentColor"
        strokeWidth={20}
      />
    </svg>
  );
}
