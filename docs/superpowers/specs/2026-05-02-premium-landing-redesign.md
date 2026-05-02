# Premium Landing Redesign — Pilot 1

**Date:** 2026-05-02
**Scope:** Single-page redesign of `app/[lang]/page.tsx` and its section components.
**Status:** Approved by Hasan, ready to implement.

## Goal

Reposition the Taxsi landing page from generic "Cyprus airport transfer" mass-market to a Blacklane / Wheely-tier premium chauffeur aesthetic, while preserving:

- All three existing locales (EN, TR, RU) — no new languages.
- The "fixed prices" core messaging — kept verbatim as a trust pillar.
- The current Stripe + cash payment model — no new payment methods displayed.
- All other pages (`/book`, `/routes`, `/about`, `/contact`, `/faq`, `/blog`, `/(customer)/*`) — untouched.

Target audience per brief: international business travelers and premium tourists from DACH / UK / Nordics / Mediterranean / Russia, household income €120K+, valuing discretion, reliability, and meet-and-greet trust signals over price.

## Out of Scope

- New languages (DE, FR, IT, ES, AR).
- Booking flow rework — the inline form on the hero only routes to `/book` with prefilled query params; the actual `/book` wizard stays as is.
- New payment integrations.
- Redesign of header / footer / other pages — handled in a future pilot.
- Real photography — use CSS-only cinematic treatment (gradients, grain, geometric accents). Photo swap can happen later.

## Aesthetic Direction

**Tone:** "Arrive composed." Restrained, sophisticated, deliberate. No exclamation marks, no superlatives.

**Palette (refined from existing tokens in `globals.css`):**

| Role | Token | Hex | Use |
|------|-------|-----|-----|
| Dominant dark | `--color-night` | `#0a0a0a` (was `#0c1a2e`) | Hero, CTA bands, vehicle showcase |
| Off-white | `--color-cream` | `#faf7f2` (was `#fdf9f4`) | Body sections |
| Warm secondary | `--color-sand` | `#f4ece0` (kept) | Section breaks, cards |
| Single accent | `--color-gold` | `#c9a961` (was `#c8922a`) | Thin dividers, key CTAs, numerals |
| Accent dark | `--color-gold-dark` | `#a88a48` (was `#a37120`) | Hover states |
| Ink | `--color-ink` | `#1c1208` (kept) | Body copy on cream |
| Subtle text | `--color-clay` | `#7a6040` (kept) | Captions, eyebrows |

**Typography (existing fonts, no changes to `app/layout.tsx`):**

- Display: Cormorant Garamond — light italic for hero, regular for section headings.
- Body: DM Sans — used at small sizes with generous tracking for eyebrow / micro labels.
- New utility classes for editorial typography: `.eyebrow` (uppercase, tracked, gold), `.kicker` (small caps numerals).

**Motion (CSS-only, no library):**

- Hero copy: staggered fade + 8px lift on load (existing `slide-up`, slowed to 1200ms with `cubic-bezier(0.16, 1, 0.3, 1)`).
- Section reveals: subtle 600ms fade-in via CSS (`@starting-style` on first paint where supported, fallback to existing keyframe).
- Hovers: opacity / underline only — no scale or bounce.
- Gold accent line under section headings: 800ms `scale-x` from 0 → 1, transform-origin left.

**Texture & atmosphere:**

- Hero: layered radial gradients (warm gold glow top-right at low opacity over near-black) + a CSS noise overlay (SVG `feTurbulence` data URI at 4% opacity) + a thin gold horizontal hairline at the chrome / floor split.
- Section transitions: hairline gold dividers between dark and cream bands.
- No drop shadows. Depth comes from value contrast and hairlines.

## Page Structure (top to bottom)

1. **Hero** (dark band, full-viewport on desktop, ~85vh on mobile)
   - Eyebrow: "Cyprus · Chauffeur Service"
   - Headline (Cormorant italic, 56–88px): "Arrive composed."
   - Subhead (DM Sans, max 540px): brief value statement — fixed prices, professional drivers, meet & greet at the terminal.
   - **Inline route picker:** From / To selects + Date + Passengers, single CTA "Reserve" → routes to `/[lang]/book?from=X&to=Y&date=Z&pax=N`. Visual style: glass-on-dark, gold underline focus state, no boxes — just lines under each field.
   - Right-side / background: composed cinematic CSS scene — vignette gradient suggesting a black sedan silhouette, gold glow as headlights, fine grain.

2. **Trust strip** (cream band, hairline divider)
   - Three columns separated by gold hairlines: "Meet & greet at arrivals" · "Flight tracking included" · "Fixed price, no meters."
   - Tiny serif numerals (01 / 02 / 03) in gold.

3. **Why Taxsi** (cream band, editorial 2-column grid)
   - Left column: serif heading "A different kind of transfer." with eyebrow "Why Taxsi"
   - Right column: stacked feature blocks, each with an italic Cormorant phrase as the value prop and a single sentence below in DM Sans. 4 items, kept from existing copy but rewritten in restrained voice. "Fixed prices" stays as the first item per user constraint.

