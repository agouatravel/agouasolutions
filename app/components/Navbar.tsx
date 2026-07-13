"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type MegaCard = {
  title: string;
  description: string;
  tags: string[];
  icon: React.ReactNode;
};

const megaCards: MegaCard[] = [
  {
    title: "Virtual Reality (VR)",
    description: "Simulation, presentation & decision-making",
    tags: ["VR Experiences", "Interactive 3D Environments", "360° Panoramas", "Digital Simulation"],
    icon: (
      <>
        <rect x="2.5" y="7.5" width="19" height="10" rx="4" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="8.5" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="15.5" cy="12.5" r="1.6" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.5 12.5h3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </>
    ),
  },
  {
    title: "Augmented Reality (AR)",
    description: "Real-world digital engagement",
    tags: ["AR Overlays", "Digital Engagement", "Real-Time Interaction"],
    icon: (
      <>
        <path d="M12 3l8 4.6v8.8L12 21l-8-4.6V7.6L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M12 21v-9M12 12L4 7.4M12 12l8-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Architectural Visualization",
    description: "Interior & exterior design",
    tags: ["Interior Design", "Exterior & Landscape", "Walkthroughs", "Design Presentation"],
    icon: (
      <>
        <path d="M4 20V10l8-6 8 6v10" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M9 20v-6h6v6" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
  {
    title: "Virtual Content Production",
    description: "3D & VR storytelling",
    tags: ["3D/VR Videos", "Immersive Storytelling", "Live Presentations", "Virtual Exhibitions"],
    icon: (
      <>
        <rect x="2.5" y="6" width="14" height="12" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
        <path d="M16.5 10.5l5-2.7v8.4l-5-2.7" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      </>
    ),
  },
];

const experienceLinks = [
  "Experience Centers",
  "Virtual Showrooms",
  "Interactive Exhibitions",
  "Digital Twins",
  "Smart Presentation Systems",
  "Interactive Information Platforms",
];

const navLinks = [{ label: "About Us", href: "/about" }];

type BlogPost = {
  title: string;
  description: string;
  tag: string;
  gradient: string;
};

const blogPosts: BlogPost[] = [
  {
    title: "The Business Case for Virtual Reality",
    description: "Why organizations are adopting VR for training, sales, and experience design.",
    tag: "VR",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-neutral))",
  },
  {
    title: "Digital Twins: A Practical Guide",
    description: "What a digital twin actually is, how it's built, and where it delivers value.",
    tag: "Digital Twins",
    gradient: "linear-gradient(135deg, var(--color-secondary), var(--color-neutral))",
  },
  {
    title: "AR vs VR: Which Fits Your Project",
    description: "A clear breakdown of AR and VR use cases to help you choose the right tech.",
    tag: "AR / VR",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))",
  },
];

type CaseStudy = {
  title: string;
  description: string;
  tag: string;
  gradient: string;
};

const caseStudies: CaseStudy[] = [
  {
    title: "Riyadh Experience Center — Immersive Showroom",
    description: "A VR showroom that let a real estate developer walk buyers through unbuilt towers.",
    tag: "VR Showroom",
    gradient: "linear-gradient(135deg, var(--color-secondary), var(--color-neutral))",
  },
  {
    title: "Digital Twin for a Smart Campus",
    description: "A live 3D twin used to monitor and manage a multi-building campus in real time.",
    tag: "Digital Twin",
    gradient: "linear-gradient(135deg, var(--color-primary), var(--color-neutral))",
  },
  {
    title: "AR Product Configurator for Retail",
    description: "An in-store AR tool letting shoppers customize and preview products before buying.",
    tag: "AR Retail",
    gradient: "linear-gradient(135deg, var(--color-secondary), var(--color-primary))",
  },
];

