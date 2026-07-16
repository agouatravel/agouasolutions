export function ShowcaseImagePlaceholder() {
  return (
    <div className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-3xl border border-brand-navy-light/30 bg-brand-navy-light/20 shadow-xl shadow-brand-navy/30 backdrop-blur-md">
      <div className="flex flex-col items-center gap-3 px-6 text-center text-white/50">
        <svg viewBox="0 0 24 24" className="h-12 w-12" fill="none">
          <rect x={3} y={4} width={18} height={14} rx={2} stroke="currentColor" strokeWidth={1.4} />
          <circle cx={9} cy={10} r={2} stroke="currentColor" strokeWidth={1.4} />
          <path
            d="M4 16.5 8.5 12l3 3L17 10l3 4"
            stroke="currentColor"
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <p className="max-w-[200px] text-xs leading-relaxed">
          Portrait photo goes here
          <br />
          Drop it at{" "}
          <code className="text-[11px] text-white/70">
            public/showcase-character.jpg
          </code>
        </p>
      </div>
    </div>
  );
}
