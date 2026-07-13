# Studio Team CTA Section — Design

## Goal
Add a CTA section between "How We Deliver" (`DeliverySection`) and "Featured Case Studies" (`CaseStudiesSection`), matching the layout of a supplied reference screenshot (a SaaS pricing pitch), but adapted to AGOUA's immersive-studio positioning instead of pricing.

## Placement
New `app/components/StudioTeamSection.tsx`, rendered in `app/page.tsx` between `<DeliverySection />` and `<CaseStudiesSection />`.

## Copy
- Headline: "Get A Full Immersive Studio Team For" (bold) / "Less Than Hiring In-House" (italic, second line) — same two-line bold+italic pattern as the "Featured *Case Studies*" heading.
- Subtext: "Most teams lose time managing VR/AR vendors and slow production cycles. We work as an extension of your team to design, build, and deploy faster."
- CTA button: "Start A Project" with a circular arrow icon — same black-pill visual treatment as the "View all" button in `CaseStudiesSection`.
- Right-side list (5 items, arrow-prefixed, divided by hairline rules):
  1. Fast VR/AR Prototyping
  2. Dedicated Studio Team
  3. Better On-Site Experiences
  4. Clean & Scalable 3D Design
  5. Ongoing Experience Support

## Layout
- Section: `bg-background`, `py-20 sm:py-28`, top and bottom `border-t border-b border-border-hairline` (matching the reference's hairline frame).
- Container: `mx-auto max-w-6xl px-6 lg:px-8`, `grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-12 lg:gap-20`.
- Left column: headline, subtext (`text-muted`, `max-w-md`), CTA button below.
- Right column: `border-l border-border-hairline` (desktop only) with left padding, vertical stack of 5 rows, each `flex items-center gap-2` with a small arrow glyph + label, separated by `border-b border-border-hairline` (no border on the last item).

## Out of scope
- No pricing/plans content — this is a positioning CTA, not a pricing table.
- No new fonts, colors, or components beyond what's already established (`font-display`, `--color-tertiary` pill button, `border-border-hairline`).
- CTA button is visual-only for now (no routing/href behavior), consistent with the "View all" button in `CaseStudiesSection`.
