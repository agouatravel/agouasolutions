# Motion Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add scroll reveals to the sections missing them, site-wide `prefers-reduced-motion` support, and hover micro-interactions, per `docs/superpowers/specs/2026-07-13-motion-system-design.md` (see Amendment).

**Architecture:** One shared client primitive (`useInViewOnce` hook + `Reveal` wrapper component) built on IntersectionObserver, with `.reveal`/`.is-visible` CSS classes in `globals.css`. Server components stay server and import the client `Reveal`. No new dependencies.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4 (CSS-first config in `globals.css`).

## Global Constraints

- No new npm dependencies.
- Animate only `transform` and `opacity`; reveals fire once and disconnect observers.
- Reveal timing: `0.7s cubic-bezier(0.16, 1, 0.3, 1)`, rise `24px`, staggers ~`80–120ms`.
- All animations disabled under `@media (prefers-reduced-motion: reduce)`.
- There is no unit-test infra; each task is verified with `npm run build` (must pass) and final visual verification via Playwright against `npm run dev`.

---

### Task 1: Reveal primitive + reduced-motion CSS

**Files:**
- Create: `app/components/motion/Reveal.tsx`
- Modify: `app/globals.css` (append after `.animate-fade-up` block)

**Interfaces:**
- Produces: `useInViewOnce<T extends HTMLElement>(threshold?: number): { ref: RefObject<T | null>; visible: boolean }` and default export `Reveal({ children, delay?, className? })`. CSS classes `.reveal` and `.is-visible`.

- [ ] **Step 1: Create `app/components/motion/Reveal.tsx`**

```tsx
"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

export function useInViewOnce<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, visible };
}

export default function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInViewOnce<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`.trim()}
      style={delay ? { transitionDelay: visible ? `${delay}ms` : "0ms" } : undefined}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Append to `app/globals.css`** (after the `.animate-fade-up` rule)

```css
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition:
    opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
}

.reveal.is-visible {
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    opacity: 1;
    transform: none;
    transition: none;
  }

  .animate-marquee-left,
  .animate-marquee-right,
  .animate-fade-up,
  .starfield-layer {
    animation: none;
  }
}
```

- [ ] **Step 3: Verify** — Run `npm run build`. Expected: build succeeds.
- [ ] **Step 4: Commit** — `git add app/components/motion/Reveal.tsx app/globals.css && git commit -m "feat: add shared Reveal primitive and prefers-reduced-motion support"`

---

### Task 2: Migrate LogosSection and DeliverySection to the shared hook

**Files:**
- Modify: `app/components/LogosSection.tsx:1-66` (imports + observer effect)
- Modify: `app/components/DeliverySection.tsx:152-188` (observer effect + heading)

**Interfaces:**
- Consumes: `useInViewOnce` from `./motion/Reveal`.

- [ ] **Step 1: LogosSection** — replace the `useEffect`/`useRef`/`useState` observer block (lines 47–66) with the hook; keep markup. Replace imports too:

```tsx
"use client";

import { useInViewOnce } from "./motion/Reveal";
```

and inside the component:

```tsx
export default function LogosSection() {
  const { ref: headingRef, visible } = useInViewOnce<HTMLDivElement>(0.3);
```

(remove the old `useEffect` block entirely; the JSX below is unchanged).

- [ ] **Step 2: DeliverySection** — same replacement: drop its `useEffect` observer, use `const { ref: sectionRef, visible } = useInViewOnce<HTMLDivElement>(0.2);`, import `{ useInViewOnce } from "./motion/Reveal"`, keep `useRef`/`useState` imports only if still used (the `DeliveryCell` still uses `useRef`). Also wrap the heading block (`<div className="mx-auto max-w-3xl ...">`) content behavior unchanged — no heading reveal needed here (cells already cascade).
- [ ] **Step 3: Verify** — `npm run build` passes.
- [ ] **Step 4: Commit** — `git commit -am "refactor: use shared useInViewOnce in Logos and Delivery sections"`

---

### Task 3: Scroll reveals — StudioTeam, CaseStudies, Process, FAQ, Footer

**Files:**
- Modify: `app/components/StudioTeamSection.tsx`
- Modify: `app/components/CaseStudiesSection.tsx`
- Modify: `app/components/ProcessSection.tsx:181-195`
- Modify: `app/components/FaqSection.tsx:115-210`
- Modify: `app/components/Footer.tsx:41-42`

**Interfaces:**
- Consumes: `Reveal` (default export) from `./motion/Reveal`.

- [ ] **Step 1: StudioTeamSection** — `import Reveal from "./motion/Reveal";` wrap the left column content (`<div>` holding h2/p/buttons) in `<Reveal>`, and wrap each list row in `<Reveal delay={i * 80}>` (the row keeps its own classes; Reveal is an outer wrapper inside the right column div).
- [ ] **Step 2: CaseStudiesSection** — wrap the heading flex row in `<Reveal>`, and each `<CaseStudyRow>` in `<Reveal key={i}>` (move `key` to Reveal).
- [ ] **Step 3: ProcessSection** — wrap the `<h2>` + intro `<p>` in a single `<Reveal>` (component is already client; import default `Reveal`).
- [ ] **Step 4: FaqSection** — wrap left column content in `<Reveal>` and the FAQ list column's inner content in `<Reveal delay={120}>` (inside the `lg:border-l` div so the border doesn't animate).
- [ ] **Step 5: Footer** — wrap the main link grid (`<div className="grid grid-cols-1 gap-12 lg:grid-cols-[1.2fr_1fr_1fr_1fr]">`) in `<Reveal>`.
- [ ] **Step 6: Verify** — `npm run build` passes.
- [ ] **Step 7: Commit** — `git commit -am "feat: add scroll reveals to remaining sections"`

---

### Task 4: Hover micro-interactions

**Files:**
- Modify: `app/components/CaseStudiesSection.tsx:88-91` (card lift)
- Modify: `app/components/Hero.tsx:174`, `app/components/StudioTeamSection.tsx:34,52`, `app/components/CaseStudiesSection.tsx:181`, `app/components/FaqSection.tsx:164`, `app/components/Footer.tsx:60` (diagonal arrow hover)
- Modify: `app/components/Footer.tsx:71-75` (service link hover)

- [ ] **Step 1: Case-study card lift** — on the outer div of `CaseStudyImage`, extend the class list with `transition duration-300 ease-out hover:-translate-y-1`.
- [ ] **Step 2: Diagonal arrows** — everywhere an arrow circle has `group-hover:translate-x-0.5`, change to `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` (arrow icons point up-right; the motion should match).
- [ ] **Step 3: Footer service links** — on each service `<li>`, add `transition hover:text-white` (currently plain `text-white/50`) and `cursor-default`.
- [ ] **Step 4: Verify** — `npm run build` passes.
- [ ] **Step 5: Commit** — `git commit -am "feat: hover micro-interactions (card lift, diagonal arrows, footer links)"`

---

### Task 5: Visual verification

- [ ] **Step 1:** Start `npm run dev`, open the site with Playwright.
- [ ] **Step 2:** Screenshot: hero on load; scroll to StudioTeam/CaseStudies/FAQ/Footer and confirm reveals fire (content visible after scroll, not blank).
- [ ] **Step 3:** Emulate `prefers-reduced-motion: reduce` and confirm sections render instantly visible.
- [ ] **Step 4:** Commit any fixes; report results with screenshots.
