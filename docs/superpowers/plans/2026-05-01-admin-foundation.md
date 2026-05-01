# Admin Panel — Plan A: Foundation & Auth

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the foundation for the Taxsi admin panel — admin theme, mock-mode API layer, JWT-cookie middleware, admin layout shell, and a working `/admin/login` → `/admin/dashboard` flow. After this plan, an admin can log in with mock credentials and see an empty (but real) admin shell with sidebar nav.

**Architecture:** Next.js 16 App Router with a `(admin)` route group. shadcn/ui installed scoped to admin via `[data-admin]` CSS attribute (customer portal's hand-rolled components untouched). Mock-mode API layer driven by `NEXT_PUBLIC_API_MOCK=true` — every API module dispatches to either `lib/api/*` (real fetch) or `lib/mock/*` (in-memory). Auth uses an `admin_token` cookie checked by `middleware.ts`. TanStack Query manages server state with `QueryProvider` wrapping the admin route group.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind v4 (CSS-first config), shadcn/ui (new-york style), TanStack Query v5, react-hook-form + zod (already installed), sonner for toasts, lucide-react for icons (already installed), Jest + Testing Library.

**Spec:** [`docs/superpowers/specs/2026-04-30-admin-panel-design.md`](../specs/2026-04-30-admin-panel-design.md)

**Out of scope for this plan (covered in Plan B/C):**
- Bookings, Routes, Extras, Drivers, Payouts, Revenue pages and their components
- Real driver-summary, payouts-calculation, revenue-stats logic
- The dashboard page is an empty placeholder here — actual stat cards and recent-bookings table come in Plan B

---

## File Structure

**New files:**
- `frontend/components.json` — shadcn config
- `frontend/components/admin/ui/button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `sonner.tsx`, `dropdown-menu.tsx` — shadcn primitives (admin-scoped)
- `frontend/components/admin/layout/admin-layout.tsx`, `admin-sidebar.tsx`, `admin-topbar.tsx`
- `frontend/components/admin/providers/query-provider.tsx`
- `frontend/components/admin/providers/admin-providers.tsx` — wraps QueryProvider + Toaster
- `frontend/lib/types/admin.ts` — all types from spec §8
- `frontend/lib/api/client.ts` — base fetch wrapper
- `frontend/lib/api/auth.ts`, `frontend/lib/mock/auth.ts`
- `frontend/lib/mock/sleep.ts` — shared mock delay helper
- `frontend/lib/mock/store.ts` — in-memory mock data store (drivers, bookings, etc — populated incrementally across plans)
- `frontend/lib/auth/cookies.ts` — typed cookie helpers (reads `admin_token`)
- `frontend/lib/auth/jwt.ts` — minimal JWT decode (mock-mode only; production uses backend-issued JWTs we don't need to decode client-side)
- `frontend/middleware.ts` — JWT cookie check, redirect to `/admin/login`
- `frontend/app/(admin)/layout.tsx` — wraps admin pages with `<AdminProviders>` + theme attribute
- `frontend/app/(admin)/admin/login/page.tsx`
- `frontend/app/(admin)/admin/dashboard/page.tsx` — placeholder
- `frontend/.env.local.example` — documents `NEXT_PUBLIC_API_MOCK` and `NEXT_PUBLIC_API_BASE_URL`

**Modified files:**
- `frontend/app/globals.css` — adds `[data-admin]` scoped CSS variables for the night/gold dark theme
- `frontend/package.json` — new dependencies
- `frontend/tsconfig.json` — verify `@/` path alias is present (it should already be)

**Test files:**
- `frontend/lib/api/__tests__/client.test.ts`
- `frontend/lib/auth/__tests__/jwt.test.ts`
- `frontend/lib/auth/__tests__/cookies.test.ts`
- `frontend/lib/mock/__tests__/auth.test.ts`
- `frontend/__tests__/middleware.test.ts`
- `frontend/app/(admin)/admin/login/__tests__/login.test.tsx`

---

## Task 1: Read Next.js 16 docs, then install dependencies

**Why:** AGENTS.md warns the project's Next.js may differ from training data. Read the relevant docs before adding code that depends on Next 16 specifics (middleware, route groups, server actions).

**Files:**
- Modify: `frontend/package.json`

- [ ] **Step 1: Read Next 16 middleware + routing docs**

Run:
```bash
ls frontend/node_modules/next/dist/docs/ 2>/dev/null || find frontend/node_modules/next -name "*.md" -path "*docs*" | head
```

Read the middleware, route-groups, and app-router docs. Note any API differences from the patterns in this plan. If any Next 16 API differs from what this plan assumes, **stop and update the plan**.

- [ ] **Step 2: Install runtime deps**

Run from `frontend/`:
```bash
npm install @tanstack/react-query@^5 sonner@^1 date-fns@^4
```

Expected: package.json updated, no peer-dep warnings.

- [ ] **Step 3: Install dev deps for shadcn**

shadcn primitives use Radix; the CLI installs them. We don't need anything extra here — Step 4 (shadcn init) handles it.

- [ ] **Step 4: Commit**

```bash
git add frontend/package.json frontend/package-lock.json
git commit -m "chore: add tanstack-query, sonner, date-fns for admin panel"
```

---

## Task 2: Init shadcn/ui scoped to admin

**Files:**
- Create: `frontend/components.json`
- Create: `frontend/components/admin/ui/button.tsx`, `input.tsx`, `label.tsx`, `card.tsx`, `sonner.tsx`, `dropdown-menu.tsx`
- Modify: `frontend/lib/cn.ts` (verify it works with shadcn's expectation)

**Note on isolation:** Customer portal already has its own `components/ui/button.tsx`. To prevent collision, configure shadcn to write into `components/admin/ui/` via `components.json`'s `aliases.ui` field.

- [ ] **Step 1: Verify Tailwind v4 + shadcn compatibility**

shadcn supports Tailwind v4 since CLI v2.4. Check the version we'll get:
```bash
npx shadcn@latest --version
```

If older than 2.4, pin a newer version: `npx shadcn@2.4.0 init`.

- [ ] **Step 2: Create `components.json` manually**

Skip the interactive `init` and write the config directly to avoid CLI overwriting `globals.css`:

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components/admin",
    "utils": "@/lib/cn",
    "ui": "@/components/admin/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

- [ ] **Step 3: Add shadcn primitives needed for Plan A**

Run from `frontend/`:
```bash
npx shadcn@latest add button input label card sonner dropdown-menu
```

Expected: files created under `components/admin/ui/`. The CLI may want to add CSS vars to `globals.css`; if it overwrites the customer theme, undo with `git checkout app/globals.css` and we'll add admin-scoped vars manually in Task 3.

- [ ] **Step 4: Verify build still works**

Run from `frontend/`:
```bash
npm run lint && npx tsc --noEmit
```

Expected: no errors. (Tailwind v4 with shadcn requires no config file — the CSS variables in globals.css are enough.)

- [ ] **Step 5: Commit**

```bash
git add frontend/components.json frontend/components/admin/ui/ frontend/package.json frontend/package-lock.json frontend/lib/cn.ts
git commit -m "feat(admin): scaffold shadcn/ui under components/admin/ui"
```

---

## Task 3: Admin theme CSS scoped to `[data-admin]`

**Why:** Customer portal already uses sand/cream/ink. Admin needs dark night-blue + gold. We scope the dark theme so it only applies inside `<div data-admin>`.

**Files:**
- Modify: `frontend/app/globals.css`

- [ ] **Step 1: Append admin theme to globals.css**

After the existing `@theme inline { ... }` block, append:

```css
/* Admin panel — dark theme scoped to [data-admin] subtree.
 * shadcn primitives consume these via Tailwind v4 @theme tokens
 * resolved against `data-admin` ancestor. */
[data-admin] {
  --background: #0c1a2e;
  --foreground: #ffffff;
  --card: #0a1628;
  --card-foreground: #ffffff;
  --popover: #0a1628;
  --popover-foreground: #ffffff;
  --primary: #c8922a;
  --primary-foreground: #0c1a2e;
  --secondary: #1e3a5f;
  --secondary-foreground: #ffffff;
  --muted: #091424;
  --muted-foreground: #6b8db3;
  --accent: #1e3a5f;
  --accent-foreground: #ffffff;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: #1e3a5f;
  --input: #1e3a5f;
  --ring: #c8922a;
  --radius: 0.5rem;
  color-scheme: dark;
  background-color: var(--background);
  color: var(--foreground);
}
```

- [ ] **Step 2: Manual verification**

We'll fully verify after Task 10 when the layout renders. For now:
```bash
cd frontend && npm run dev
```
Open `http://localhost:3000/` — customer portal must look unchanged. Stop dev server.

- [ ] **Step 3: Commit**

```bash
git add frontend/app/globals.css
git commit -m "feat(admin): add night/gold dark theme scoped to [data-admin]"
```

---

## Task 4: Admin types file

**Files:**
- Create: `frontend/lib/types/admin.ts`

- [ ] **Step 1: Write `frontend/lib/types/admin.ts`**

Copy the full type set from spec §8. Plan A only consumes `Driver`, `BookingStatus`, etc transitively, but we land all types now so subsequent tasks reference a stable file.

```ts
// All types come from spec §8 — keep this file in sync with the spec.

export type BookingStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentType = 'cash' | 'online'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type DriverStatus = 'active' | 'inactive'
export type PaymentMethod = 'bank_transfer' | 'cash' | 'other'

export interface Booking {
  id: string
  bookingRef: string
  customerName: string
  customerSurname: string
  customerEmail: string
  customerPhone: string
  customerIdPassport: string | null
  routeId: string
  route: Route
  isRoundTrip: boolean
  date: string
  time: string
  passengerCount: number
  luggageCount: number
  isVip: boolean
  notes: string | null
  paymentType: PaymentType
  paymentStatus: PaymentStatus
  baseAmount: number
  extrasAmount: number
  totalAmount: number
  commissionRate: number
  commissionAmount: number
  driverAmount: number
  status: BookingStatus
  driverId: string | null
  driver: Driver | null
  vehicleInfo: string | null
  googleMapsLink: string | null
  extras: BookingExtra[]
  assignedAt: string | null
  completedAt: string | null
  payoutId: string | null
  isPaidToDriver: boolean
  createdAt: string
  updatedAt: string
}

export interface BookingExtra {
  id: string
  extraId: string
  extra: Extra
  quantity: number
  unitPrice: number
}

export interface Route {
  id: string
  name: string
  pickupLocation: string
  dropoffLocation: string
  basePrice: number
  roundTripPrice: number
  isActive: boolean
  createdAt: string
}

export interface Extra {
  id: string
  name: string
  price: number
  isActive: boolean
}

export interface Driver {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  iban: string | null
  bankName: string | null
  status: DriverStatus
  pendingPayoutAmount: number
  createdAt: string
}

export interface DriverMonthlySummary {
  driver: Driver
  month: string
  completedBookingCount: number
  earnedAmount: number
  paidAmount: number
  pendingAmount: number
  bookings: Booking[]
}

export interface DriverPayout {
  id: string
  driverId: string
  driver: Driver
  periodStart: string
  periodEnd: string
  amount: number
  note: string | null
  paymentMethod: PaymentMethod
  ibanSnapshot: string | null
  bankNameSnapshot: string | null
  bookingIds: string[]
  bookings: Booking[]
  paidAt: string
  createdBy: string
  createdAt: string
}

export interface PayoutCalculation {
  driverId: string
  periodStart: string
  periodEnd: string
  bookings: Booking[]
  suggestedAmount: number
  bookingCount: number
}

export interface CreatePayoutBody {
  driverId: string
  periodStart: string
  periodEnd: string
  amount: number
  bookingIds: string[]
  note?: string
  paymentMethod: PaymentMethod
}

export interface PayoutFilters {
  driverId?: string
  from?: string
  to?: string
  page?: number
}

export interface DailyStat {
  date: string
  online: number
  cash: number
  total: number
}

export interface RevenueStats {
  totalRevenue: number
  commission: number
  driverPayout: number
  onlineRevenue: number
  cashRevenue: number
  bookingCount: number
  daily: DailyStat[]
}

export interface BookingFilters {
  status?: BookingStatus[]
  from?: string
  to?: string
  paymentType?: PaymentType
  driverId?: string
  search?: string
  page?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}

export interface AssignDriverBody {
  driverId: string
  vehicleInfo: string
}

export type RouteBody = Omit<Route, 'id' | 'createdAt'>
export type ExtraBody = Omit<Extra, 'id'>
export type DriverBody = Omit<Driver, 'id' | 'createdAt' | 'pendingPayoutAmount'> & { password?: string }
export interface RevenueFilters { from: string; to: string; paymentType?: PaymentType }

export interface AdminUser {
  id: string
  email: string
  name: string
}

export interface LoginBody {
  email: string
  password: string
}

export interface LoginResponse {
  user: AdminUser
  accessToken: string
  refreshToken: string
}
```

- [ ] **Step 2: Verify typecheck**

Run from `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Commit**

```bash
git add frontend/lib/types/admin.ts
git commit -m "feat(admin): add shared TypeScript types from spec §8"
```

---

## Task 5: Cookie + JWT helpers

**Files:**
- Create: `frontend/lib/auth/cookies.ts`
- Create: `frontend/lib/auth/jwt.ts`
- Test: `frontend/lib/auth/__tests__/cookies.test.ts`
- Test: `frontend/lib/auth/__tests__/jwt.test.ts`

**Why:** Mock-mode auth needs a way to set/read cookies from client code (real production flow uses httpOnly cookies set server-side, which client can't read but middleware/server components can). We isolate this so client uses the same cookie name in both modes.

- [ ] **Step 1: Write failing test for `decodeJwt`**

`frontend/lib/auth/__tests__/jwt.test.ts`:
```ts
import { decodeJwt, isJwtExpired } from '../jwt'

describe('decodeJwt', () => {
  it('decodes a payload from a valid 3-part token', () => {
    // header.{"sub":"u1","exp":9999999999}.signature — base64url
    const payload = Buffer.from(JSON.stringify({ sub: 'u1', exp: 9999999999 })).toString('base64url')
    const token = `aGVhZGVy.${payload}.c2ln`
    expect(decodeJwt(token)).toEqual({ sub: 'u1', exp: 9999999999 })
  })

  it('returns null for malformed tokens', () => {
    expect(decodeJwt('not.a.jwt.too.many.parts')).toBeNull()
    expect(decodeJwt('only.two')).toBeNull()
    expect(decodeJwt('')).toBeNull()
  })
})

describe('isJwtExpired', () => {
  it('returns true when exp is in the past', () => {
    const past = Math.floor(Date.now() / 1000) - 60
    const payload = Buffer.from(JSON.stringify({ exp: past })).toString('base64url')
    const token = `h.${payload}.s`
    expect(isJwtExpired(token)).toBe(true)
  })

  it('returns false when exp is in the future', () => {
    const future = Math.floor(Date.now() / 1000) + 3600
    const payload = Buffer.from(JSON.stringify({ exp: future })).toString('base64url')
    const token = `h.${payload}.s`
    expect(isJwtExpired(token)).toBe(false)
  })

  it('returns true for malformed tokens', () => {
    expect(isJwtExpired('garbage')).toBe(true)
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd frontend && npx jest lib/auth/__tests__/jwt.test.ts`
Expected: FAIL with "Cannot find module '../jwt'".

- [ ] **Step 3: Implement `frontend/lib/auth/jwt.ts`**

```ts
export interface JwtPayload {
  sub: string
  exp: number
  [key: string]: unknown
}

export function decodeJwt(token: string): JwtPayload | null {
  if (!token) return null
  const parts = token.split('.')
  if (parts.length !== 3) return null
  try {
    const json = atob(parts[1].replace(/-/g, '+').replace(/_/g, '/'))
    const payload = JSON.parse(json) as JwtPayload
    if (typeof payload.exp !== 'number') return null
    return payload
  } catch {
    return null
  }
}

export function isJwtExpired(token: string): boolean {
  const payload = decodeJwt(token)
  if (!payload) return true
  return payload.exp * 1000 < Date.now()
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `cd frontend && npx jest lib/auth/__tests__/jwt.test.ts`
Expected: 5 passed.

- [ ] **Step 5: Write failing test for cookies helper**

`frontend/lib/auth/__tests__/cookies.test.ts`:
```ts
/**
 * @jest-environment jsdom
 */
import { setAdminToken, getAdminToken, clearAdminToken, ADMIN_TOKEN_COOKIE } from '../cookies'

describe('admin token cookies', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
  })

  it('sets and reads the admin_token cookie', () => {
    setAdminToken('abc.def.ghi')
    expect(getAdminToken()).toBe('abc.def.ghi')
  })

  it('clears the cookie', () => {
    setAdminToken('abc.def.ghi')
    clearAdminToken()
    expect(getAdminToken()).toBeNull()
  })

  it('returns null when cookie is absent', () => {
    expect(getAdminToken()).toBeNull()
  })

  it('exposes the cookie name', () => {
    expect(ADMIN_TOKEN_COOKIE).toBe('admin_token')
  })
})
```

- [ ] **Step 6: Run tests, verify they fail**

Run: `cd frontend && npx jest lib/auth/__tests__/cookies.test.ts`
Expected: FAIL with "Cannot find module '../cookies'".

- [ ] **Step 7: Implement `frontend/lib/auth/cookies.ts`**

```ts
export const ADMIN_TOKEN_COOKIE = 'admin_token'

export function setAdminToken(token: string): void {
  if (typeof document === 'undefined') return
  // 7-day cookie; mock mode only — real prod cookie is httpOnly server-set.
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toUTCString()
  document.cookie = `${ADMIN_TOKEN_COOKIE}=${token};path=/;expires=${expires};SameSite=Lax`
}

export function getAdminToken(): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp(`(?:^|; )${ADMIN_TOKEN_COOKIE}=([^;]+)`))
  return match ? decodeURIComponent(match[1]) : null
}

export function clearAdminToken(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${ADMIN_TOKEN_COOKIE}=;path=/;expires=${new Date(0).toUTCString()};SameSite=Lax`
}
```

- [ ] **Step 8: Run tests, verify they pass**

Run: `cd frontend && npx jest lib/auth/__tests__/cookies.test.ts`
Expected: 4 passed.

- [ ] **Step 9: Commit**

```bash
git add frontend/lib/auth/
git commit -m "feat(admin): add JWT decode + admin_token cookie helpers"
```

---

## Task 6: Mock infrastructure (sleep + store)

**Files:**
- Create: `frontend/lib/mock/sleep.ts`
- Create: `frontend/lib/mock/store.ts`

- [ ] **Step 1: Write `frontend/lib/mock/sleep.ts`**

```ts
export function sleep(ms = 300): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export const MOCK_DELAY_MS = 300
```

- [ ] **Step 2: Write `frontend/lib/mock/store.ts`**

```ts
import type { AdminUser, Booking, Driver, DriverPayout, Extra, Route } from '@/lib/types/admin'

// In-memory mutable store. Lives for the duration of a single page load (client) or process
// (during SSR). Subsequent plans (B, C) seed and mutate these arrays.
//
// Each plan extends this file rather than scattering mocks. Plan A seeds only the admin user
// and an empty driver/booking/route/extra/payout list — Plan B & C populate the rest.
export const mockStore = {
  adminUser: {
    id: 'admin-1',
    email: 'admin@taxsi.test',
    name: 'Test Admin',
  } satisfies AdminUser,
  adminPassword: 'admin123', // mock-mode only
  drivers: [] as Driver[],
  bookings: [] as Booking[],
  routes: [] as Route[],
  extras: [] as Extra[],
  payouts: [] as DriverPayout[],
}
```

- [ ] **Step 3: Verify typecheck**

Run from `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/lib/mock/sleep.ts frontend/lib/mock/store.ts
git commit -m "feat(admin): add mock store + sleep helper"
```

---

## Task 7: Auth API + mock

**Files:**
- Create: `frontend/lib/api/auth.ts`
- Create: `frontend/lib/mock/auth.ts`
- Test: `frontend/lib/mock/__tests__/auth.test.ts`

- [ ] **Step 1: Write failing test for mock auth**

`frontend/lib/mock/__tests__/auth.test.ts`:
```ts
/**
 * @jest-environment jsdom
 */
import { mockLogin, mockLogout, mockGetMe } from '../auth'

describe('mock auth', () => {
  beforeEach(() => {
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
  })

  it('logs in with valid credentials and sets cookie', async () => {
    const res = await mockLogin({ email: 'admin@taxsi.test', password: 'admin123' })
    expect(res.user.email).toBe('admin@taxsi.test')
    expect(res.accessToken).toMatch(/^[\w-]+\.[\w-]+\.[\w-]+$/)
    expect(document.cookie).toContain('admin_token=')
  })

  it('rejects invalid credentials', async () => {
    await expect(mockLogin({ email: 'admin@taxsi.test', password: 'wrong' })).rejects.toThrow(/invalid/i)
  })

  it('logout clears the cookie', async () => {
    await mockLogin({ email: 'admin@taxsi.test', password: 'admin123' })
    await mockLogout()
    expect(document.cookie).not.toContain('admin_token=eyJ')
  })

  it('getMe returns the user when token is valid', async () => {
    await mockLogin({ email: 'admin@taxsi.test', password: 'admin123' })
    const user = await mockGetMe()
    expect(user.email).toBe('admin@taxsi.test')
  })

  it('getMe throws when no token', async () => {
    await expect(mockGetMe()).rejects.toThrow(/unauthor/i)
  })
})
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `cd frontend && npx jest lib/mock/__tests__/auth.test.ts`
Expected: FAIL ("Cannot find module '../auth'").

- [ ] **Step 3: Implement `frontend/lib/mock/auth.ts`**

```ts
import { sleep } from './sleep'
import { mockStore } from './store'
import { setAdminToken, clearAdminToken, getAdminToken } from '@/lib/auth/cookies'
import type { AdminUser, LoginBody, LoginResponse } from '@/lib/types/admin'

function mintMockJwt(sub: string): string {
  const header = btoa(JSON.stringify({ alg: 'none', typ: 'JWT' })).replace(/=/g, '')
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 // 7 days
  const payload = btoa(JSON.stringify({ sub, exp })).replace(/=/g, '')
  return `${header}.${payload}.mock-signature`
}

export async function mockLogin(body: LoginBody): Promise<LoginResponse> {
  await sleep()
  if (body.email !== mockStore.adminUser.email || body.password !== mockStore.adminPassword) {
    throw new Error('Invalid credentials')
  }
  const accessToken = mintMockJwt(mockStore.adminUser.id)
  const refreshToken = mintMockJwt(mockStore.adminUser.id)
  setAdminToken(accessToken)
  return { user: mockStore.adminUser, accessToken, refreshToken }
}

export async function mockLogout(): Promise<void> {
  await sleep(100)
  clearAdminToken()
}

export async function mockGetMe(): Promise<AdminUser> {
  await sleep(100)
  if (!getAdminToken()) throw new Error('Unauthorized')
  return mockStore.adminUser
}
```

- [ ] **Step 4: Run tests, verify they pass**

Run: `cd frontend && npx jest lib/mock/__tests__/auth.test.ts`
Expected: 5 passed.

- [ ] **Step 5: Implement `frontend/lib/api/auth.ts` (real + mock dispatch)**

```ts
import type { AdminUser, LoginBody, LoginResponse } from '@/lib/types/admin'
import { apiFetch } from './client'
import { mockLogin, mockLogout, mockGetMe } from '@/lib/mock/auth'

const USE_MOCK = process.env.NEXT_PUBLIC_API_MOCK === 'true'

export function login(body: LoginBody): Promise<LoginResponse> {
  if (USE_MOCK) return mockLogin(body)
  return apiFetch<LoginResponse>('/auth/admin/login', { method: 'POST', body: JSON.stringify(body) })
}

export function logout(): Promise<void> {
  if (USE_MOCK) return mockLogout()
  return apiFetch<void>('/auth/admin/logout', { method: 'POST' })
}

export function getMe(): Promise<AdminUser> {
  if (USE_MOCK) return mockGetMe()
  return apiFetch<AdminUser>('/auth/admin/me')
}
```

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/api/auth.ts frontend/lib/mock/auth.ts frontend/lib/mock/__tests__/auth.test.ts
git commit -m "feat(admin): add auth API + mock with mintable JWT"
```

---

## Task 8: API client (`apiFetch`) with 401 handling

**Files:**
- Create: `frontend/lib/api/client.ts`
- Test: `frontend/lib/api/__tests__/client.test.ts`
- Create: `frontend/.env.local.example`

- [ ] **Step 1: Write `.env.local.example`**

```
NEXT_PUBLIC_API_MOCK=true
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api/v1
```

- [ ] **Step 2: Write failing test for `apiFetch`**

`frontend/lib/api/__tests__/client.test.ts`:
```ts
/**
 * @jest-environment jsdom
 */
import { apiFetch, ApiError } from '../client'

const originalFetch = global.fetch

beforeEach(() => {
  process.env.NEXT_PUBLIC_API_BASE_URL = 'http://api.test/v1'
})

afterEach(() => {
  global.fetch = originalFetch
})

describe('apiFetch', () => {
  it('attaches admin_token from cookie as bearer header', async () => {
    document.cookie = 'admin_token=tok-123;path=/'
    const fetchSpy = jest.fn(async () => new Response(JSON.stringify({ ok: true }), { status: 200 }))
    global.fetch = fetchSpy as unknown as typeof fetch
    await apiFetch('/foo')
    const init = fetchSpy.mock.calls[0][1] as RequestInit
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer tok-123')
  })

  it('throws ApiError on non-2xx', async () => {
    global.fetch = jest.fn(async () => new Response(JSON.stringify({ message: 'boom' }), { status: 500 })) as unknown as typeof fetch
    await expect(apiFetch('/foo')).rejects.toBeInstanceOf(ApiError)
  })

  it('clears cookie and throws on 401', async () => {
    document.cookie = 'admin_token=tok-123;path=/'
    global.fetch = jest.fn(async () => new Response('', { status: 401 })) as unknown as typeof fetch
    await expect(apiFetch('/foo')).rejects.toThrow(ApiError)
    expect(document.cookie).not.toContain('admin_token=tok')
  })

  it('returns parsed JSON on success', async () => {
    global.fetch = jest.fn(async () => new Response(JSON.stringify({ a: 1 }), { status: 200 })) as unknown as typeof fetch
    await expect(apiFetch<{ a: number }>('/foo')).resolves.toEqual({ a: 1 })
  })
})
```

- [ ] **Step 3: Run tests, verify they fail**

Run: `cd frontend && npx jest lib/api/__tests__/client.test.ts`
Expected: FAIL ("Cannot find module '../client'").

- [ ] **Step 4: Implement `frontend/lib/api/client.ts`**

```ts
import { ADMIN_TOKEN_COOKIE, clearAdminToken, getAdminToken } from '@/lib/auth/cookies'

export class ApiError extends Error {
  constructor(public readonly status: number, message: string, public readonly body?: unknown) {
    super(message)
    this.name = 'ApiError'
  }
}

interface FetchOptions extends Omit<RequestInit, 'body'> {
  body?: BodyInit | null
}

export async function apiFetch<T>(path: string, options: FetchOptions = {}): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
  const token = getAdminToken()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((options.headers as Record<string, string>) ?? {}),
  }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${baseUrl}${path}`, { ...options, headers, credentials: 'include' })

  if (res.status === 401) {
    clearAdminToken()
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    let body: unknown = undefined
    try { body = await res.json() } catch { /* ignore */ }
    const message = (body as { message?: string } | undefined)?.message ?? `Request failed: ${res.status}`
    throw new ApiError(res.status, message, body)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export const ADMIN_COOKIE_NAME = ADMIN_TOKEN_COOKIE
```

- [ ] **Step 5: Run tests, verify they pass**

Run: `cd frontend && npx jest lib/api/__tests__/client.test.ts`
Expected: 4 passed.

- [ ] **Step 6: Commit**

```bash
git add frontend/lib/api/client.ts frontend/lib/api/__tests__/client.test.ts frontend/.env.local.example
git commit -m "feat(admin): add apiFetch wrapper with bearer auth + 401 handling"
```

---

## Task 9: Middleware (JWT cookie check + redirects)

**Files:**
- Create: `frontend/middleware.ts`
- Test: `frontend/__tests__/middleware.test.ts`

- [ ] **Step 1: Confirm Next 16 middleware API**

Read `frontend/node_modules/next/dist/docs/`-ish content for "middleware". Key facts to verify:
- Middleware exports a default function `(request: NextRequest) => NextResponse | Response | undefined`
- `config.matcher` is supported
- `request.cookies.get('admin_token')` returns `{ value: string }` or `undefined`

If Next 16 has changed any of these, **stop and update Step 3**.

- [ ] **Step 2: Write failing test**

`frontend/__tests__/middleware.test.ts`:
```ts
/** Tests middleware purely as a unit — exercises NextRequest cookie + URL handling. */
import { middleware } from '../middleware'
import { NextRequest } from 'next/server'

function makeReq(url: string, cookies: Record<string, string> = {}): NextRequest {
  const req = new NextRequest(new URL(url, 'http://test.local'))
  for (const [k, v] of Object.entries(cookies)) req.cookies.set(k, v)
  return req
}

function validToken(): string {
  const exp = Math.floor(Date.now() / 1000) + 3600
  const payload = Buffer.from(JSON.stringify({ sub: 'u', exp })).toString('base64url')
  return `h.${payload}.s`
}

function expiredToken(): string {
  const exp = Math.floor(Date.now() / 1000) - 60
  const payload = Buffer.from(JSON.stringify({ sub: 'u', exp })).toString('base64url')
  return `h.${payload}.s`
}

describe('middleware', () => {
  it('allows /admin/login through unauthenticated', () => {
    const res = middleware(makeReq('/admin/login'))
    expect(res?.headers.get('location')).toBeNull()
  })

  it('redirects unauthenticated /admin/dashboard to /admin/login', () => {
    const res = middleware(makeReq('/admin/dashboard'))
    expect(res?.headers.get('location')).toContain('/admin/login')
  })

  it('redirects expired token to /admin/login', () => {
    const res = middleware(makeReq('/admin/dashboard', { admin_token: expiredToken() }))
    expect(res?.headers.get('location')).toContain('/admin/login')
  })

  it('allows valid token through to /admin/dashboard', () => {
    const res = middleware(makeReq('/admin/dashboard', { admin_token: validToken() }))
    expect(res?.headers.get('location')).toBeNull()
  })

  it('redirects authenticated /admin/login to /admin/dashboard', () => {
    const res = middleware(makeReq('/admin/login', { admin_token: validToken() }))
    expect(res?.headers.get('location')).toContain('/admin/dashboard')
  })
})
```

- [ ] **Step 3: Run tests, verify they fail**

Run: `cd frontend && npx jest __tests__/middleware.test.ts`
Expected: FAIL.

- [ ] **Step 4: Implement `frontend/middleware.ts`**

```ts
import { NextRequest, NextResponse } from 'next/server'
import { isJwtExpired } from '@/lib/auth/jwt'

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('admin_token')?.value
  const tokenValid = token != null && !isJwtExpired(token)
  const isLoginPage = pathname === '/admin/login'

  if (isLoginPage && tokenValid) {
    return NextResponse.redirect(new URL('/admin/dashboard', request.url))
  }
  if (!isLoginPage && !tokenValid) {
    const url = new URL('/admin/login', request.url)
    url.searchParams.set('next', pathname)
    return NextResponse.redirect(url)
  }
  return undefined
}

export const config = {
  matcher: ['/admin/:path*'],
}
```

- [ ] **Step 5: Run tests, verify they pass**

Run: `cd frontend && npx jest __tests__/middleware.test.ts`
Expected: 5 passed.

- [ ] **Step 6: Commit**

```bash
git add frontend/middleware.ts frontend/__tests__/middleware.test.ts
git commit -m "feat(admin): add JWT middleware with login/dashboard redirects"
```

---

## Task 10: Providers (TanStack Query + Toaster)

**Files:**
- Create: `frontend/components/admin/providers/query-provider.tsx`
- Create: `frontend/components/admin/providers/admin-providers.tsx`

- [ ] **Step 1: Write `query-provider.tsx`**

```tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function QueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

- [ ] **Step 2: Write `admin-providers.tsx`**

```tsx
'use client'

import type { ReactNode } from 'react'
import { Toaster } from '@/components/admin/ui/sonner'
import { QueryProvider } from './query-provider'

export function AdminProviders({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      {children}
      <Toaster richColors position="top-right" />
    </QueryProvider>
  )
}
```

- [ ] **Step 3: Typecheck**

Run from `frontend/`:
```bash
npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 4: Commit**

```bash
git add frontend/components/admin/providers/
git commit -m "feat(admin): add QueryProvider + AdminProviders wrapper"
```

---

## Task 11: Admin layout shell (sidebar + topbar)

**Files:**
- Create: `frontend/components/admin/layout/admin-sidebar.tsx`
- Create: `frontend/components/admin/layout/admin-topbar.tsx`
- Create: `frontend/components/admin/layout/admin-layout.tsx`
- Create: `frontend/app/(admin)/layout.tsx`

- [ ] **Step 1: Write `admin-sidebar.tsx`**

```tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Calendar,
  Map,
  Sparkles,
  Users,
  Wallet,
  TrendingUp,
  LogOut,
} from 'lucide-react'
import { logout } from '@/lib/api/auth'
import { cn } from '@/lib/cn'

const NAV = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
  { href: '/admin/routes', label: 'Routes', icon: Map },
  { href: '/admin/extras', label: 'Extras', icon: Sparkles },
  { href: '/admin/drivers', label: 'Drivers', icon: Users },
  { href: '/admin/payouts', label: 'Payouts', icon: Wallet },
  { href: '/admin/revenue', label: 'Revenue', icon: TrendingUp },
] as const

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  async function handleLogout() {
    try {
      await logout()
    } finally {
      router.push('/admin/login')
      router.refresh()
    }
  }

  return (
    <aside className="fixed inset-y-0 left-0 flex w-[220px] flex-col border-r border-[var(--border)] bg-[var(--card)]">
      <div className="flex h-16 items-center gap-2 border-b border-[var(--border)] px-5">
        <div className="text-xl font-semibold tracking-tight text-[var(--primary)]">Taxsi</div>
        <div className="text-xs uppercase tracking-widest text-[var(--muted-foreground)]">Admin</div>
      </div>
      <nav className="flex-1 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = pathname.startsWith(item.href)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                active
                  ? 'border-l-2 border-[var(--primary)] bg-[var(--accent)] text-[var(--primary)]'
                  : 'text-[var(--muted-foreground)] hover:bg-[var(--accent)] hover:text-[var(--foreground)]',
              )}
            >
              <Icon className="size-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>
      <button
        onClick={handleLogout}
        className="flex items-center gap-3 border-t border-[var(--border)] px-5 py-4 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
      >
        <LogOut className="size-4" />
        Logout
      </button>
    </aside>
  )
}
```

- [ ] **Step 2: Write `admin-topbar.tsx`**

```tsx
'use client'

import { format } from 'date-fns'
import type { ReactNode } from 'react'

export function AdminTopbar({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[var(--border)] bg-[var(--background)] px-8">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-4 text-sm text-[var(--muted-foreground)]">
        <span>{format(new Date(), 'PPP')}</span>
        <span className="flex items-center gap-2">
          <span className="size-2 rounded-full bg-emerald-500" />
          Online
        </span>
        {action}
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Write `admin-layout.tsx`**

```tsx
import type { ReactNode } from 'react'
import { AdminSidebar } from './admin-sidebar'

export function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div data-admin className="min-h-screen">
      <AdminSidebar />
      <main className="ml-[220px] min-h-screen">{children}</main>
    </div>
  )
}
```

- [ ] **Step 4: Write `frontend/app/(admin)/layout.tsx`**

```tsx
import type { ReactNode } from 'react'
import { AdminProviders } from '@/components/admin/providers/admin-providers'
import { AdminLayout } from '@/components/admin/layout/admin-layout'

export default function AdminRouteGroupLayout({ children }: { children: ReactNode }) {
  return (
    <AdminProviders>
      <AdminLayout>{children}</AdminLayout>
    </AdminProviders>
  )
}
```

- [ ] **Step 5: Typecheck + lint**

Run from `frontend/`:
```bash
npx tsc --noEmit && npm run lint
```
Expected: no errors.

- [ ] **Step 6: Commit**

```bash
git add frontend/components/admin/layout/ frontend/app/\(admin\)/layout.tsx
git commit -m "feat(admin): add sidebar + topbar + admin layout shell"
```

---

## Task 12: Empty dashboard placeholder

**Files:**
- Create: `frontend/app/(admin)/admin/dashboard/page.tsx`

- [ ] **Step 1: Write the placeholder**

```tsx
import { AdminTopbar } from '@/components/admin/layout/admin-topbar'

export default function DashboardPage() {
  return (
    <>
      <AdminTopbar title="Dashboard" />
      <div className="p-8">
        <p className="text-[var(--muted-foreground)]">
          Dashboard content lives in Plan B. For now this confirms the auth flow and layout work.
        </p>
      </div>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add frontend/app/\(admin\)/admin/dashboard/page.tsx
git commit -m "feat(admin): add dashboard placeholder page"
```

---

## Task 13: Login page with form

**Files:**
- Create: `frontend/app/(admin)/admin/login/page.tsx`
- Create: `frontend/components/admin/auth/login-form.tsx`
- Test: `frontend/app/(admin)/admin/login/__tests__/login.test.tsx`

**Note:** The login page is rendered via the `(admin)` route group layout. The layout includes the sidebar — but that looks wrong on the login page. Solution: the layout reads pathname server-side and conditionally skips `<AdminLayout>` on `/admin/login`. We do that here.

- [ ] **Step 1: Update `(admin)/layout.tsx` to skip the shell on login**

The layout is a server component. We can't read pathname there. Two options:
- (a) Wrap each page (dashboard, bookings, etc) in `<AdminLayout>` directly and have `(admin)/layout.tsx` only mount providers. Login page omits the shell.
- (b) Move `AdminLayout` into a client component that reads `usePathname()`.

We choose **(a)** — explicit, no client-side pathname inspection.

Replace `frontend/app/(admin)/layout.tsx` with:
```tsx
import type { ReactNode } from 'react'
import { AdminProviders } from '@/components/admin/providers/admin-providers'

export default function AdminRouteGroupLayout({ children }: { children: ReactNode }) {
  return <AdminProviders>{children}</AdminProviders>
}
```

Update `dashboard/page.tsx` to use `<AdminLayout>`:
```tsx
import { AdminLayout } from '@/components/admin/layout/admin-layout'
import { AdminTopbar } from '@/components/admin/layout/admin-topbar'

export default function DashboardPage() {
  return (
    <AdminLayout>
      <AdminTopbar title="Dashboard" />
      <div className="p-8">
        <p className="text-[var(--muted-foreground)]">
          Dashboard content lives in Plan B. For now this confirms the auth flow and layout work.
        </p>
      </div>
    </AdminLayout>
  )
}
```

- [ ] **Step 2: Write `login-form.tsx`**

```tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Button } from '@/components/admin/ui/button'
import { Input } from '@/components/admin/ui/input'
import { Label } from '@/components/admin/ui/label'
import { login } from '@/lib/api/auth'

const schema = z.object({
  email: z.string().email('Geçerli bir email girin'),
  password: z.string().min(1, 'Şifre zorunludur'),
})
type FormValues = z.infer<typeof schema>

export function LoginForm() {
  const router = useRouter()
  const params = useSearchParams()
  const [submitting, setSubmitting] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '' },
  })

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    try {
      await login(values)
      const next = params.get('next') ?? '/admin/dashboard'
      router.push(next)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" {...register('email')} />
        {errors.email && <p className="text-sm text-[var(--destructive)]">{errors.email.message}</p>}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Şifre</Label>
        <Input id="password" type="password" autoComplete="current-password" {...register('password')} />
        {errors.password && <p className="text-sm text-[var(--destructive)]">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? 'Giriş yapılıyor…' : 'Giriş yap'}
      </Button>
    </form>
  )
}
```

- [ ] **Step 3: Write `login/page.tsx`**

```tsx
import { Suspense } from 'react'
import { LoginForm } from '@/components/admin/auth/login-form'

