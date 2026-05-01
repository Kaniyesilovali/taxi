# Taxsi — Marketing Pages Design Specification

**Date:** 2026-04-30
**Depends on:** `2026-04-28-taxsi-platform-design.md` (customer portal already built)

---

## 1. Overview

Add a full marketing site layer to the existing Taxsi customer portal. The booking form moves from `/` to `/[lang]/book`. A new marketing homepage, informational pages, blog, and legal pages are added — all in three languages: English, Turkish, Russian.

**Core change:** `/` becomes a language-detection redirect. All public pages live under `/[lang]/`.

---

## 2. URL Structure

```
taxsi.cy/                         → redirect to /en/ (or detected browser language)
taxsi.cy/en/                      → English marketing homepage
taxsi.cy/tr/                      → Turkish marketing homepage
taxsi.cy/ru/                      → Russian marketing homepage

/[lang]/book                      → Booking form (moved from /)
/[lang]/routes                    → Routes & Prices
/[lang]/about                     → About Us
/[lang]/contact                   → Contact
/[lang]/blog                      → Blog index
/[lang]/blog/[slug]               → Blog post (MDX)
/[lang]/faq                       → FAQ
/[lang]/privacy                   → Privacy Policy
/[lang]/terms                     → Terms of Use

/confirm/[ref]                    → language-agnostic (unchanged)
/track/[ref]                      → language-agnostic (unchanged)
/admin/*                          → language-agnostic (unchanged)
/driver/*                         → language-agnostic (unchanged)
```

**Supported locales:** `en` (default), `tr`, `ru`

---

## 3. i18n Architecture

**Library:** `next-intl` — the standard Next.js App Router i18n library.

**Translation files:**
```
messages/
  en.json
  tr.json
  ru.json
```

All UI strings (nav, buttons, page copy, form labels) live in translation files. Blog posts are separate MDX files per locale (see §8).

**Routing:** `next-intl` middleware handles locale detection and redirects from `/` to `/[lang]/`. The `[lang]` segment is a Next.js dynamic segment at the top of the App Router tree.

**App Router layout:**
```
app/
  [lang]/
    layout.tsx            ← locale provider + customer header/footer
    page.tsx              ← marketing homepage
    book/
      page.tsx            ← booking form (moved)
    routes/
      page.tsx
    about/
      page.tsx
    contact/
      page.tsx
    blog/
      page.tsx            ← blog index
      [slug]/
        page.tsx          ← individual post
    faq/
      page.tsx
    privacy/
      page.tsx
    terms/
      page.tsx
  (customer)/             ← existing route group, keep confirm + track
    confirm/[ref]/page.tsx
    track/[ref]/page.tsx
    track/page.tsx
  (admin)/                ← unchanged
  (driver)/               ← unchanged
  page.tsx                ← root redirect to /en/
```

---

## 4. Customer Layout Update

The existing `app/(customer)/layout.tsx` header is updated to include the new nav links and a language switcher. The language switcher is a minimal `EN | TR | RU` toggle that swaps the `[lang]` prefix while preserving the current path.

**Nav links (desktop):**
- Book Transfer → `/[lang]/book`
- Routes & Prices → `/[lang]/routes`
- Track Booking → `/[lang]/track`
- Blog → `/[lang]/blog`
- About → `/[lang]/about`
- Contact → `/[lang]/contact`

**Mobile:** hamburger menu with same links.

---

## 5. Marketing Homepage (`/[lang]/`)

Sections, top to bottom:

### 5.1 Hero
- Full-width dark background (night color)
- Headline + subheadline (translated)
- Mini booking widget: pickup dropdown, dropoff dropdown, date, passenger count → "Book Now" submits to `/[lang]/book` with query params pre-filled
- No auth required

### 5.2 Why Taxsi
- 4 icon cards: Fixed Price, Professional Drivers, 24/7 Available, Instant Confirmation

### 5.3 Popular Routes
- Grid of 4–6 route cards showing: route name, price, "Book →" link
- Routes fetched from mock/API (same source as booking form)
- "See all routes →" link to `/[lang]/routes`

