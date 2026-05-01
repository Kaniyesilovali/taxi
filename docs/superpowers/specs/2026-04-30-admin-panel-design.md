# Admin Panel — Design Specification

**Date:** 2026-04-30
**Scope:** Frontend admin panel only (`frontend/app/(admin)/`)
**Depends on:** [2026-04-28-taxsi-platform-design.md](./2026-04-28-taxsi-platform-design.md)

---

## 1. Overview

Six-page admin panel for Taxsi. Protected by JWT auth. Admins manage bookings (assign drivers), configure routes/extras, manage driver accounts, and view revenue.

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
│           │   └── page.tsx
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
│       │   └── driver-form.tsx
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
│   │   ├── revenue.ts
│   │   └── auth.ts
│   ├── mock/
│   │   ├── bookings.ts
│   │   ├── routes.ts
│   │   ├── extras.ts
│   │   ├── drivers.ts
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
getDrivers(): Promise<Driver[]>
getDriver(id: string): Promise<Driver>
createDriver(body: DriverBody): Promise<Driver>
updateDriver(id: string, body: Partial<DriverBody>): Promise<Driver>
deleteDriver(id: string): Promise<void>
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
- Nav items: Dashboard, Bookings (with pending count badge), Routes, Extras, Drivers, Revenue
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

**Table:** Name, Surname, Email, Phone, Status badge, Actions
**Status:** active (green) / inactive (amber)
**Actions:** Edit, Delete

**"New Driver" button**

**Driver form (shadcn Sheet — slide-over):**
- First name, Last name
- Email (unique, used for login)
- Phone
- Password (only shown on create; edit leaves password unchanged unless filled)
- Status toggle (active/inactive)

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
  status: DriverStatus
  createdAt: string
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
type DriverBody = Omit<Driver, 'id' | 'createdAt'> & { password: string }
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
- Admin account management (password change, multiple admins)
- Booking creation from admin
- Export to CSV/PDF
- NestJS backend implementation (separate spec)
