# Hero Grid Cursor-Highlight — Design

## Goal
On mouse move over the top hero area (headline, badge, CTAs), highlight the exact background grid cell under the cursor by tracing its border in the brand gradient color. The effect must cover the entire top hero grid area, not just the small region circled in the reference screenshot.

## Scope
- Applies to: the top hero content area only (`app/components/Hero.tsx`), i.e. above the dark contact-info strip at the bottom of the section.
- Does NOT apply to: the dark `bg-tertiary` strip at the bottom of the hero (its own `.bg-grid` layer is untouched).

## Behavior
- A 44×44px square (matching the existing `.bg-grid` `background-size: 44px 44px`) tracks the mouse, snapped to the grid cell the cursor is currently over via `Math.floor(x / 44)` / `Math.floor(y / 44)`.
- Only the square's **border** is colored — the interior remains fully transparent (no background fill), achieved via the `mask-composite: exclude` CSS technique (gradient painted into a padding-box ring).
- Border color: diagonal linear gradient from `var(--color-primary)` (teal) to `var(--color-secondary)` (blue), matching the existing `.text-gradient-brand` treatment used on "Immersive Experiences".
- Movement between cells animates with a short `150ms` ease-out transition on `transform` (slide, not instant jump).
- The square fades in (`opacity: 1`) on mouse enter of the hero-top area and fades out (`opacity: 0`, `200ms`) on mouse leave.
- The square sits above the grid background but below interactive content, and is `pointer-events: none` so it never blocks clicks on buttons/links.

## Implementation
- `app/components/Hero.tsx` gains a `"use client"` directive (needed for `useRef` + mouse event handlers).
- The existing top-content markup is wrapped in a new `relative` wrapper div carrying `onMouseMove` / `onMouseLeave` handlers, scoped to just the top hero portion (excludes the bottom dark strip, which lives in its own sibling block).
- Cursor tracking updates the highlight square's position via direct ref/style mutation (`ref.current.style.transform = ...`) rather than React state, avoiding re-renders on every `mousemove` event. A cheap comparison against the last-set cell skips redundant DOM writes when the cursor moves within the same cell.
- No new files needed — the highlight square and its inline styles live directly in `Hero.tsx`; the mask-composite gradient-border technique is applied via inline `style` (kept out of `globals.css` since it's a single-use, self-contained treatment).

## Out of scope
- No effect on the dark footer grid strip.
- No effect on mobile/touch (mouse-only; no touch handling needed since there's no cursor to track).