export default function LoginPage() {
  return (
    <div data-admin className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-sm rounded-lg border border-[var(--border)] bg-[var(--card)] p-8 shadow-2xl">
          <div className="mb-8 text-center">
            <div className="text-2xl font-semibold tracking-tight text-[var(--primary)]">Taxsi</div>
            <div className="text-sm uppercase tracking-widest text-[var(--muted-foreground)]">Admin</div>
          </div>
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Write failing UI test**

`frontend/app/(admin)/admin/login/__tests__/login.test.tsx`:
```tsx
/**
 * @jest-environment jsdom
 */
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { LoginForm } from '@/components/admin/auth/login-form'

const push = jest.fn()
const refresh = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push, refresh }),
  useSearchParams: () => new URLSearchParams(),
}))

jest.mock('sonner', () => ({ toast: { error: jest.fn(), success: jest.fn() } }))

describe('LoginForm', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_API_MOCK = 'true'
    document.cookie.split(';').forEach((c) => {
      document.cookie = c.replace(/^ +/, '').replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`)
    })
    push.mockClear()
    refresh.mockClear()
  })

  it('shows validation errors when fields are empty', async () => {
    render(<LoginForm />)
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }))
    expect(await screen.findByText(/geçerli bir email/i)).toBeInTheDocument()
    expect(screen.getByText(/şifre zorunlu/i)).toBeInTheDocument()
  })

  it('redirects on successful login', async () => {
    render(<LoginForm />)
    fireEvent.input(screen.getByLabelText(/email/i), { target: { value: 'admin@taxsi.test' } })
    fireEvent.input(screen.getByLabelText(/şifre/i), { target: { value: 'admin123' } })
    fireEvent.click(screen.getByRole('button', { name: /giriş yap/i }))
    await waitFor(() => expect(push).toHaveBeenCalledWith('/admin/dashboard'))
  })
})
```

- [ ] **Step 5: Run tests, verify they pass**

Run: `cd frontend && npx jest app/\\(admin\\)/admin/login/__tests__/login.test.tsx`
Expected: 2 passed.

If the test runner can't find the file because of the parens in the path, instead run `npx jest --testPathPattern="login.test"`.

- [ ] **Step 6: Commit**

```bash
git add frontend/app/\(admin\)/ frontend/components/admin/auth/
git commit -m "feat(admin): add login page + form with validation"
```

---

## Task 14: Manual end-to-end smoke test

**Files:** none changed — this is a verification step.

- [ ] **Step 1: Start dev server**

Run from `frontend/`:
```bash
NEXT_PUBLIC_API_MOCK=true npm run dev
```

- [ ] **Step 2: Test the unauthenticated redirect**

Open `http://localhost:3000/admin/dashboard` in a browser.
Expected: redirected to `http://localhost:3000/admin/login?next=/admin/dashboard`.