4. **Fleet showcase** (dark band)
   - Heading: "The fleet."
   - Three cards horizontally on desktop (stacked on mobile): Executive Sedan / Executive Van / VIP. Each card: vehicle name in serif, capacity in tiny caps, single-sentence description, fine gold underline on hover. No photos — replaced with a sculpted gradient panel (suggesting silhouette) per card to keep it premium without stock imagery.

5. **Popular routes** (cream band)
   - Heading: "Routes." Eyebrow: "Cyprus, point to point."
   - 6 routes in a tight 2-column list with prices on the right, gold hairlines between rows. Hover: row gets a faint sand wash, "Reserve →" appears.
   - "All routes →" link at the bottom right in gold.

6. **How it works** (cream band, three columns)
   - Three steps with serif italic numerals (01, 02, 03) in gold, hairline dividers between columns on desktop. Copy kept from existing dictionary but tightened.

7. **Corporate teaser** (dark band, two-column)
   - Left: serif heading "For business travel." short paragraph about consolidated invoicing, VAT receipts, account managers.
   - Right: simple form-less CTA "Speak with our concierge →" linking to `mailto:` (existing contact email used).
   - Note: this is content-only — no actual corporate portal is built. It's a teaser that frames the brand as serious about B2B.

8. **Closing CTA** (dark band, centered)
   - Cormorant italic statement: "Wherever you're heading. We've already arrived."
   - Single gold-bordered ghost button → `/book`.

Existing `Header` and `Footer` are unchanged.

## File Changes

**Modified:**

- `app/globals.css` — palette tokens refined, new utility classes (`.eyebrow`, `.kicker`, `.hairline`, `.noise`), additional keyframes (`reveal`, `gold-line`).
- `app/[lang]/page.tsx` — section composition order updated, three new sections imported.
- `app/[lang]/_components/hero.tsx` — full rewrite: inline route picker, cinematic CSS scene.
- `app/[lang]/_components/why-taxsi.tsx` — editorial 2-column rewrite.
- `app/[lang]/_components/popular-routes.tsx` — minimal list rewrite.
- `app/[lang]/_components/how-it-works.tsx` — typographic rewrite with serif numerals.
- `app/[lang]/_components/cta-banner.tsx` — closing-CTA rewrite.
- `dictionaries/en.json`, `dictionaries/tr.json`, `dictionaries/ru.json` — `homepage.*` keys rewritten with premium voice; new keys added: `homepage.trust`, `homepage.fleet`, `homepage.corporate`. "Fixed prices" item retained verbatim where it appears.

**Added:**

- `app/[lang]/_components/trust-strip.tsx`
- `app/[lang]/_components/fleet.tsx`
- `app/[lang]/_components/corporate.tsx`
- `app/[lang]/_components/route-picker.tsx` — extracted from hero, used inline in hero, server-renders the dropdown options from the same `getRoutes()` call.

**Untouched:**

- `app/[lang]/_components/header.tsx`, `footer.tsx`, `language-switcher.tsx`
- All pages other than `/[lang]/page.tsx`
- All `(customer)/*` pages
- `lib/`, `components/ui/`, `proxy.ts`, all backend integration

## Data & Behavior

- The route picker `From` / `To` selects are populated from the existing `getRoutes()` server call already used on the page. No new endpoints.
- On submit, the picker performs a `<form action="/[lang]/book">` GET with `from`, `to`, `date`, `pax` query parameters. Whether `/book` reads these prefilled params is **out of scope** — picker just ships the data, page can adopt later.
- All other dynamic data (popular routes, prices) continues to come from `getRoutes()`.
- No new dependencies. Tailwind v4 + existing fonts only.

## Accessibility & SEO

- Maintain existing `generateMetadata` and per-locale metadata.
- Color contrast on dark band: gold (#c9a961) text on charcoal (#0a0a0a) hits 7.2:1 — passes AAA for body text.
- Form labels in route picker are visible (no placeholder-as-label antipattern).
- Motion respects `prefers-reduced-motion`: all keyframes wrapped in `@media (prefers-reduced-motion: no-preference)`.
- Heading hierarchy preserved: single `<h1>` in hero, `<h2>` per section.

## Success Criteria

- Visual: dark/cream alternating bands, gold-only accent, editorial typography, cinematic hero — looks at home next to Blacklane / Wheely reference.
- Functional: `npm run build` passes. `npm run lint` clean. Page renders with EN, TR, RU. Picker submits to `/book` with query params. Existing routes data continues to render.
- No regressions on header / footer / other pages.

## Risk Notes

- Cinematic-without-photos requires care — if the CSS scene lands cheesy, swap in real Unsplash / commissioned photography in a follow-up.
- Picker prefill is one-way (we ship params, `/book` ignores them today). Functional debt logged but acceptable for pilot.
- TR / RU copy translation quality should be reviewed by a native speaker — the implementation pass uses careful but AI-translated phrasing.