function ArrowUpRight() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M7 17L17 7M17 7H8M17 7v9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function Navbar() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [blogOpen, setBlogOpen] = useState(false);
  const [caseStudyOpen, setCaseStudyOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blogCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const caseStudyCloseTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastScrollY = useRef(0);

  function openServices() {
    if (closeTimeout.current) clearTimeout(closeTimeout.current);
    setServicesOpen(true);
  }

  function scheduleCloseServices() {
    closeTimeout.current = setTimeout(() => setServicesOpen(false), 140);
  }

  function openBlog() {
    if (blogCloseTimeout.current) clearTimeout(blogCloseTimeout.current);
    setBlogOpen(true);
  }

  function scheduleCloseBlog() {
    blogCloseTimeout.current = setTimeout(() => setBlogOpen(false), 140);
  }

  function openCaseStudy() {
    if (caseStudyCloseTimeout.current) clearTimeout(caseStudyCloseTimeout.current);
    setCaseStudyOpen(true);
  }

  function scheduleCloseCaseStudy() {
    caseStudyCloseTimeout.current = setTimeout(() => setCaseStudyOpen(false), 140);
  }

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const anyPanelOpen = servicesOpen || blogOpen || caseStudyOpen || mobileOpen;

  useEffect(() => {
    let ticking = false;

    function update() {
      ticking = false;
      const currentY = window.scrollY;
      if (anyPanelOpen || currentY <= 80) {
        setHidden(false);
      } else if (currentY > lastScrollY.current) {
        setHidden(true);
      } else if (currentY < lastScrollY.current) {
        setHidden(false);
      }
      lastScrollY.current = currentY;
    }

    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [anyPanelOpen]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-border-hairline bg-background/80 backdrop-blur-md transition-transform duration-300 ease-out ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-2" onClick={() => setMobileOpen(false)}>
          <Image
            src="/brand/agoua-logo.svg"
            alt="AGOUA Al-Samaa Co."
            width={220}
            height={51}
            priority
            className="h-10 w-auto"
          />
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          <button
            type="button"
            onMouseEnter={openServices}
            onMouseLeave={scheduleCloseServices}
            onClick={() => setServicesOpen((v) => !v)}
            className="flex items-center gap-1.5 rounded-full px-4 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-tertiary/5 hover:text-foreground"
            aria-expanded={servicesOpen}
          >
            Services
            <svg
              width="10"
              height="10"
              viewBox="0 0 10 10"
              fill="none"
              className={`transition-transform duration-200 ${servicesOpen ? "rotate-180" : ""}`}
            >
              <path d="M1 3.5L5 7.5L9 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <Link
            href="/case-studies"
            onMouseEnter={openCaseStudy}
            onMouseLeave={scheduleCloseCaseStudy}
            className="rounded-full px-4 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-tertiary/5 hover:text-foreground"
          >
            Case Studies
          </Link>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-4 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-tertiary/5 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}

          <Link
            href="/blog"
            onMouseEnter={openBlog}
            onMouseLeave={scheduleCloseBlog}
            className="rounded-full px-4 py-2 text-[15px] font-medium text-foreground/80 transition hover:bg-tertiary/5 hover:text-foreground"
          >
            Blog
          </Link>
        </nav>

        <div className="hidden lg:block">
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2.5 rounded-full bg-tertiary py-2.5 pl-5 pr-2.5 text-[15px] font-medium text-white shadow-[0_6px_20px_-6px_rgba(20,184,166,0.4),0_12px_32px_-10px_rgba(59,130,246,0.3)] transition hover:bg-neutral hover:shadow-[0_8px_24px_-6px_rgba(20,184,166,0.5),0_16px_40px_-10px_rgba(59,130,246,0.4)]"
          >
            Contact Us
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition group-hover:bg-primary">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.6 21 3 13.4 3 4c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.3 1.1l-2.1 2.1z"
                  fill="currentColor"
                />
              </svg>
            </span>
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full text-foreground lg:hidden"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            {mobileOpen ? (
              <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <>
                <path d="M4 7H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                <path d="M4 17H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </>
            )}
          </svg>
        </button>
      </div>

      {servicesOpen && (
        <div
          onMouseEnter={openServices}
          onMouseLeave={scheduleCloseServices}
          className="absolute inset-x-0 top-full hidden border-t border-border-hairline bg-background shadow-[0_30px_60px_-25px_rgba(5,11,24,0.3)] animate-fade-up lg:block"
        >
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
            {megaCards.map((card) => (
              <div
                key={card.title}
                className="group relative flex min-h-[260px] flex-col rounded-2xl bg-tertiary/[0.035] p-6 transition hover:bg-tertiary/[0.055]"
              >
                <span className="absolute right-4 top-4 text-foreground/25 transition group-hover:text-primary-dim">
                  <ArrowUpRight />
                </span>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface text-tertiary shadow-sm">
                  <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
                    {card.icon}
                  </svg>
                </div>
                <h3
                  className="mt-4 text-[16px] font-semibold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {card.title}
                </h3>
                <p className="mt-1 text-[13px] leading-snug text-muted">{card.description}</p>

                <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                  {card.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-surface px-3 py-1 text-[12px] text-foreground/70 shadow-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl bg-tertiary/[0.035] p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3
                className="text-[16px] font-semibold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Experience Centers &amp; Digital Twins
              </h3>
              <p className="text-[13px] leading-snug text-muted">Interactive platforms that engage audiences</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {experienceLinks.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-surface px-3 py-1.5 text-[13px] text-foreground/75 shadow-sm"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
          </div>
        </div>
      )}

      {blogOpen && (
        <div
          onMouseEnter={openBlog}
          onMouseLeave={scheduleCloseBlog}
          className="absolute inset-x-0 top-full hidden border-t border-border-hairline bg-background shadow-[0_30px_60px_-25px_rgba(5,11,24,0.3)] animate-fade-up lg:block"
        >
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
              <div>
                <h3
                  className="text-[30px] font-semibold leading-[1.08] text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Our Latest
                  <br />
                  Articles
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">
                  Insights on virtual reality, digital twins, and immersive technology to help you
                  plan your next experience.
                </p>
                <Link
                  href="/blog"
                  className="group mt-6 inline-flex items-center gap-2.5 text-[14px] font-medium text-foreground transition hover:text-primary-dim"
                >
                  Browse All Articles
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-hairline transition group-hover:border-primary-dim group-hover:text-primary-dim">
                    <ArrowUpRight />
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 divide-y divide-border-hairline overflow-hidden rounded-2xl border border-border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {blogPosts.map((post) => (
                  <Link
                    key={post.title}
                    href="/blog"
                    className="group relative flex flex-col bg-tertiary/[0.02] transition hover:bg-tertiary/[0.04]"
                  >
                    <div className="p-6">
                      <h4
                        className="text-[16px] font-semibold leading-snug text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {post.title}
                      </h4>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{post.description}</p>
                    </div>

                    <div className="relative mt-auto h-[340px] overflow-hidden">
                      <div className="absolute inset-0" style={{ background: post.gradient }} />
                      <div className="bg-grid absolute inset-0 opacity-[0.15]" />
                      <div
                        className="absolute inset-0 opacity-90 transition group-hover:scale-105"
                        style={{
                          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%)",
                          transitionDuration: "400ms",
                        }}
                      />
                      <span
                        className="absolute bottom-4 left-4 text-[24px] font-bold leading-none text-white"
                        style={{ fontFamily: "var(--font-headline)" }}
                      >
                        {post.tag}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 origin-center -translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.74,-0.03,0.05,1.24)] group-hover:scale-100 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2.5 rounded-full bg-tertiary py-2 pl-4 pr-2 text-[13px] font-medium text-white shadow-[0_16px_32px_-10px_rgba(5,11,24,0.5)]">
                        View Full Blog
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-tertiary">
                          <ArrowUpRight />
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {caseStudyOpen && (
        <div
          onMouseEnter={openCaseStudy}
          onMouseLeave={scheduleCloseCaseStudy}
          className="absolute inset-x-0 top-full hidden border-t border-border-hairline bg-background shadow-[0_30px_60px_-25px_rgba(5,11,24,0.3)] animate-fade-up lg:block"
        >
          <div className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
            <div className="grid grid-cols-1 gap-10 lg:grid-cols-[280px_1fr]">
              <div>
                <h3
                  className="text-[30px] font-semibold leading-[1.08] text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Our Featured
                  <br />
                  Case Studies
                </h3>
                <p className="mt-4 text-[14px] leading-relaxed text-muted">
                  Real projects across VR, AR, and digital twins showing how AGOUA turns
                  ambitious ideas into immersive experiences.
                </p>
                <Link
                  href="/case-studies"
                  className="group mt-6 inline-flex items-center gap-2.5 text-[14px] font-medium text-foreground transition hover:text-primary-dim"
                >
                  View All Case Studies
                  <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border-hairline transition group-hover:border-primary-dim group-hover:text-primary-dim">
                    <ArrowUpRight />
                  </span>
                </Link>
              </div>

              <div className="grid grid-cols-1 divide-y divide-border-hairline overflow-hidden rounded-2xl border border-border-hairline sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {caseStudies.map((project) => (
                  <Link
                    key={project.title}
                    href="/case-studies"
                    className="group relative flex flex-col bg-tertiary/[0.02] transition hover:bg-tertiary/[0.04]"
                  >
                    <div className="p-6">
                      <h4
                        className="text-[16px] font-semibold leading-snug text-foreground"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        {project.title}
                      </h4>
                      <p className="mt-2 text-[13px] leading-relaxed text-muted">{project.description}</p>
                    </div>

                    <div className="relative mt-auto h-[340px] overflow-hidden">
                      <div className="absolute inset-0" style={{ background: project.gradient }} />
                      <div className="bg-grid absolute inset-0 opacity-[0.15]" />
                      <div
                        className="absolute inset-0 opacity-90 transition group-hover:scale-105"
                        style={{
                          background: "radial-gradient(circle at 30% 30%, rgba(255,255,255,0.18), transparent 60%)",
                          transitionDuration: "400ms",
                        }}
                      />
                      <span
                        className="absolute bottom-4 left-4 text-[24px] font-bold leading-none text-white"
                        style={{ fontFamily: "var(--font-headline)" }}
                      >
                        {project.tag}
                      </span>
                    </div>

                    <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 origin-center -translate-x-1/2 -translate-y-1/2 scale-90 opacity-0 transition-transform duration-300 [transition-timing-function:cubic-bezier(0.74,-0.03,0.05,1.24)] group-hover:scale-100 group-hover:opacity-100">
                      <span className="inline-flex items-center gap-2.5 rounded-full bg-tertiary py-2 pl-4 pr-2 text-[13px] font-medium text-white shadow-[0_16px_32px_-10px_rgba(5,11,24,0.5)]">
                        View Case Study
                        <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-tertiary">
                          <ArrowUpRight />
                        </span>
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {mobileOpen && (
        <div className="border-t border-border-hairline bg-background px-6 pb-8 pt-4 lg:hidden">
          <div className="flex flex-col">
            <span className="font-label pb-2 pt-3 text-[11px] uppercase tracking-wide text-muted">Services</span>
            {megaCards.map((card) => (
              <span key={card.title} className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-foreground/85">
                {card.title}
              </span>
            ))}
            <div className="my-3 h-px bg-border-hairline" />
            <Link
              href="/case-studies"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-foreground/85"
            >
              Case Studies
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-foreground/85"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/blog"
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-2 py-2.5 text-[15px] font-medium text-foreground/85"
            >
              Blog
            </Link>
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              className="mt-4 flex items-center justify-center gap-2 rounded-full bg-tertiary py-3 text-[15px] font-medium text-white shadow-[0_6px_20px_-6px_rgba(20,184,166,0.4),0_12px_32px_-10px_rgba(59,130,246,0.3)]"
            >
              Contact Us
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
