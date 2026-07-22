"use client";

import { useState } from "react";
import Reveal from "./motion/Reveal";
import WaveDivider from "./motion/WaveDivider";

const faqs = [
  {
    question: "What kind of companies do you work with?",
    answer:
      "We work with real estate developers, retailers, event organizers, and enterprises who want to showcase products or spaces through immersive experiences.",
  },
  {
    question: "What services does AGOUA offer?",
    answer:
      "End-to-end immersive solutions — Virtual Reality and Augmented Reality experiences, architectural & 3D visualization (interior, exterior, and landscape design), interactive virtual tours and 360° panoramic experiences, digital twins and smart presentation systems, and full virtual content production, from concept to on-site delivery.",
  },
  {
    question: "What is your starting price?",
    answer:
      "Most VR/AR experiences start in the low five figures, scaling with scope, hardware, and the number of environments involved.",
  },
  {
    question: "How long does a project usually take?",
    answer:
      "A focused VR showcase typically takes 4-8 weeks from kickoff to on-site launch, depending on complexity.",
  },
  {
    question: "What makes AGOUA different?",
    answer:
      "We own the entire pipeline: design, build, hardware, and on-site delivery, so nothing gets lost between vendors.",
  },
  {
    question: "Do you handle on-site hardware and setup?",
    answer:
      "Yes. Our team sources, configures, and installs headsets, displays, and sensors, then stays on-site through launch.",
  },
  {
    question: "How do you communicate during projects?",
    answer:
      "You get a dedicated project lead and regular milestone check-ins via call, email, or WhatsApp — whatever works best for your team.",
  },
];

function FaqItem({
  question,
  answer,
  open,
  onToggle,
}: {
  question: string;
  answer: string;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="border-b border-border-hairline last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-6 py-5 text-left"
        aria-expanded={open}
      >
        <span
          className={`text-[15px] font-medium transition-colors duration-300 sm:text-[16px] ${
            open ? "text-foreground" : "text-foreground/80"
          }`}
        >
          {question}
        </span>
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border-hairline text-foreground/70 transition-transform duration-300 ${
            open ? "rotate-45 border-primary text-primary" : ""
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      <div
        className="grid overflow-hidden transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-xl pb-5 text-[14px] leading-relaxed text-muted">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="relative z-10 bg-background py-20 sm:py-28">
      <WaveDivider className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-16 sm:h-24" />

      <div className="relative z-10 mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 lg:grid-cols-[1fr_1.4fr] lg:px-8">
        <Reveal>
          <h2
            className="text-[32px] font-semibold leading-tight text-foreground sm:text-[40px]"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Got Questions?
            <br />
            <span className="italic">We&apos;ve Got Answers</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-muted">
            If you&apos;re unsure where to start or want to see how we can help, reach out, and
            we&apos;ll walk you through it.
          </p>

          <div className="relative mt-10 overflow-hidden rounded-2xl border border-border-hairline bg-surface p-6">
            <div
              className="pointer-events-none absolute -bottom-1/3 -right-1/4 h-[280px] w-[280px] rounded-full opacity-[0.16] blur-3xl"
              style={{ background: "radial-gradient(circle, var(--color-primary), transparent 70%)" }}
            />

            <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary-dim">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 8a7 7 0 0 1 14 0"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <h3
              className="relative mt-4 text-[18px] font-semibold text-foreground"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Book an Intro Call
            </h3>
            <p className="relative mt-1 max-w-xs text-[13px] leading-relaxed text-muted">
              Let&apos;s talk through your goals, your timeline, and how AGOUA can support your team.
            </p>

            <a
              href="/contact"
              className="group relative mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-tertiary py-1.5 pl-5 pr-1.5 text-[14px] font-medium text-white transition-all duration-300 ease-out hover:scale-[1.04] hover:opacity-90 hover:shadow-lg active:scale-[0.97]"
            >
              Book a Free Call
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-tertiary transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
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
            </a>

            <div className="relative mt-6 flex items-center gap-3 border-t border-border-hairline pt-5">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface text-foreground/70 shadow-sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M3 6.5A1.5 1.5 0 0 1 4.5 5h15A1.5 1.5 0 0 1 21 6.5v11a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                    stroke="currentColor"
                    strokeWidth="1.4"
                  />
                  <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
              <div>
                <p className="text-[12px] text-muted">Prefer Email Instead?</p>
                <a href="mailto:info@agouasolutions.com" className="text-[14px] font-medium text-foreground">
                  info@agouasolutions.com
                </a>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="lg:pl-16">
          <Reveal delay={120}>
            {faqs.map((faq, i) => (
              <FaqItem
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
                open={openIndex === i}
                onToggle={() => setOpenIndex((prev) => (prev === i ? null : i))}
              />
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
