# Admin Panel — Design Specification

**Date:** 2026-04-30
**Last updated:** 2026-05-01 — added Payouts page, Driver detail page, driver-level payout tracking
**Scope:** Frontend admin panel only (`frontend/app/(admin)/`)
**Depends on:** [2026-04-28-taxsi-platform-design.md](./2026-04-28-taxsi-platform-design.md)

---

## 1. Overview

Seven-page admin panel for Taxsi. Protected by JWT auth (single `admin` role — no RBAC). Admins manage bookings (assign drivers), configure routes/extras, manage driver accounts, **record driver payouts**, and view revenue.

The biggest operational goal is **driver payout management**: every month, the admin needs to see which driver completed how many trips, how much they earned, how much was already paid out, and what is still pending — then record the payment.

**Visual style:** Luxury Dark — night blue (`#0c1a2e`) + gold (`#c8922a`), consistent with the customer portal brand but adapted for dense data display.

**Tech decisions:**
- UI components: shadcn/ui, themed to night/gold palette
- Data fetching: TanStack Query v5
- Auth: JWT stored in httpOnly cookie, enforced by `middleware.ts`
- API layer: typed fetch functions in `lib/api/`, mock data during frontend development, real NestJS backend when ready
- Charts: Recharts (revenue page)

---

## 2. File Structure

```
frontend/
├── app/
│   └── (admin)/
│       ├── layout.tsx               ← renders AdminLayout (sidebar + topbar)
│       └── admin/
│           ├── login/
│           │   └── page.tsx
│           ├── dashboard/
│           │   └── page.tsx
│           ├── bookings/
│           │   ├── page.tsx
│           │   └── [id]/
│           │       └── page.tsx
│           ├── routes/
│           │   └── page.tsx
│           ├── extras/
│           │   └── page.tsx
│           ├── drivers/
│           │   ├── page.tsx
│           │   └── [id]/
│           │       └── page.tsx              ← driver detail (monthly summary + bookings + payouts tabs)
│           ├── payouts/
│           │   └── page.tsx                  ← payout creation + history
│           └── revenue/
│               └── page.tsx
├── components/
│   └── admin/
│       ├── layout/
│       │   ├── admin-sidebar.tsx
│       │   ├── admin-topbar.tsx
│       │   └── admin-layout.tsx      ← wraps all admin pages
│       ├── bookings/
│       │   ├── bookings-table.tsx
│       │   ├── assign-driver-modal.tsx
│       │   └── booking-status-badge.tsx
│       ├── routes/
│       │   ├── routes-table.tsx
│       │   └── route-form.tsx
│       ├── extras/
│       │   ├── extras-table.tsx
│       │   └── extra-form.tsx
│       ├── drivers/
│       │   ├── drivers-table.tsx
│       │   ├── driver-form.tsx
│       │   ├── driver-summary-cards.tsx     ← 4 stat cards on detail page
│       │   ├── driver-bookings-tab.tsx
│       │   └── driver-payouts-tab.tsx
│       ├── payouts/
│       │   ├── payout-create-panel.tsx       ← top half: filter + calculate + booking list + form
│       │   ├── payout-bookings-checklist.tsx ← booking selection table inside create panel
│       │   ├── payouts-history-table.tsx     ← bottom half: past payouts
│       │   ├── payout-detail-sheet.tsx       ← slide-over showing payout's bookings
│       │   └── payment-method-badge.tsx
│       ├── revenue/
│       │   ├── revenue-chart.tsx
│       │   └── revenue-filters.tsx
│       └── ui/
│           ├── stat-card.tsx
│           ├── data-table.tsx        ← generic sortable/paginated table
│           ├── confirm-dialog.tsx    ← generic delete confirmation
│           └── page-header.tsx
├── lib/
│   ├── api/
│   │   ├── client.ts               ← base fetch wrapper (auth headers, error handling)
│   │   ├── bookings.ts
│   │   ├── routes.ts
│   │   ├── extras.ts
│   │   ├── drivers.ts
│   │   ├── payouts.ts              ← driver payout API
│   │   ├── revenue.ts
│   │   └── auth.ts
│   ├── mock/
│   │   ├── bookings.ts
│   │   ├── routes.ts
│   │   ├── extras.ts
│   │   ├── drivers.ts
│   │   ├── payouts.ts              ← mock payout records + calculation helper
│   │   └── revenue.ts
│   └── types/
│       └── admin.ts                ← shared TypeScript types
└── middleware.ts                   ← JWT check, redirect to /admin/login
```

