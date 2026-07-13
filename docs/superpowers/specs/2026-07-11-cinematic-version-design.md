# Cinematic Version — Design

## Goal
Create a new sibling project, `website-cinematic`, starting as a full copy of the current site, then upgrade its scroll behavior to feel like an Apple-style cinematic scroll story — same content, sections, and copy as the current site, just presented with more dramatic, unified scroll-reveal motion, plus one new opening beat.

## Scope
- **Copy first**: duplicate the entire current project into `D:\Agoua solutions\website-cinematic` (same Next.js 16 / Tailwind v4 / fonts / all existing components and content). The original `website` project is untouched.
- **No content/copy/layout changes** — every section, its data, and its visual design stay as they are today.
- Two categories of change, both scroll-behavior only:
  1. A new full-screen intro before the Hero.
  2. A consistent cinematic scroll-reveal treatment applied across all sections.

## New intro
- A fixed, full-screen overlay (`bg-tertiary`, near-black) mounted at the root layout, above everything (`z-[100]`).
- Sequence: overlay is opaque on load → the AGOUA wordmark (existing `/brand/agoua-logo.svg`, inverted for the dark background, same treatment as the footer) fades and scales in (opacity 0→1, scale 0.92→1, ~600ms) → holds briefly (~500ms) → the whole overlay fades out (~600ms) and is removed from the DOM/interaction (`pointer-events: none` during fade-out, unmounted after).
- Shown once per browser session (`sessionStorage` flag) — it won't replay on internal navigations within the same session, only on a fresh session/reload.
- Implemented as a small client component wrapping `{children}` in `app/layout.tsx`; the page underneath renders normally the whole time (already settled), so the overlay fading away *is* the reveal — no need to delay or resequence the Hero's own existing fade-up animations.

## Cinematic scroll-reveal (site-wide)
- A shared, reusable "reveal on scroll" mechanism (a small hook/wrapper component) replaces the current per-section `IntersectionObserver` + fixed `translate-y-6 opacity-0 → translate-y-0 opacity-100` pattern (currently duplicated in `LogosSection`, `DeliverySection`) and is additionally applied to sections that don't yet animate in at all (`StudioTeamSection`, `CaseStudiesSection`, `FaqSection`, `Footer`).
- Visual treatment: slightly larger rise distance and slower, more deliberate easing (a custom cubic-bezier "settle" curve) than the current `700ms` fade-up, so each section feels like it's arriving as a deliberate "scene" rather than a quick fade.
- Purely `transform`/`opacity`-driven (as everything already is) — no new layout-triggering properties, keeping it as smooth as the fixes already made to `VideoSection`.
- `VideoSection`, `ServicesShowcaseSection`, and `ProcessSection` keep their existing pinned/scroll-driven mechanics (already transform/opacity-based after recent fixes) but get their easing/timing constants tuned to match the same "settle" feel for consistency across the page.

## Out of scope
- No scene-transition interludes between sections (evaluated, not wanted for this pass).
- No new pages, sections, copy, or imagery.
- No changes to the original `website` project.
