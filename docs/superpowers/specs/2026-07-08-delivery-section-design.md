# "How We Deliver" Section — Design

## Goal
Add a new value-proposition section below the "Trusted By" logos section (`LogosSection`), inspired by a reference screenshot (2x2 grid of badge/icon/heading/description cells with divider lines and a center dot), but restyled to AGOUA's brand and rewritten with AGOUA-specific copy, plus a distinct staggered/interactive animation treatment (not a copy of the reference's static look or LogosSection's single-block reveal).

## Scope
- New component: `app/components/DeliverySection.tsx`.
- Rendered in `app/page.tsx` immediately after `<LogosSection />` and before `<Footer />`.
- Client component (`"use client"`) — needs `IntersectionObserver` for scroll reveal and `onMouseMove` for the hover glow.

## Content
Four cells, each with: colored badge pill, line icon, heading (`--font-display`), description (`text-muted`).

1. **Badge:** "Dedicated Studio Team" (teal tint) · **Icon:** chat bubble
   **Heading:** Work With A Dedicated Studio Team
   **Body:** Get hands-on VR, AR, and visualization support from our in-house team — no scattered freelancers, no hand-offs.

2. **Badge:** "Rapid Deployment" (blue tint) · **Icon:** trending-up arrow
   **Heading:** Launch Experiences In Weeks
   **Body:** We design, build, and deploy immersive experiences fast, with pipelines built for tight event and launch timelines.

3. **Badge:** "Built To Scale" (violet tint) · **Icon:** expand/maximize
   **Heading:** Scale From Demo To Experience Center
   **Body:** Start with a single VR showcase and expand into a full multi-room experience center as your needs grow.

4. **Badge:** "End-To-End Delivery" (amber tint) · **Icon:** gauge/dial
   **Heading:** Focus On Your Vision, We Handle Production
   **Body:** We manage hardware, content, and on-site installation so your team can focus on the experience, not the execution.

## Layout
- Section header above the grid: small uppercase label pill + heading, styled consistently with `LogosSection`'s "Trusted By" header (badge + `h2` in `--font-display`), so the two sections read as a matched pair. Copy: label "How We Deliver", heading "Built To Support Your Immersive Roadmap".
- Grid: `grid-cols-1 sm:grid-cols-2`, built via the bordered-grid technique — wrapper has `border-t border-l border-border-hairline`, each cell has `border-r border-b border-border-hairline`. This produces the full-bleed divider lines from the reference without extra absolute-positioned divider elements.
- A small filled dot (`h-2 w-2 rounded-full bg-foreground`, matching the reference) sits absolutely centered at the grid's middle intersection point, visible only at `sm:` and above (hidden on the single-column mobile layout since there's no intersection).
- Each cell: generous padding (`px-8 py-14`, roughly matching reference proportions), center-aligned content (badge → icon → heading → body), consistent with the reference's vertical stack.

## Colors
Four accent tints, local to this component (not added to global CSS vars, since they're single-purpose decorative tints):
- Teal: `bg-[rgba(20,184,166,0.12)] text-[#0d8f81]` (reuses existing `--color-primary`/`--color-primary-dim` values)
- Blue: `bg-[rgba(59,130,246,0.12)] text-[#2563eb]` (reuses existing `--color-secondary` hue)
- Violet: `bg-[rgba(139,92,246,0.12)] text-[#7c3aed]` (new accent, not used elsewhere)
- Amber: `bg-[rgba(245,158,11,0.14)] text-[#b45309]` (new accent, not used elsewhere)

Each cell's accent color also drives its hover glow and border-brighten (see Animation).

## Animation
Distinct from `LogosSection`'s single-block fade (that section reveals the whole header+marquee as one unit). This section reveals **per-cell**, staggered:

- One `IntersectionObserver` on the section wrapper (`threshold: 0.2`) flips a single `visible` boolean once, same trigger pattern as `LogosSection`.
- Each of the 4 cells applies `translate-y-6 opacity-0` → `translate-y-0 opacity-100`, `transition-all duration-700 ease-out`, with `transitionDelay: ${index * 90}ms` — so cells animate in one after another (reading order) rather than all at once.
- Hover interaction per cell (CSS/JS, independent of the scroll reveal):
  - A radial-gradient "spotlight" layer inside the cell follows the cursor via `onMouseMove` writing `--x`/`--y` CSS custom properties consumed by an inline `background: radial-gradient(circle at var(--x) var(--y), <accent-color>/12%, transparent 60%)`; opacity transitions `0 → 1` on `onMouseEnter`/`onMouseLeave` (`200ms`).
  - The icon scales slightly (`group-hover:scale-110`) with a `transition-transform duration-300`.
  - The cell's own `border-r`/`border-b` (and the shared wrapper `border-t`/`border-l` where applicable) transition color from `border-border-hairline` toward the cell's accent color at ~40% opacity on hover, via a plain Tailwind `hover:border-[color]` on each cell (cells are adjacent grid items so this only recolors that cell's two owned edges, which reads as the nearest divider lines "lighting up").
  - No cursor-glow / hover effects run until the reveal transition has completed (guarded by the same `visible` state) to avoid odd interplay during entry.

## Implementation notes
- No changes to `globals.css` — all styling (including the spotlight gradient and per-cell delays) is inline/Tailwind within `DeliverySection.tsx`, consistent with how `Hero.tsx` keeps its one-off cursor-highlight styling local.
- Icons are inline SVGs, stroke-based (`stroke="currentColor"`, `strokeWidth 1.75`, rounded caps/joins), sized `24x24`, matching the line-icon style already used for the hero's arrow/play icons.
- `app/page.tsx` gains one import + one JSX line (`<DeliverySection />` after `<LogosSection />`).

## Out of scope
- No changes to `LogosSection`, `Hero`, or `Footer`.
- No new global CSS variables/keyframes — violet/amber tints are component-local.
- No CMS/data-driven content — the 4 items are a static array in the component, matching the pattern used for `rowOne`/`rowTwo` in `LogosSection`.
