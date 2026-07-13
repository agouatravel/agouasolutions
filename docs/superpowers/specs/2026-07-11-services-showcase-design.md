# Services Showcase Section — Design

## Goal
Add a full-screen, scroll-driven showcase of AGOUA's core services below "Featured Case Studies," matching the layout style of a supplied reference (design agency site with full-viewport colored panels, one per service, crossfading as you scroll).

## Placement
New `app/components/ServicesShowcaseSection.tsx`, rendered in `app/page.tsx` between `<CaseStudiesSection />` and `<Footer />`.

## Content
4 panels, one per AGOUA service:

| # | Heading (bold / italic) | Background | Caption |
|---|---|---|---|
| 01 | Virtual Reality / *Experiences* | deep blue | Step Inside The Experience |
| 02 | Augmented Reality / *Solutions* | near-black | Blending Digital With Real |
| 03 | Architectural / *Visualization* | deep indigo/purple | Visualize Before You Build |
| 04 | Experience Center / *Design* | deep teal-black | Spaces That Sell The Vision |

Background colors are darkened/desaturated variants of the site's existing accent hues (not flat bright accent hex), to stay consistent with the site's premium dark aesthetic rather than introducing loud neon fills.

## Mechanism
- Wrapper section height = `panels.length * 100vh`.
- Inner `sticky top-0 h-screen w-full overflow-hidden` container holds all 4 panels absolutely stacked (`inset-0`).
- On scroll, JS computes a continuous progress value `p` (0 to panels.length - 1) from the wrapper's scroll position. Each panel's opacity = `1 - clamp(|p - index|, 0, 1)` — a linear crossfade over one viewport-height of scroll between adjacent panels.
- Only `opacity` (and a small `transform: translateY` for subtle parallax on the panel content) are animated per frame — no `width`/`height`/`filter: blur` resizing, to avoid the repaint cost that caused jank in `VideoSection`.
- Driven by the same `scroll` + `requestAnimationFrame` + `ticking`-guard pattern already used in `VideoSection.tsx`.

## Panel layout
- Top-left: `(01)`–`(04)` counter, `font-label` (JetBrains Mono), white/70% opacity.
- Top-right: "Explore Services" text link (visual only, no routing — consistent with "View all" / "Book Consultation" elsewhere).
- Center-left: heading (`font-display`, bold first part, italic second part — same pattern as "Featured *Case Studies*").
- Below heading: a slightly rotated "polaroid" card — white frame padding, inner dark card reusing the grid-pattern + glow-blob + large icon treatment already established in `VideoSection`/`CaseStudiesSection`, with a caption bar at the bottom of the polaroid.

## Out of scope
- No real photography — the polaroid's inner content is the same abstract grid/glow/icon treatment used elsewhere, not stock photos.
- No routing on "Explore Services" (visual only, for now).
- No mobile-specific alternate layout beyond standard responsive stacking; the crossfade mechanism applies at all viewport sizes.
