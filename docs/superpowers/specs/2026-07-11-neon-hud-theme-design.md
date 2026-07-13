# Neon HUD Dark Theme — Design

## Goal
A third sibling project, `website-neon`, with the same content/copy as the original site but a completely new dark, cinematic "sci-fi HUD / neo-noir" visual theme, built with GSAP (ScrollTrigger) for scroll choreography and Three.js (via `@react-three/fiber` + `@react-three/drei`) for a persistent 3D background.

## Project setup
- Copy of the original `website` project (not `website-cinematic`) into `D:\Agoua solutions\website-neon`, since most of the hand-rolled vanilla scroll-listener code will be replaced by GSAP rather than extended.
- New dependencies: `gsap`, `three`, `@react-three/fiber`, `@react-three/drei`.
- Same Next.js 16 / Tailwind v4 / existing fonts (Space Grotesk, JetBrains Mono, Sora, Geist) — the monospace JetBrains Mono is kept front-and-center as the "HUD label" font, which already suits this direction.

## Theme
- **Background**: near-black (`#050608`) as the base surface everywhere (replacing the current light `--background`/`--surface`), instead of a light theme with only the footer/video-card dark.
- **Accent**: brand teal (`#14b8a6`) and blue (`#3b82f6`) kept, but used as *glow* — text-shadow/box-shadow glow on headings, buttons, and borders — rather than flat fills.
- **Motifs**:
  - Monospace "system label" prefixes on section headings, e.g. `[ 01 // DISCOVER ]`, reusing `font-label` (JetBrains Mono).
  - Thin glowing borders instead of solid hairlines; corner-bracket decorations (viewfinder-style corners) on cards.
  - A subtle scan-line texture overlay (repeating linear gradient) on dark surfaces.
  - The existing `.bg-grid` 2D pattern is kept for flat surfaces, but the Hero's background becomes a full 3D version of the same grid (see below).

## 3D background (Three.js)
- A fixed, full-viewport `@react-three/fiber` `<Canvas>` renders a glowing teal wireframe grid plane in perspective, receding toward a vanishing point (a 3D "digital floor"), evolving the site's existing 2D grid motif into an immersive one.
- Camera/grid drift is driven by scroll position via GSAP `ScrollTrigger` (`onUpdate` feeding a ref/state consumed inside the R3F scene), giving a subtle parallax as the user scrolls, rather than being purely time-animated.
- Rendered behind the Hero at minimum; may extend as a persistent subtle backdrop behind other dark sections if performance allows.

## Scroll choreography (GSAP)
- Replaces the vanilla `scroll` + `requestAnimationFrame` handlers currently in `VideoSection`, `ServicesShowcaseSection`, and `ProcessSection` with GSAP `ScrollTrigger` timelines (`scrub: true` for scroll-scrubbed effects), which is more robust/composable than hand-rolled listeners.
- Section entrances (currently `IntersectionObserver`-based fade-ups in `LogosSection`/`DeliverySection`, or absent elsewhere) become `gsap.from()` calls triggered by `ScrollTrigger`, with HUD-appropriate motion (slight upward drift + a brief glow-in on accent elements, not just opacity/translate).

## Content
- Identical sections, copy, and data to the original site (Hero, Video, Logos, Delivery, Studio Team, Case Studies, Services Showcase, Process, FAQ, Footer) — only the visual theme and animation engine change.

## Out of scope
- No content/copy rewrites.
- No new sections beyond what already exists across the three projects.
- Mobile: the 3D canvas may be disabled or simplified on small/low-power viewports if it causes performance issues (final call made during implementation based on testing).