---

## 3. Auth

### middleware.ts
Runs on every `/admin/*` request except `/admin/login`. Reads `admin_token` cookie. If missing or expired, redirects to `/admin/login`.

### Login page (`/admin/login`)
- Email + password form
- Calls `POST /api/v1/auth/admin/login`
- On success: sets `admin_token` cookie (httpOnly, secure, sameSite=lax), redirects to `/admin/dashboard`
- JWT access token: 15 min. Refresh token stored in separate `admin_refresh` cookie.
- Auto-refresh: `lib/api/client.ts` intercepts 401, calls refresh endpoint, retries once.

### Logout
Clears both cookies, redirects to `/admin/login`.

---

## 4. API Layer

### `lib/api/client.ts`
Base fetch wrapper. Attaches `Authorization: Bearer <token>` from cookie on client, handles 401 → refresh → retry, throws typed errors.

### Mock mode
Each API module checks `process.env.NEXT_PUBLIC_API_MOCK === 'true'`. If true, imports from `lib/mock/` and returns fake data with realistic delay (`await sleep(300)`). Switch to real API by setting the env var to false and providing `NEXT_PUBLIC_API_BASE_URL`.

In mock mode, auth is simulated: login sets a plain `admin_token` cookie (non-httpOnly) with a fake JWT. In production, the NestJS backend sets the cookie server-side (httpOnly, secure). The middleware reads the cookie in both cases — only the cookie's security attributes differ.

### API modules (each exports async functions)

**`lib/api/bookings.ts`**
```ts
getBookings(filters: BookingFilters): Promise<PaginatedResponse<Booking>>
getBooking(id: string): Promise<Booking>
assignDriver(id: string, body: AssignDriverBody): Promise<Booking>
cancelBooking(id: string): Promise<Booking>
```

**`lib/api/routes.ts`**
```ts
getRoutes(): Promise<Route[]>
createRoute(body: RouteBody): Promise<Route>
updateRoute(id: string, body: Partial<RouteBody>): Promise<Route>
deleteRoute(id: string): Promise<void>
```

**`lib/api/extras.ts`**
```ts
getExtras(): Promise<Extra[]>
createExtra(body: ExtraBody): Promise<Extra>
updateExtra(id: string, body: Partial<ExtraBody>): Promise<Extra>
deleteExtra(id: string): Promise<void>
```

**`lib/api/drivers.ts`**
```ts
getDrivers(): Promise<Driver[]>                        // each driver includes pendingPayoutAmount
getDriver(id: string): Promise<Driver>
getDriverSummary(id: string, month: string): Promise<DriverMonthlySummary>  // month: YYYY-MM
createDriver(body: DriverBody): Promise<Driver>
updateDriver(id: string, body: Partial<DriverBody>): Promise<Driver>
deleteDriver(id: string): Promise<void>
```

**`lib/api/payouts.ts`**
```ts
calculatePayout(driverId: string, periodStart: string, periodEnd: string): Promise<PayoutCalculation>
createPayout(body: CreatePayoutBody): Promise<DriverPayout>
getPayouts(filters: PayoutFilters): Promise<PaginatedResponse<DriverPayout>>
getPayout(id: string): Promise<DriverPayout>
deletePayout(id: string): Promise<void>
exportPayoutsCSV(filters: PayoutFilters): Promise<Blob>   // returns CSV blob; UI triggers download
```

**`lib/api/revenue.ts`**
```ts
getRevenueStats(filters: RevenueFilters): Promise<RevenueStats>
```

---

## 5. Shared Layout

`components/admin/layout/admin-layout.tsx` wraps all admin pages (except login). Contains:
- Fixed left sidebar (220px wide)
- Main content area with topbar + scrollable page content

**Sidebar:**
- Taxsi logo + "Admin" label at top
- Nav items (in order): Dashboard, Bookings (with pending count badge), Routes, Extras, Drivers, **Payouts**, Revenue
- Active state: gold left border + gold text
- Logout button at bottom
- Nav items use Next.js `Link`, active state detected via `usePathname()`

