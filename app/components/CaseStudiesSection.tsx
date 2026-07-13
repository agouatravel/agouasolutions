import Reveal from "./motion/Reveal";

type CaseStudy = {
  client: string;
  project: string;
  category: string;
  monogram: string;
  accent: string;
  description: string;
  featured?: boolean;
};

const caseStudies: CaseStudy[] = [
  {
    client: "Nova Realty",
    project: "VR Property Showroom",
    category: "Virtual Reality",
    monogram: "NR",
    accent: "#14b8a6",
    description:
      "A virtual reality showroom letting buyers walk through Nova Realty developments before a single brick is laid.",
  },
  {
    client: "Zenith Towers",
    project: "Interactive Sales Suite",
    category: "Product Visualization",
    monogram: "ZT",
    accent: "#3b82f6",
    description:
      "An interactive sales suite that turns floor plans into a live, explorable 3D experience for Zenith Towers.",
  },
  {
    client: "Falcon Retail",
    project: "AR Shopping Experience",
    category: "Augmented Reality",
    monogram: "FR",
    accent: "#7c3aed",
    description: "An AR shopping experience letting Falcon Retail customers preview products in their own space.",
  },
  {
    client: "Vertex Living",
    project: "Digital Twin Showcase",
    category: "Digital Twin",
    monogram: "VL",
    accent: "#f59e0b",
    description:
      "A live digital twin of Vertex Living's flagship property, updated in real time for remote tours.",
  },
  {
    client: "Halo Retail",
    project: "Flagship Launch Activation",
    category: "Event Activation",
    monogram: "HR",
    accent: "#14b8a6",
    description:
      "An immersive launch activation that turned Halo Retail's flagship opening into a fully interactive event.",
    featured: true,
  },
  {
    client: "Skyline Group",
    project: "Experience Center Build-Out",
    category: "Experience Center",
    monogram: "SG",
    accent: "#14b8a6",
    description:
      "A dedicated experience center built for Skyline Group to showcase every project in one immersive space.",
  },
  {
    client: "Cedar Exhibits",
    project: "Immersive Trade Show Booth",
    category: "Event Activation",
    monogram: "CE",
    accent: "#3b82f6",
    description:
      "An immersive trade show booth that gave Cedar Exhibits a standout, fully interactive presence on the floor.",
  },
  {
    client: "Orbit Expo",
    project: "Training Simulation Platform",
    category: "Training Simulation",
    monogram: "OE",
    accent: "#7c3aed",
    description:
      "A VR training simulation platform built to onboard Orbit Expo staff faster, with zero physical setup.",
  },
];

function CaseStudyImage({ study, stretch }: { study: CaseStudy; stretch?: boolean }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border transition duration-300 ease-out hover:-translate-y-1 ${
        study.featured ? "border-white/10 bg-tertiary sm:col-span-2" : "border-border-hairline bg-surface"
      } ${stretch ? "h-full w-full" : study.featured ? "aspect-[16/9]" : "aspect-[4/3]"}`}
    >
      {!study.featured && <div className="bg-grid pointer-events-none absolute inset-0 opacity-[0.06]" />}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background: `radial-gradient(circle, ${study.accent}, transparent 70%)`,
          opacity: study.featured ? 0.35 : 0.18,
        }}
      />
      <span
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-display font-semibold"
        style={{
          fontSize: study.featured ? "96px" : "64px",
          color: study.featured ? "rgba(255,255,255,0.14)" : `${study.accent}26`,
        }}
      >
        {study.monogram}
      </span>

      <div className="absolute inset-0 flex translate-y-full flex-col justify-between bg-black/35 p-6 backdrop-blur-md transition-transform duration-300 ease-out group-hover:translate-y-0">
        <p className="text-[13px] leading-relaxed text-white opacity-0 transition-opacity delay-300 duration-300 ease-out group-hover:opacity-100">
          {study.description}
        </p>

        <div className="flex items-center gap-3 opacity-0 transition-opacity delay-500 duration-300 ease-out group-hover:opacity-100">
          <span className="text-[13px] font-medium text-white">View Project</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-tertiary">
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
        </div>
      </div>
    </div>
  );
}

function CaseStudyCaption({ study }: { study: CaseStudy }) {
  return (
    <div className={study.featured ? "sm:col-span-2" : undefined}>
      <p className="font-display text-[15px] font-semibold text-foreground">{study.project}</p>
      <p className="mt-0.5 text-[13px] text-muted">{study.category}</p>
    </div>
  );
}

function CaseStudyRow({ studies }: { studies: CaseStudy[] }) {
  const hasFeatured = studies.some((study) => study.featured);
  return (
    <div>
      <div className="grid grid-cols-2 gap-6 sm:grid-cols-3">
        {studies.map((study, i) => (
          <CaseStudyImage key={study.client} study={study} stretch={hasFeatured && i === 0} />
        ))}
      </div>
      <div className="mt-4 grid grid-cols-2 gap-6 sm:grid-cols-3">
        {studies.map((study) => (
          <CaseStudyCaption key={study.client} study={study} />
        ))}
      </div>
    </div>
  );
}

export default function CaseStudiesSection() {
  const rows = [caseStudies.slice(0, 3), caseStudies.slice(3, 5), caseStudies.slice(5, 8)];

  return (
    <section className="relative z-10 bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <Reveal>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h2
            className="text-[28px] font-semibold leading-tight text-foreground sm:text-[36px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Featured <span className="italic">Case Studies</span>
          </h2>

          <button
            type="button"
            className="group inline-flex w-fit items-center gap-2 rounded-full bg-tertiary py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-white transition hover:opacity-90"
          >
            View all
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
        </div>
        </Reveal>

        <div className="mt-12 flex flex-col gap-10 sm:gap-12">
          {rows.map((row, i) => (
            <Reveal key={i}>
              <CaseStudyRow studies={row} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