- [ ] **Step 3: Test invalid credentials**

Submit form with email `wrong@taxsi.test` / password `whatever`.
Expected: a red toast in the top-right reading "Invalid credentials". Stays on the login page.

- [ ] **Step 4: Test valid credentials**

Submit `admin@taxsi.test` / `admin123`.
Expected:
- Redirect to `/admin/dashboard`
- Sidebar visible on the left with all 7 nav items, Dashboard active (gold left border)
- Topbar shows "Dashboard", current date, green Online dot
- Body shows the placeholder paragraph

- [ ] **Step 5: Test logout**

Click "Logout" in the sidebar.
Expected: redirected to `/admin/login`. The cookie is cleared (DevTools → Application → Cookies).

- [ ] **Step 6: Test customer portal is unaffected**

Open `http://localhost:3000/`.
Expected: customer portal renders with sand/cream styling — no dark background, no admin nav.

- [ ] **Step 7: Stop dev server, document the result**

If all 6 checks passed, mark Task 14 complete. Note any visual issues to fix before declaring Plan A done. Stop the dev server.

---

## Task 15: Verification + cleanup

- [ ] **Step 1: Run the full test suite**

Run from `frontend/`:
```bash
npm test
```
Expected: all tests pass (existing + new).

- [ ] **Step 2: Lint + typecheck**

