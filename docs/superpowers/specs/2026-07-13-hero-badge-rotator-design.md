# Hero Badge Rotator — Design Spec

**Date:** 2026-07-13
**Status:** Approved

## Goal

Replace the Hero section's static "Riyadh, KSA — Immersive Technology
Studio" pill with a badge that auto-cycles through several short taglines,
each with its own icon, adding movement and personality above the headline.

## Content & data model

A fixed array of 4 taglines, each `{ icon, text, showMap }`:

1. Pin icon — "Riyadh, KSA — Immersive Technology Studio" (`showMap: true`,
   this is today's content/icon)
2. VR headset icon — "VR · AR · Architectural Visualization"
3. Check/badge icon — "Trusted by 30+ Developers & Retailers"
4. People icon — "Dedicated In-House Studio Team"

## Rotation mechanics

- Interval-driven index cycles every 3.5s, looping 1→2→3→4→1…
- Transition: crossfade + slight rise (outgoing fades out while rising a few
  px, incoming fades in from slightly below), using the site's existing
  `cubic-bezier(0.16, 1, 0.3, 1)` easing.
- Rotation **pauses on hover** of the badge (mouse enter clears the
  interval; mouse leave restarts it) so the content doesn't change while a
  visitor is reading it or looking at the map popover.
- Under `prefers-reduced-motion: reduce`, rotation is disabled entirely —
  the badge renders only the first (Riyadh) tagline, statically, matching
  how the rest of the site already treats reduced motion.

## Map hover popover

The existing Riyadh map preview card (shown today on hover) is preserved
unchanged, but only rendered when the badge's currently-displayed tagline
is slide 1 (Riyadh). On other slides, hover has no popover.

## Layout handling

Tagline text lengths vary significantly. The pill's width animates smoothly
to fit each incoming tagline (measured via a hidden absolutely-positioned
sizer element showing the incoming text, whose measured width drives a CSS
width transition on the visible pill) rather than snapping to a new width,
so the resize reads as part of the same smooth transition as the crossfade.

## Icons

Each tagline has its own small inline SVG (pin — existing; VR headset;
checkmark-in-badge; two-person/people), sized and stroke-styled identically
to today's pin icon (18×18, white stroke/fill), crossfading in sync with
the text.

## Constraints

- Animate only `opacity`, `transform`, and `width` (GPU/layout-cheap;
  width transition is unavoidable but is a single small element, not a
  page-wide reflow trigger).
- No new dependencies; implemented with `useState`/`useEffect`/`setInterval`
  inside the already-client `Hero.tsx`.
- Preserve existing badge interaction: it's still a `<button>` (currently
  non-functional decoratively), pill shape, primary background, same
  padding/shadow.
- Respect `prefers-reduced-motion` per the constraint established in the
  motion-system spec.

## Verification

- `npm run build` passes.
- Playwright: screenshot the badge at each of the 4 slides (advance via
  fake timers or waiting through real intervals), confirm width/content
  change smoothly, confirm hover pauses rotation, confirm map popover only
  shows on slide 1, confirm reduced-motion emulation freezes on slide 1.
