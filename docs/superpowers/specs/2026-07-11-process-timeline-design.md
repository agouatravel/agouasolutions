# Process Timeline Section — Design

## Goal
Add a step-by-step delivery-process section below the Services Showcase, matching the layout of a supplied reference (SaaS agency's "Plan / Structure / Build" vertical timeline).

## Placement
New `app/components/ProcessSection.tsx`, rendered in `app/page.tsx` after `<ServicesShowcaseSection />`, before `<Footer />`.

## Content
- Headline: "A Faster Way To Design And" (bold) / italic "Build Immersive Experiences" (second line) — same bold+italic heading pattern used elsewhere on the site.
- Subtext: one sentence describing AGOUA's streamlined delivery approach.
- 4 steps:

| Step | Phase (italic) | Title | Description |
|---|---|---|---|
| 1 | Discover | Define The Experience Goal | We start by understanding your goals, audience, and the immersive experience that will make the biggest impact. |
| 2 | Design | Prototype The Experience | We block out the experience flow and build an early VR/AR prototype before full production begins. |
| 3 | Build | Develop & Integrate | Our team builds the full experience and integrates hardware, content, and on-site systems. |
| 4 | Deploy | Launch & Support | We install on-site, run final QA, and stay on to support the experience after launch. |

## Layout
- Section: `bg-background`, `py-20 sm:py-28`, container `mx-auto max-w-6xl px-6 lg:px-8`.
- Header: left-aligned heading + subtext (`max-w-xl`, `text-muted`), same pattern as `CaseStudiesSection`/`StudioTeamSection`.
- Steps list: each row is a grid (`grid-cols-[110px_32px_1fr]`, `lg:grid-cols-[110px_32px_1fr_340px]`), separated by `border-b border-border-hairline` (no border on last row):
  1. Step badge (small pill, "Step N") + phase name below it in large italic `font-display`.
  2. A vertical connector line (`border-l` or absolutely-positioned `w-px` div spanning the row's full height) with a circular marker near the top of the row. The first step's marker is filled (`bg-primary`, white icon) to draw initial focus; the rest are outlined (`border border-border-hairline bg-background`).
  3. Step title (`font-display font-semibold`) + description (`text-muted`).
  4. (desktop only, `hidden lg:block`) — a visual card reusing the site's existing grid-pattern + glow-blob + icon treatment (same technique as `VideoSection`/`ServicesShowcaseSection`), inside a light rounded "device frame" echoing the reference's mockup frame, cycling through the site's 4 accent colors per step.

## Out of scope
- No real screenshots/mockups — visual cards are the same abstract treatment used elsewhere.
- No interactivity/expand-collapse on steps — static list.
- Visual card column is desktop-only; mobile shows just the numbered list (badge, phase, title, description).