Run from `frontend/`:
```bash
npm run lint && npx tsc --noEmit
```
Expected: no errors.

- [ ] **Step 3: Production build**

Run from `frontend/`:
```bash
npm run build
```
Expected: build succeeds. Routes shown in the build output should include `/admin/login` and `/admin/dashboard`.

- [ ] **Step 4: Commit any cleanup**

If you fixed any nits during the smoke test (visual tweaks, missing imports, etc), commit them now.

```bash
git status
# if there are changes:
git add -A
git commit -m "chore(admin): plan A cleanup"
```

---

## Self-Review (already performed — engineer should re-check after execution)

**Spec coverage (Plan A scope only):**
- §1 Overview / single admin role: covered (Task 9 middleware, Task 13 login)
- §2 File Structure (foundation files): covered
- §3 Auth (mock-mode subset): covered (Task 5–9, 13)
- §4 API Layer base + auth: covered (Task 7, 8)
- §5 Sidebar + Topbar: covered (Task 11)
- §9 Theme: covered (Task 3)

**Out-of-scope items deferred to later plans (intentional):**
- §4 Other API modules (bookings, drivers, etc) — Plan B/C
- §6 All pages except login + empty dashboard — Plan B/C
- §7 Shared UI components (data-table, stat-card, confirm-dialog, page-header, booking-status-badge) — Plan B
- §8 All types are landed in Task 4 (forward declared so Plan B/C don't need to amend)
- §10 Error handling: partial — toast on login error only (Task 13). Full retry/network states in Plan B.
- §11 Out of scope: not implemented (correct)
- §12 Backend contract: informational — Plan A operates entirely in mock mode

**Type consistency check passed.** `Driver`, `Booking`, etc match between `lib/types/admin.ts` and the spec.

---

## Done criteria

Plan A is complete when:
1. `npm test` passes
2. `npm run build` succeeds
3. Manual smoke test (Task 14) passes all 6 steps
4. Customer portal renders unchanged
