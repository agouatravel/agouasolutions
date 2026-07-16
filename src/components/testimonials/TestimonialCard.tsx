import { AvatarPlaceholder } from "./AvatarPlaceholder";

type TestimonialCardProps = {
  quote: string;
  name: string;
};

export function TestimonialCard({ quote, name }: TestimonialCardProps) {
  return (
    <div
      data-reveal
      className="relative z-10 flex items-start justify-between gap-6 rounded-2xl border border-brand-navy-light/30 bg-brand-navy-light/20 p-6 shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm leading-relaxed text-white/60">{quote}</p>
        <span className="text-sm font-semibold text-neutral-50">{name}</span>
      </div>
      <AvatarPlaceholder className="h-14 w-14" />
    </div>
  );
}
