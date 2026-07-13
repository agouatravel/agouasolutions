# Site-wide Motion System — Design Spec

**Date:** 2026-07-13
**Status:** Approved (full polish, "confident & smooth" personality)

## Goal

Make the AGOUA marketing site feel premium and alive by adding a cohesive
animation system: scroll reveals on every section, hero entrance
choreography, scroll-linked effects, and hover micro-interactions.

## Decisions

- **Scope:** Full polish — reveals + micro-interactions + hero entrance + scroll-linked effects.
- **Personality:** Confident & smooth — 0.6–0.8s reveals, 20–30px slides, ~0.1s staggers. Noticeable but refined.
- **Dependency:** `motion` (Framer Motion successor) is the only new package. No Lenis / inertia scrolling.

## Architecture

### Shared primitives — `app/components/motion/`

All animation flows through two reusable client components so every section
animates identically:

- **`Reveal`** — wraps any content. Fades in and rises 24px over 0.7s with
  easing `cubic-bezier(0.16, 1, 0.3, 1)` (same curve as the existing
  `animate-fade-up`). Triggers via `whileInView` when the element enters the
  viewport (margin ≈ -10%), plays **once**. Accepts an optional `delay` prop.
- **`RevealGroup`** — wraps grids/lists. Children cascade with ~0.1s stagger
  (children rendered via a companion `RevealItem` or variant propagation).

A `MotionConfig reducedMotion="user"` wrapper (client component) goes around
the page content in `app/layout.tsx` so OS-level "reduce motion" users get
instant rendering.

The hand-rolled IntersectionObservers in `DeliverySection` and `LogosSection`
are migrated to these primitives.

### Hero entrance choreography

On load (not scroll): badge → headline line 1 → headline line 2 → subcopy →
buttons, each ~0.1s apart, rising ~20px. Uses the same easing.

### Scroll reveals — all sections

VideoSection, LogosSection, DeliverySection, StudioTeamSection,
CaseStudiesSection, ServicesShowcaseSection, ProcessSection, FaqSection,
Footer (light touch): headings reveal first, then cards/rows/images cascade
via `RevealGroup`.

### Scroll-linked effects

- **VideoSection:** scales from ~0.92 → 1 (and rounds → sharper corners) as
  it scrolls into view, via `useScroll` + `useTransform`.
- **Navbar:** after scrolling past ~40px, gains frosted blur background,
  hairline border/shadow, slightly reduced padding. Smooth transition.
- **Parallax:** images in CaseStudiesSection and StudioTeamSection drift a
  few px slower than scroll (translateY via `useScroll`).

### Micro-interactions

- Cards: hover lift `-4px` + soft shadow; images inside frames zoom to 1.05.
- Primary buttons: arrow icon slides diagonally on hover.
- FAQ: answers animate height smoothly (grid-rows or motion height) instead
  of snapping.

## Constraints

- Animate only `transform` and `opacity` (no layout thrash).
- Reveals fire once; observers/subscriptions cleaned up.
- Sections stay server components where possible; only animated wrappers and
  already-client sections are client components.
- Respect `prefers-reduced-motion` globally.

## Verification

- Run dev server; Playwright screenshots of hero on load, mid-scroll
  sections, video section mid-transition, navbar scrolled state.
- Reduced-motion spot check (emulate via Playwright).
- `npm run build` passes.
