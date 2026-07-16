type AvatarPlaceholderProps = {
  className?: string;
};

export function AvatarPlaceholder({ className = "" }: AvatarPlaceholderProps) {
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-navy-light/30 to-brand-navy-light/10 text-white/50 ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-1/2 w-1/2" fill="none">
        <circle cx={12} cy={9} r={3.2} stroke="currentColor" strokeWidth={1.4} />
        <path
          d="M5.5 19c1.4-3 4-4.5 6.5-4.5s5.1 1.5 6.5 4.5"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
