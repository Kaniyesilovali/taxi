# Backend Binding Audit

**Date:** 2026-05-03
**Scope:** Customer-facing API client (`lib/api*`), env-var contract, mock toggle.
**Outcome:** Documents the current state. No code rewrites — only a refreshed
`.env.local.example`. Follow-up tickets called out below.

## What's wired today

- **Customer portal** (`lib/api/{routes,extras,bookings}.ts`) reads
  `NEXT_PUBLIC_USE_MOCK`. When `true`, each call returns a fixture from
  `lib/mock/*`; when `false`, it routes through the wrapper in `lib/api.ts`,
  which uses `NEXT_PUBLIC_API_URL` (default `http://localhost:3001/api/v1`).
- **Admin panel** (`lib/api/auth.ts`, `lib/api/client.ts`) reads
  `NEXT_PUBLIC_API_MOCK`. When `true`, it short-circuits to mocks; when
  `false`, it goes through `apiFetch`, which uses `NEXT_PUBLIC_API_BASE_URL`
  (default `http://localhost:4000/api/v1`) and attaches the admin JWT.
- Mock fixtures live in `lib/mock/{routes,extras}.ts`. Bookings, confirms,
  and tracking are simulated inline inside `lib/api/bookings.ts` (no
  separate fixture file).

## Verified behaviour

- `NEXT_PUBLIC_USE_MOCK=true npm run build` — passes; all 38 routes are
  statically generated using fixtures.
- `NEXT_PUBLIC_USE_MOCK=false npm run build` — fails with `ECONNREFUSED`
  during static prerender because the home page and `/[lang]/book` call
  `getRoutes()` at build time.
- `npm run lint` — 0 errors, 2 warnings (pre-existing
  `react-hooks/incompatible-library` on react-hook-form's `watch()`).
- `npm test` — 18 customer-side tests pass.

## Known gaps

### G1 — Two env-var names for the same backend

`NEXT_PUBLIC_API_URL` (customer) and `NEXT_PUBLIC_API_BASE_URL` (admin)
default to different ports (3001 vs 4000). Setting one without the other
silently splits the app across two URLs. **Fix proposal:** consolidate to
`NEXT_PUBLIC_API_URL`, keep `_BASE_URL` as a deprecated alias for one
release.

### G2 — Two mock toggles

`NEXT_PUBLIC_USE_MOCK` (customer) and `NEXT_PUBLIC_API_MOCK` (admin) must
both be set or both unset. **Fix proposal:** rename customer flag to
`NEXT_PUBLIC_API_MOCK`, treat `NEXT_PUBLIC_USE_MOCK` as a fallback for one
release.

### G3 — Static prerender depends on a live backend

Without the mock flag, `next build` requires the backend to be reachable
at build time so home + `/[lang]/book` can pre-fetch routes. Production
typically wants:
- **ISR**: `export const revalidate = 3600` on the home page so routes
  refresh hourly without rebuilding, OR
- **Force dynamic**: `export const dynamic = 'force-dynamic'` so each
  request re-fetches.

This is intentionally not changed here — the deployment target dictates
the right answer.

### G4 — Booking fixtures live inline

`lib/api/bookings.ts` simulates create / confirm / track responses inline.
Future fixtures should move to `lib/mock/bookings.ts` to match the
routes / extras pattern.

### G5 — Admin client tests reference `Response`

`lib/api/__tests__/client.test.ts` (untracked at audit time) constructs
`new Response(...)` which is undefined under `jsdom`. Either polyfill via
`jest.environment.ts` or move admin tests to `node` testEnvironment.

## What changed

- `.env.local.example` rewritten with clear sections for customer / admin
  toggles, backend URLs, Trustpilot business ID, and a server-only-vars
  warning.

## Recommended follow-up order

1. G2 (mock-flag rename) — single env var prevents silent disagreement.
2. G1 (URL-var rename) — same backend, same env var.
3. G3 (static rendering policy) — picked once a deploy target is chosen.
4. G4, G5 — cleanup, low priority.
