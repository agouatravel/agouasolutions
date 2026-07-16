import type { ReactNode } from "react";

type ServiceCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
};

export function ServiceCard({ icon, title, description }: ServiceCardProps) {
  return (
    <div
      data-reveal
      className="flex flex-col items-center gap-5 rounded-2xl border border-brand-navy-light/30 bg-brand-navy-light/20 px-8 py-12 text-center shadow-lg shadow-brand-navy/30 backdrop-blur-md transition-colors hover:border-brand-teal/40 hover:bg-brand-navy-light/30"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full border border-brand-navy-light/30 bg-brand-navy-light/20 text-white backdrop-blur-md">
        {icon}
      </span>
      <h3 className="text-lg font-medium text-neutral-50">{title}</h3>
      <p className="text-sm leading-relaxed text-white/50">{description}</p>
      <a
        href="#"
        className="mt-2 text-sm font-medium text-white/80 underline decoration-white/30 underline-offset-4 transition-colors hover:text-brand-teal"
      >
        Learn More
      </a>
    </div>
  );
}