**Topbar:**
- Page title (from each page's `<PageHeader>`)
- Current date
- Admin status indicator (green dot)

**Pending badge on Bookings nav item:**
TanStack Query fetches pending bookings count on layout mount. Refreshes every 60 seconds.

---

## 6. Pages

### Dashboard (`/admin/dashboard`)

**Stat cards (4):**
| Card | Value | Note |
|---|---|---|
| Pending | count | amber color, "Awaiting assignment" |
| Today | count | bookings created today |
| Completed | count | completed this month, green |
| Revenue | € amount | current month, gold |

**Recent bookings table:**
- Last 10 bookings, all statuses
- Columns: Ref, Customer, Route, Date/Time, Amount, Status badge, Action
- Action: "Assign" button (opens modal) for PENDING, "View" link for others
- "View all →" link to `/admin/bookings`

**Data:** TanStack Query, refetch interval 30s.

---

### Bookings (`/admin/bookings`)

**Filters bar:**
- Status multiselect (pending, assigned, in_progress, completed, cancelled)
- Date range picker (from/to)
- Payment type select (cash, online)
- Driver select (assigned driver filter)
- Search input (booking ref or customer name)
- "Reset filters" button

**Table:**
Columns: Ref, Customer, Route, Date/Time, Passengers, Amount, Payment, Status, Driver, Actions

Actions per row:
- PENDING → "Assign" button (gold, opens Assign Driver modal)
- Any status → "View" (opens detail page `/admin/bookings/[id]`)
- PENDING or ASSIGNED → "Cancel" (opens confirm dialog)

**Pagination:** 20 rows per page, server-side.

**Assign Driver modal (`assign-driver-modal.tsx`):**
- shadcn Dialog
- Shows booking summary (ref, customer, route, date, total)
- Driver dropdown (active drivers only)
- Vehicle info text input (required)
- "Assign" submit button
- On success: TanStack Query invalidates bookings list, toast notification

**Booking detail page (`/admin/bookings/[id]`):**
- Full booking info, read-only
- Status timeline
- If PENDING: assign driver inline
- Payment details section

---

### Routes (`/admin/routes`)

**Table:** Name, Pickup, Dropoff, Base Price, Round Trip Price, Active toggle, Actions
**Actions:** Edit (opens slide-over form), Delete (confirm dialog)
**"New Route" button:** opens same slide-over form in create mode

**Route form (shadcn Sheet — slide-over):**
- Name, Pickup location, Dropoff location
- Base price (€), Round trip price (€)
- Active toggle
- Validation: all fields required, prices must be positive numbers

---

### Extras (`/admin/extras`)

**Table:** Name, Price, Active toggle, Actions
**Actions:** Edit, Delete
**"New Extra" button**

**Extra form (inline dialog):**
- Name (text input)
- Price (€ number input)
- Active toggle

---

### Drivers (`/admin/drivers`)

**Table:** Name, Surname, Email, Phone, Status badge, **Pending Payout (€)**, Actions
**Status:** active (green) / inactive (amber)
**Pending Payout:** sum of `driverAmount` for completed bookings not yet included in any payout. Gold text when > 0. Clicking the cell navigates to `/admin/payouts?driverId=<id>` (pre-filtered).
**Actions:** **Detail** (→ `/admin/drivers/[id]`), Edit, Delete

**"New Driver" button**

**Driver form (shadcn Sheet — slide-over):**
- First name, Last name
- Email (unique, used for login)
- Phone
- **IBAN** (optional, free text — stored as-is, used as snapshot when creating payouts)
- **Bank name** (optional)
- Password (only shown on create; edit leaves password unchanged unless filled)
- Status toggle (active/inactive)

---

### Driver Detail (`/admin/drivers/[id]`)

Driver-level monthly view. Used by admin to inspect a single driver's activity and prepare/review payouts.

**Page header:** Driver name + status badge + "Edit" button (opens driver-form sheet) + "New Payout" CTA (gold) on the right.

**Month selector:** Above the stat cards. Default = current month. Previous-month navigation chevrons.

**Stat cards (4):**
| Card | Value |
|---|---|
| Bu ay tamamlanan | `completedBookingCount` |
| Bu ay hak edilen | `earnedAmount` (€) |
| Bu ay ödenen | `paidAmount` (€) |
| Bekleyen ödeme | `pendingAmount` (€), gold |

Data: `getDriverSummary(id, month)`. TanStack Query, refetch on month change.

**Driver info card:** Read-only. Name, email, phone, IBAN, bank name, status, joined date.

**Tabs (shadcn Tabs):**

1. **Bookings tab** — Table of bookings assigned to this driver (any status, filtered to selected month by default — month selector also drives this).
   - Columns: Ref, Date/Time, Route, Customer, Driver Amount, Status badge, **Payout Status badge** ("Ödendi" green if `payoutId` set, "Bekliyor" amber if completed and unpaid, "—" muted otherwise)
   - Filters: date range (overrides month selector), payout status (paid / unpaid / all)
   - Pagination: 20 rows per page

2. **Payouts tab** — Past payout records for this driver.
   - Columns: Paid At, Period (e.g., "01–31 Mart 2026"), Amount, Booking count, Payment method, Note (truncated), Actions
   - Action: "Detail" (opens `payout-detail-sheet.tsx` showing all bookings in that payout)
   - No pagination needed initially (most drivers will have <50 payout records over the lifetime)

The "New Payout" CTA navigates to `/admin/payouts?driverId=<id>&autoCalc=1` — Payouts page opens with this driver pre-selected and the calculation triggered automatically.

---

### Payouts (`/admin/payouts`)

The driver payout management page. Two stacked sections: **create new payout** (top) and **history** (bottom).

#### Create panel (top)

**Filters bar:**
- **Driver** select (required, active drivers only)
- **Period start** date picker (default: 1st of current month)
- **Period end** date picker (default: today)
- **"Hesapla"** button (gold)

URL params `driverId` and `autoCalc=1` (when arriving from driver detail) pre-populate the form and auto-trigger calculation on mount.

On click, calls `calculatePayout(driverId, periodStart, periodEnd)`. Returns the driver's `completed` bookings in that range that are **not yet attached to any payout**. Renders:

**Summary card:**
- Booking count
- Toplam hak ediş (sum of `driverAmount`)
- Önerilen ödeme tutarı (= toplam hak ediş; updates when checkboxes change or override is edited)

**Booking checklist table (`payout-bookings-checklist.tsx`):**
- Header checkbox (select all / none)
- Per-row: checkbox (default checked), Ref, Date/Time, Route, Customer, driverAmount
- Unchecking a row removes its `driverAmount` from the suggested total

**Payment form (below the checklist):**
- **Tutar (€)** — number input, default = suggested amount, admin can override (e.g., to deduct damages). Must be > 0.
- **Not** — textarea, optional (e.g., "100€ kesinti: 12 Mart hasar")
- **Ödeme yöntemi** — select: Banka havalesi / Elden / Diğer
- **"Ödendi olarak kaydet"** — submit button

On submit: calls `createPayout({ driverId, periodStart, periodEnd, amount, bookingIds, note, paymentMethod })`. Backend snapshots the driver's current `iban` and `bankName` into the payout record. On success:
1. Toast: "€X ödendi olarak kaydedildi"
2. Reset the create panel
3. Invalidate `payouts` and `drivers` queries (Drivers table's pending-payout column refreshes)

#### History (bottom)

**Filters:**
- Driver select (optional — "All drivers" by default; respects `?driverId=` URL param)
- Date range (over `paidAt`)
- "CSV indir" button — calls `exportPayoutsCSV(filters)`, downloads a CSV of the filtered records

**Table:**
| Column | Content |
|---|---|
| Ödeme Tarihi | `paidAt` formatted |
| Sürücü | `driver.name surname` |
| Dönem | `periodStart – periodEnd` |
| Booking | count (e.g., "12") |
| Tutar | `amount €` |
| Yöntem | payment-method-badge |
| Aksiyon | "Detay" + "Sil" |

**Pagination:** 20 per page, server-side.

**"Detay"** opens `payout-detail-sheet.tsx` (slide-over): full payout info — driver, period, amount, note, payment method, IBAN snapshot, bank name snapshot, plus a table of all bookings included in the payout (Ref, Date, Route, driverAmount).

**"Sil"** opens confirm-dialog: "Bu ödeme kaydı silinecek, içerdiği {N} booking 'ödenmemiş' duruma dönecek." On confirm, calls `deletePayout(id)`. Hard delete (no soft-delete in MVP). Bookings become eligible for inclusion in a future payout.

#### Edge case rules

- A booking can be included in **at most one** payout. The `calculatePayout` endpoint filters out bookings that already have a `payoutId`.
- Override `amount` must be > 0 (no zero or negative payouts — admin should delete instead).
- Inactive drivers cannot have new payouts created (driver select hides them), but existing payouts for inactive drivers remain visible/deletable.
- Currency is always EUR. No multi-currency in MVP.

---

### Revenue (`/admin/revenue`)

**Filters:**
- Date range picker (defaults to current month)
- Payment type: All / Cash / Online

**Stat cards (3):**
| Card | Value |
|---|---|
| Total Revenue | € gross |
| Commission | € earned |
| Driver Payout | € net to drivers |

**Chart:** Recharts `BarChart` — daily revenue bars for selected period. Two series: online (gold) and cash (night blue with gold border).

**Summary table:**
- Grouped by payment type
- Columns: Payment Type, Bookings count, Gross Revenue, Commission Rate, Commission Earned, Driver Payout

---

## 7. Shared UI Components

### `stat-card.tsx`
Props: `label`, `value`, `sub`, `variant` (`default` | `gold` | `success` | `warning`)

### `data-table.tsx`
Generic table wrapper built on shadcn `Table`. Props: `columns`, `data`, `pagination`, `loading`. Handles empty state ("No results") and skeleton loading rows.

### `confirm-dialog.tsx`
shadcn AlertDialog. Props: `title`, `description`, `onConfirm`, `loading`. Used for all delete/cancel confirmations.

### `booking-status-badge.tsx`
Color-coded badge per status:
- PENDING → amber
- ASSIGNED → blue
- IN_PROGRESS → purple
- COMPLETED → green
- CANCELLED → red/muted

### `page-header.tsx`
Props: `title`, `action` (optional button). Renders topbar title + optional CTA.

---

## 8. TypeScript Types (`lib/types/admin.ts`)

```ts
type BookingStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
type PaymentType = 'cash' | 'online'
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
type DriverStatus = 'active' | 'inactive'
type PaymentMethod = 'bank_transfer' | 'cash' | 'other'

interface Booking {
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
  date: string          // ISO date
  time: string          // HH:MM
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
  payoutId: string | null       // set when included in a driver_payout; null if unpaid/not applicable
  isPaidToDriver: boolean       // server-derived: payoutId !== null
  createdAt: string
  updatedAt: string
}

interface BookingExtra {
  id: string
  extraId: string
  extra: Extra
  quantity: number
  unitPrice: number
}

interface Route {
  id: string
  name: string
  pickupLocation: string
  dropoffLocation: string
  basePrice: number
  roundTripPrice: number
  isActive: boolean
  createdAt: string
}

interface Extra {
  id: string
  name: string
  price: number
  isActive: boolean
}

interface Driver {
  id: string
  name: string
  surname: string
  email: string
  phone: string
  iban: string | null
  bankName: string | null
  status: DriverStatus
  pendingPayoutAmount: number   // server-computed: sum of driverAmount for completed, unpaid bookings
  createdAt: string
}

interface DriverMonthlySummary {
  driver: Driver
  month: string                 // YYYY-MM
  completedBookingCount: number
  earnedAmount: number          // sum of driverAmount across completed bookings in the month
  paidAmount: number            // sum of payouts paid in the month (paidAt within month)
  pendingAmount: number         // earnedAmount - (driverAmount sum of paid bookings in the month)
  bookings: Booking[]
}

interface DriverPayout {
  id: string
  driverId: string
  driver: Driver
  periodStart: string           // ISO date
  periodEnd: string             // ISO date
  amount: number                // EUR — admin-overridable; defaults to sum(driverAmount)
  note: string | null
  paymentMethod: PaymentMethod
  ibanSnapshot: string | null   // captured at payout creation time
  bankNameSnapshot: string | null
  bookingIds: string[]
  bookings: Booking[]           // joined for detail view
  paidAt: string                // ISO datetime
  createdBy: string             // admin user id
  createdAt: string
}

interface PayoutCalculation {
  driverId: string
  periodStart: string
  periodEnd: string
  bookings: Booking[]           // unpaid completed bookings in range
  suggestedAmount: number       // sum(driverAmount)
  bookingCount: number
}

interface CreatePayoutBody {
  driverId: string
  periodStart: string
  periodEnd: string
  amount: number
  bookingIds: string[]
  note?: string
  paymentMethod: PaymentMethod
}

interface PayoutFilters {
  driverId?: string
  from?: string                 // filters paidAt
  to?: string
  page?: number
}

interface DailyStat {
  date: string
  online: number
  cash: number
  total: number
}

interface RevenueStats {
  totalRevenue: number
  commission: number
  driverPayout: number
  onlineRevenue: number
  cashRevenue: number
  bookingCount: number
  daily: DailyStat[]
}

interface BookingFilters {
  status?: BookingStatus[]
  from?: string
  to?: string
  paymentType?: PaymentType
  driverId?: string
  search?: string
  page?: number
}

interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
}

interface AssignDriverBody {
  driverId: string
  vehicleInfo: string
}

type RouteBody = Omit<Route, 'id' | 'createdAt'>
type ExtraBody = Omit<Extra, 'id'>
type DriverBody = Omit<Driver, 'id' | 'createdAt' | 'pendingPayoutAmount'> & { password?: string }
interface RevenueFilters { from: string; to: string; paymentType?: PaymentType }
```

---

## 9. shadcn/ui Theme

Install shadcn/ui with `--style default`. Override CSS variables in `globals.css` for the night/gold palette:

```css
:root {
  /* admin dark theme overrides applied under [data-admin] or in admin layout */
  --background: #0c1a2e;
  --foreground: #ffffff;
  --card: #0a1628;
  --card-foreground: #ffffff;
  --border: #1e3a5f;
  --input: #1e3a5f;
  --primary: #c8922a;
  --primary-foreground: #ffffff;
  --muted: #091424;
  --muted-foreground: #6b8db3;
  --ring: #c8922a;
}
```

Admin layout wraps content in `<div data-admin>` to scope these overrides away from the customer portal.

---

## 10. Error Handling

- API errors display shadcn `Toast` (sonner) notifications: success (green), error (red)
- Network errors show inline error state in tables with "Retry" button
- TanStack Query `retry: 1` for failed requests
- 401 errors trigger cookie clear + redirect to login

---

## 11. Out of Scope

- Real-time updates (WebSocket) — polling only (30s dashboard, 60s nav badge)
- Admin account management (password change, multiple admins, RBAC)
- Booking creation from admin
- PDF export (CSV export only, for payouts)
- NestJS backend implementation (separate spec)
- Bank file export (SEPA XML) and payment-gateway integration (Stripe Connect) — payouts are recorded internally only
- Soft-delete / audit history for deleted payouts — hard delete in MVP
- Driver-side trip logging (km / fuel notes) — admin works from completed booking records only

---

## 12. Backend Contract for Payouts (informational — backend spec separate)

This frontend will consume the API signatures defined in §4 and the types in §8. The eventual NestJS/Postgres implementation must satisfy these contracts. Suggested schema:

```
driver_payouts
  id uuid pk
  driver_id uuid fk drivers(id)
  period_start date not null
  period_end date not null
  amount numeric(10,2) not null check (amount > 0)
  note text null
  payment_method text not null check (payment_method in ('bank_transfer','cash','other'))
  iban_snapshot text null
  bank_name_snapshot text null
  paid_at timestamptz not null default now()
  created_by uuid fk users(id)
  created_at timestamptz not null default now()

driver_payout_bookings  (join table — enforces the "one booking, one payout" rule)
  payout_id uuid fk driver_payouts(id) on delete cascade
  booking_id uuid fk bookings(id)
  primary key (payout_id, booking_id)
  unique (booking_id)
```

Additions to existing tables:
- `drivers.iban text null`
- `drivers.bank_name text null`

`Booking.payoutId` and `Booking.isPaidToDriver` are derived server-side from a left join with `driver_payout_bookings` — not denormalized columns.

Server-computed fields the frontend depends on:
- `Driver.pendingPayoutAmount` — `SUM(b.driverAmount)` over completed bookings assigned to driver, where `b.id NOT IN (SELECT booking_id FROM driver_payout_bookings)`
- `DriverMonthlySummary` — aggregations over the requested `month` (`YYYY-MM`) for `bookings.completedAt` and `driver_payouts.paidAt`

CSV export format for `exportPayoutsCSV`:
```
paid_at,driver_name,driver_surname,iban,bank_name,period_start,period_end,booking_count,amount_eur,payment_method,note
```