### 5.4 How It Works
- 3-step horizontal timeline: Book → Driver Assigned → Transfer Complete

### 5.5 CTA Banner
- "Book Your Transfer Now" button → `/[lang]/book`

### 5.6 Footer
- Links: Routes, About, Contact, Blog, FAQ, Privacy, Terms
- Language switcher
- Phone number
- © year Taxsi

---

## 6. Routes & Prices (`/[lang]/routes`)

- Full table of all active routes with base price and round-trip price
- Routes fetched from API/mock
- Each row has "Book This Route →" link that pre-fills pickup/dropoff on the booking form
- SEO: structured data (`ItemList` schema for routes)

---

## 7. About (`/[lang]/about`)

Static content page. Sections:
- Company story (translated)
- Mission statement
- Team / values
- CTA to book

Content is hardcoded in translation files (no MDX needed, it's short).

---

## 8. Contact (`/[lang]/contact`)

- Phone number (click to call)
- Email address (click to mailto)
- WhatsApp link
- Simple contact form: name, email, message → sends to a configured email address via a `/api/contact` API route (uses the existing SendGrid config)
- No backend persistence needed — just fires an email

---

## 9. Blog

### 9.1 Content storage
```
content/blog/
  en/
    cyprus-airport-guide.mdx
    larnaca-vs-paphos.mdx
  tr/
    kibris-havalimani-rehberi.mdx
  ru/
    aeroporty-kipra.mdx
```

Each MDX file has frontmatter:
```yaml
---
title: "Cyprus Airport Transfer Guide"
description: "Everything you need to know about getting from the airport"
date: "2026-05-01"
slug: "cyprus-airport-guide"
---
```

### 9.2 Blog Index (`/[lang]/blog`)
- Grid of post cards: title, description, date, "Read →"
- Only shows posts that exist for the current locale
- If a post has no translation for the current locale, it is omitted (no fallback shown)

### 9.3 Blog Post (`/[lang]/blog/[slug]`)
- Rendered MDX with prose styling
- Title, date, estimated read time
- "Back to Blog" link
- CTA at bottom: "Need a transfer? Book now →"
- SEO: `Article` schema, canonical URL, Open Graph

---

## 10. FAQ (`/[lang]/faq`)

Static accordion list. Questions and answers live in translation files. Sections:
- Booking (how to book, cancellation, modification)
- Payment (cash vs online, what's included)
- On the day (what to expect, driver contact, tracking)
- Vehicles (capacity, luggage, VIP)

No backend interaction.

---

## 11. Privacy Policy (`/[lang]/privacy`)

Static legal page. Content in translation files. Covers:
- Data collected (name, email, phone, passport number)
- Purpose of collection
- Third-party services (Stripe, SendGrid, Twilio)
- Cookie usage
- Contact for data requests

---

## 12. Terms of Use (`/[lang]/terms`)

Static legal page. Content in translation files. Covers:
- Service description
- Booking and cancellation policy
- Payment terms
- Liability limitations
- Governing law (Cyprus)

---

## 13. SEO

- Every page exports `generateMetadata` with locale-aware title, description, and canonical URL
- `hreflang` alternate links on every page pointing to `/en/`, `/tr/`, `/ru/` equivalents
- `app/sitemap.ts` updated to include all marketing pages in all 3 locales
- `app/robots.ts` unchanged

---

## 14. Existing Pages — Migration

| Old URL | New URL | Action |
|---|---|---|
| `/` | `/[lang]/book` | Booking form moved; `/` becomes redirect |
| `/confirm/[ref]` | `/confirm/[ref]` | Unchanged |
| `/track/[ref]` | `/track/[ref]` | Unchanged |
| `/track` | `/track` | Unchanged |

The `app/(customer)/` route group keeps `confirm` and `track`. The booking form page moves to `app/[lang]/book/page.tsx`. The `app/(customer)/page.tsx` is deleted.

---

## 15. Out of Scope

- Customer reviews / testimonials section (can add later)
- Fleet / vehicle gallery page (can add later)
- Airport-specific SEO landing pages (can add later)
- Blog post comments
- Blog RSS feed
- Multi-language blog post cross-linking (posts exist per locale independently)
