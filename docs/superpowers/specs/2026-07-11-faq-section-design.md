# FAQ Section — Design

## Goal
Add a "Got Questions? We've Got Answers" FAQ section above the footer, matching the layout of a supplied reference (design agency site: heading + intro-call card on the left, accordion FAQ list on the right).

## Placement
New `app/components/FaqSection.tsx`, rendered in `app/page.tsx` between `<ProcessSection />` and `<Footer />`.

## Content
- Heading: "Got Questions?" (bold) / italic "We've Got Answers" — same bold+italic pattern used elsewhere.
- Subtext: one sentence inviting the visitor to reach out.
- 11 FAQ items (question + answer), adapted to AGOUA's VR/AR/visualization business — covering client types, pricing range, timelines, scope (software vs. full installs), on-site hardware, communication, services offered, time zones, why AGOUA vs. a freelancer, upgrading existing builds, and differentiation.
- Card: "Book an Intro Call" — abstract circular avatar (person/headset line icon on a teal-tinted background, no fake photo), short description, "Book a Free Call" black-pill CTA (reusing the site's arrow-button pattern), divider, "Prefer Email Instead?" with the existing `info@agouasolutions.com` address.

## Layout
- Section: `bg-background`, `py-20 sm:py-28`, container `mx-auto max-w-6xl px-6 lg:px-8`.
- `grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-16`, with a `lg:border-l lg:border-border-hairline lg:pl-16` divider on the right column (matching the reference's thin vertical rule).
- Left column: heading, subtext, then the intro-call card (`rounded-2xl border border-border-hairline bg-surface`, soft gradient background).
- Right column: accordion list, one item open at a time, each row toggled by a `+`/`×` icon that rotates on open, divided by `border-b border-border-hairline` (no border on the last item). Answer text expands with a smooth height/opacity transition.

## Out of scope
- No real headshot photography — avatar is an abstract icon, not a photo.
- "Book a Free Call" is visual-only for now (no booking integration), consistent with other CTAs on the site.
