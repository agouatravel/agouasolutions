# Featured Case Studies Section — Design

## Goal
Add a "Featured Case Studies" section below the "How We Deliver" (Immersive Roadmap) section, showcasing a grid of case study tiles, matching the layout of a supplied reference screenshot.

## Placement
New `app/components/CaseStudiesSection.tsx`, rendered in `app/page.tsx` between `<DeliverySection />` and `<Footer />`.

## Content
No real project photos exist yet. Tiles reuse the fictional client names already established in `LogosSection.tsx` ("Trusted By") for continuity:

| Client | Project | Category | Accent |
|---|---|---|---|
| Nova Realty | VR Property Showroom | Virtual Reality | teal |
| Zenith Towers | Interactive Sales Suite | Product Visualization | blue |
| Falcon Retail | AR Shopping Experience | Augmented Reality | purple |
| Vertex Living | Digital Twin Showcase | Digital Twin | amber |
| Halo Retail | Flagship Launch Activation | Event Activation | dark (featured) |
| Skyline Group | Experience Center Build-Out | Experience Center | teal |
| Cedar Exhibits | Immersive Trade Show Booth | Event Activation | blue |
| Orbit Expo | Training Simulation Platform | Training Simulation | purple |

Accent colors reuse the 4-color palette already defined in `DeliverySection.tsx` (teal `#14b8a6`, blue `#3b82f6`, purple `#7c3aed`, amber `#f59e0b`).

## Layout
- Section: `bg-background`, `py-20 sm:py-28`, container `mx-auto max-w-6xl px-6 lg:px-8`.
- Header row: `flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6`.
  - Heading: "Featured *Case Studies*" — `font-display` (Space Grotesk), second word italic — no new font import.
  - "View all" pill button: `bg-tertiary` (near-black), white text, small circular arrow icon, right-aligned, matches reference exactly.
- Grid: `grid grid-cols-2 sm:grid-cols-3 gap-6`, 8 tiles. The 5th tile (Halo Retail) spans `sm:col-span-2` as the featured/wide tile, matching the reference's emphasis pattern.

## Tile visual (placeholder, no photos)
Each tile is a generated placeholder, not a fake photo:
- `aspect-[4/3]` rounded-2xl `overflow-hidden` card.
- Background: radial gradient using the tile's accent color (reusing the glow-blob technique from `VideoSection.tsx`), plus a faint `.bg-grid` overlay.
- A large, faint 2-letter monogram of the client name, centered.
- The featured tile uses `bg-tertiary` with white content instead of a light accent gradient, echoing `VideoSection`'s dark card treatment for visual weight.
- Caption below each tile (outside the image, not overlaid): bold project name (`text-foreground`), muted category label beneath it (`text-muted`, small/uppercase-ish per existing label conventions).

## Out of scope
- No real imagery/photos (placeholder gradients only, swappable later).
- No individual case-study detail pages/links — "View all" and tiles are visual-only for now (no routing).
- No new fonts or new color tokens — reuses existing `--color-primary/secondary/tertiary` and the amber/purple ad-hoc values already used in `DeliverySection.tsx`.
