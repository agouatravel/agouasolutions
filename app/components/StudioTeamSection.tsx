import Reveal from "./motion/Reveal";

const listItems = [
  "Fast VR/AR Prototyping",
  "Dedicated Studio Team",
  "Better On-Site Experiences",
  "Clean & Scalable 3D Design",
  "Ongoing Experience Support",
];

export default function StudioTeamSection() {
  return (
    <section className="relative z-10 border-t border-b border-border-hairline bg-background py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-12 px-6 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20 lg:px-8">
        <Reveal>
          <h2
            className="text-[28px] font-semibold leading-tight text-foreground sm:text-[36px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Get A Full Immersive Studio Team For
            <br />
            <span className="italic">Less Than Hiring In-House</span>
          </h2>

          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-muted">
            Most teams lose time managing VR/AR vendors and slow production cycles. We work as an
            extension of your team to design, build, and deploy faster.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="group inline-flex w-fit items-center gap-2 rounded-full bg-tertiary py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-white transition hover:opacity-90"
            >
              Start A Project
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-tertiary transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>

            <button
              type="button"
              className="group inline-flex w-fit items-center gap-2 rounded-full border border-border-hairline bg-transparent py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-foreground transition hover:border-tertiary/20 hover:bg-surface"
            >
              Book Consultation
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-tertiary text-white transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 17 17 7M9 7h8v8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
          </div>
        </Reveal>

        <div className="lg:border-l lg:border-border-hairline lg:pl-16">
          {listItems.map((item, i) => (
            <Reveal key={item} delay={i * 80}>
            <div
              className={`group flex items-center gap-3 rounded-xl px-3 py-6 transition-all duration-300 -mx-3 hover:bg-surface hover:px-4 ${
                i < listItems.length - 1 ? "border-b border-border-hairline" : ""
              }`}
            >
              <span className="text-muted transition-transform duration-300 group-hover:translate-x-1 group-hover:text-primary">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12h14M13 6l6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="text-[15px] font-medium text-foreground transition-colors duration-300 group-hover:text-primary-dim">
                {item}
              </span>
            </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
