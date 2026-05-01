# Frontend — Customer Portal Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the public-facing Taxsi customer portal — booking form with live price summary, booking confirmation page, and live status tracker — on the existing Next.js 16 boilerplate.

**Architecture:** Route-group-based App Router. Public customer pages live under `app/(customer)/` (no auth required). A typed API service layer (`lib/api/`) wraps all `fetch` calls; a parallel mock layer (`lib/mock/`) supplies data so the frontend works without a running backend. Shared UI primitives live in `components/ui/` and are reused by Admin and Driver plans.

**Tech Stack:** Next.js 16 · React 19 · Tailwind CSS 4 · TypeScript · react-hook-form · zod · lucide-react · clsx · tailwind-merge · Jest · React Testing Library

---

## File Map

```
frontend/                           ← renamed from taxsi/ in Task 1
├── components/
│   └── ui/
│       ├── button.tsx              # Button with variant/size/loading props
│       ├── badge.tsx               # Status badge coloured by variant
│       ├── spinner.tsx             # Loading spinner
│       ├── card.tsx                # White card container
│       ├── input.tsx               # Labeled text input with error
│       ├── select.tsx              # Labeled select dropdown with error
│       ├── textarea.tsx            # Labeled textarea with error
│       ├── toggle.tsx              # Boolean yes/no toggle switch
│       ├── pill-toggle.tsx         # Selectable pill (extras)
│       └── counter-input.tsx       # +/- number input
├── lib/
│   ├── cn.ts                       # clsx + tailwind-merge helper
│   ├── types.ts                    # Shared TypeScript types
│   ├── price.ts                    # Pure price calculation (testable)
│   ├── api.ts                      # Base fetch wrapper
│   ├── api/
│   │   ├── routes.ts               # GET /routes
│   │   ├── extras.ts               # GET /extras
│   │   └── bookings.ts             # POST /bookings, GET /bookings/track/:ref
│   └── mock/
│       ├── routes.ts               # 6 Cyprus airport transfer routes
│       └── extras.ts               # 5 extras (Child Seat, Flower, etc.)
└── app/
    ├── layout.tsx                  # Updated: Taxsi metadata + Geist font
    ├── globals.css                 # Updated: design tokens
    └── (customer)/
        ├── layout.tsx              # Header + footer, no auth
        ├── page.tsx                # Server component — fetches routes+extras, renders BookingForm
        ├── _components/
        │   ├── booking-form.tsx    # Client component — react-hook-form + zod
        │   ├── price-summary.tsx   # Live price sidebar
        │   └── route-selector.tsx  # Cascading pickup → dropoff dropdowns
        ├── confirm/
        │   └── [ref]/
        │       └── page.tsx        # Booking confirmed page
        └── track/
            └── [ref]/
                ├── page.tsx        # Status tracker page
                └── _components/
                    └── status-tracker.tsx  # Progress steps + driver card
```

**Modified files:**
- `app/page.tsx` — deleted (replaced by route group)
- `app/layout.tsx` — updated metadata
- `package.json` — new deps + test script
- `jest.config.ts` — new
- `jest.setup.ts` — new
- `.env.local` — new (NEXT_PUBLIC_USE_MOCK=true)

---

## Task 1: Rename directory taxsi → frontend

**Files:**
- Rename: `taxsi/taxsi/` → `taxsi/frontend/`

> All file paths from Task 2 onward are relative to `taxsi/frontend/`.

- [ ] **Step 1: Rename via git mv**

```bash
cd /Users/mac14/Desktop/taxsi
git mv taxsi frontend
```

- [ ] **Step 2: Verify**

```bash
ls /Users/mac14/Desktop/taxsi
```
Expected: `frontend` folder visible at root.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: rename app directory taxsi → frontend"
```

---

## Task 2: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime dependencies**

```bash
cd /Users/mac14/Desktop/taxsi/frontend
npm install react-hook-form @hookform/resolvers zod lucide-react clsx tailwind-merge
```

- [ ] **Step 2: Install dev dependencies**

```bash
npm install --save-dev jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @types/jest
```

- [ ] **Step 3: Add test scripts to package.json**

In `package.json` scripts section add:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 4: Verify**

```bash
npm ls react-hook-form zod lucide-react clsx tailwind-merge 2>&1 | grep -v "npm warn"
```
Expected: All 5 packages listed with versions, no errors.

- [ ] **Step 5: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add form, icon, and testing dependencies"
```

---

## Task 3: Jest setup

**Files:**
- Create: `jest.config.ts`
- Create: `jest.setup.ts`

- [ ] **Step 1: Write jest.config.ts**

```typescript
// jest.config.ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

- [ ] **Step 2: Write jest.setup.ts**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom'
```

- [ ] **Step 3: Verify Jest runs with no tests**

```bash
npx jest --passWithNoTests
```
Expected: "Test Suites: 0 passed, 0 total" — no errors.

- [ ] **Step 4: Commit**

```bash
git add jest.config.ts jest.setup.ts
git commit -m "chore: configure Jest with RTL and Next.js"
```

---

## Task 4: TypeScript types

**Files:**
- Create: `lib/types.ts`

- [ ] **Step 1: Write lib/types.ts**

```typescript
// lib/types.ts

export type BookingStatus = 'pending' | 'assigned' | 'in_progress' | 'completed' | 'cancelled'
export type PaymentType = 'cash' | 'online'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'
export type DriverStatus = 'active' | 'inactive'

export interface Route {
  id: string
  name: string
  pickup_location: string
  dropoff_location: string
  base_price: number
  round_trip_price: number
  is_active: boolean
}

export interface Extra {
  id: string
  name: string
  price: number
  is_active: boolean
}

export interface ExtraSelection {
  extra_id: string
  quantity: number
}

export interface BookingFormValues {
  route_id: string
  is_round_trip: boolean
  customer_name: string
  customer_surname: string
  customer_email: string
  customer_phone: string
  customer_id_passport: string
  date: string
  time: string
  passenger_count: number
  luggage_count: number
  is_vip: boolean
  extras: ExtraSelection[]
  payment_type: PaymentType
  notes: string
}

export interface CreateBookingResponse {
  id: string
  booking_ref: string
  total_amount: number
  payment_type: PaymentType
  stripe_client_secret: string | null
}

export interface BookingConfirmation {
  booking_ref: string
  customer_name: string
  customer_surname: string
  customer_email: string
  route_name: string
  pickup_location: string
  dropoff_location: string
  is_round_trip: boolean
  date: string
  time: string
  passenger_count: number
  is_vip: boolean
  payment_type: PaymentType
  total_amount: number
}

export interface BookingTracking {
  booking_ref: string
  status: BookingStatus
  customer_name: string
  customer_surname: string
  route_name: string
  pickup_location: string
  dropoff_location: string
  is_round_trip: boolean
  date: string
  time: string
  passenger_count: number
  luggage_count: number
  is_vip: boolean
  payment_type: PaymentType
  payment_status: PaymentStatus
  total_amount: number
  extras: { name: string; quantity: number; unit_price: number }[]
  driver: {
    name: string
    phone: string
    vehicle_info: string
    google_maps_link: string | null
  } | null
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/types.ts
git commit -m "feat: add shared TypeScript types"
```

---

## Task 5: Price calculation utility

**Files:**
- Create: `lib/price.ts`
- Create: `lib/__tests__/price.test.ts`

- [ ] **Step 1: Write the failing tests**

```typescript
// lib/__tests__/price.test.ts
import { calculatePrice } from '@/lib/price'

describe('calculatePrice', () => {
  test('returns base_price for one-way with no extras', () => {
    const result = calculatePrice({ basePrice: 45, roundTripPrice: 80, isRoundTrip: false, extras: [] })
    expect(result).toEqual({ baseAmount: 45, extrasAmount: 0, total: 45 })
  })

  test('uses round_trip_price when isRoundTrip is true', () => {
    const result = calculatePrice({ basePrice: 45, roundTripPrice: 80, isRoundTrip: true, extras: [] })
    expect(result).toEqual({ baseAmount: 80, extrasAmount: 0, total: 80 })
  })

  test('sums extras with quantities', () => {
    const result = calculatePrice({
      basePrice: 45,
      roundTripPrice: 80,
      isRoundTrip: false,
      extras: [
        { price: 10, quantity: 2 },
        { price: 35, quantity: 1 },
      ],
    })
    expect(result).toEqual({ baseAmount: 45, extrasAmount: 55, total: 100 })
  })

  test('returns zero total when no route selected (basePrice 0)', () => {
    const result = calculatePrice({ basePrice: 0, roundTripPrice: 0, isRoundTrip: false, extras: [] })
    expect(result).toEqual({ baseAmount: 0, extrasAmount: 0, total: 0 })
  })
})
```

- [ ] **Step 2: Run to confirm failure**

```bash
npx jest lib/__tests__/price.test.ts
```
Expected: FAIL — "Cannot find module '@/lib/price'"

- [ ] **Step 3: Write lib/price.ts**

```typescript
// lib/price.ts

interface PriceParams {
  basePrice: number
  roundTripPrice: number
  isRoundTrip: boolean
  extras: { price: number; quantity: number }[]
}

interface PriceResult {
  baseAmount: number
  extrasAmount: number
  total: number
}

export function calculatePrice(params: PriceParams): PriceResult {
  const baseAmount = params.isRoundTrip ? params.roundTripPrice : params.basePrice
  const extrasAmount = params.extras.reduce((sum, e) => sum + e.price * e.quantity, 0)
  return { baseAmount, extrasAmount, total: baseAmount + extrasAmount }
}
```

- [ ] **Step 4: Run to confirm passing**

```bash
npx jest lib/__tests__/price.test.ts
```
Expected: PASS — 4 tests passing.

- [ ] **Step 5: Commit**

```bash
git add lib/price.ts lib/__tests__/price.test.ts
git commit -m "feat: add price calculation utility with tests"
```

---

## Task 6: cn utility

**Files:**
- Create: `lib/cn.ts`

- [ ] **Step 1: Write lib/cn.ts**

```typescript
// lib/cn.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/cn.ts
git commit -m "feat: add cn class merging utility"
```

---

## Task 7: API service layer + mock data

**Files:**
- Create: `lib/api.ts`
- Create: `lib/api/routes.ts`
- Create: `lib/api/extras.ts`
- Create: `lib/api/bookings.ts`
- Create: `lib/mock/routes.ts`
- Create: `lib/mock/extras.ts`
- Create: `.env.local`

- [ ] **Step 1: Write lib/api.ts**

```typescript
// lib/api.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...init?.headers },
    ...init,
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error((body as { message?: string }).message ?? `HTTP ${res.status}`)
  }
  return res.json() as T
}

export const api = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: 'DELETE' }),
}
```

- [ ] **Step 2: Write lib/mock/routes.ts**

```typescript
// lib/mock/routes.ts
import type { Route } from '@/lib/types'

export const mockRoutes: Route[] = [
  {
    id: 'r1',
    name: 'Larnaca Airport → Nicosia',
    pickup_location: 'Larnaca International Airport',
    dropoff_location: 'Nicosia City Centre',
    base_price: 45,
    round_trip_price: 80,
    is_active: true,
  },
  {
    id: 'r2',
    name: 'Larnaca Airport → Limassol',
    pickup_location: 'Larnaca International Airport',
    dropoff_location: 'Limassol City Centre',
    base_price: 55,
    round_trip_price: 100,
    is_active: true,
  },
  {
    id: 'r3',
    name: 'Larnaca Airport → Ayia Napa',
    pickup_location: 'Larnaca International Airport',
    dropoff_location: 'Ayia Napa Resort',
    base_price: 50,
    round_trip_price: 90,
    is_active: true,
  },
  {
    id: 'r4',
    name: 'Paphos Airport → Limassol',
    pickup_location: 'Paphos International Airport',
    dropoff_location: 'Limassol City Centre',
    base_price: 50,
    round_trip_price: 90,
    is_active: true,
  },
  {
    id: 'r5',
    name: 'Paphos Airport → Nicosia',
    pickup_location: 'Paphos International Airport',
    dropoff_location: 'Nicosia City Centre',
    base_price: 70,
    round_trip_price: 125,
    is_active: true,
  },
  {
    id: 'r6',
    name: 'Paphos Airport → Paphos City',
    pickup_location: 'Paphos International Airport',
    dropoff_location: 'Paphos City Centre',
    base_price: 20,
    round_trip_price: 35,
    is_active: true,
  },
]
```

- [ ] **Step 3: Write lib/mock/extras.ts**

```typescript
// lib/mock/extras.ts
import type { Extra } from '@/lib/types'

export const mockExtras: Extra[] = [
  { id: 'e1', name: 'Child Seat', price: 10, is_active: true },
  { id: 'e2', name: 'Flower', price: 15, is_active: true },
  { id: 'e3', name: 'Fruit Plate', price: 20, is_active: true },
  { id: 'e4', name: 'Dessert Plate', price: 25, is_active: true },
  { id: 'e5', name: 'Champagne', price: 35, is_active: true },
]
```

- [ ] **Step 4: Write lib/api/routes.ts**

```typescript
// lib/api/routes.ts
import { api } from '@/lib/api'
import { mockRoutes } from '@/lib/mock/routes'
import type { Route } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getRoutes(): Promise<Route[]> {
  if (USE_MOCK) return mockRoutes.filter(r => r.is_active)
  return api.get<Route[]>('/routes')
}
```

- [ ] **Step 5: Write lib/api/extras.ts**

```typescript
// lib/api/extras.ts
import { api } from '@/lib/api'
import { mockExtras } from '@/lib/mock/extras'
import type { Extra } from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function getExtras(): Promise<Extra[]> {
  if (USE_MOCK) return mockExtras.filter(e => e.is_active)
  return api.get<Extra[]>('/extras')
}
```

- [ ] **Step 6: Write lib/api/bookings.ts**

```typescript
// lib/api/bookings.ts
import { api } from '@/lib/api'
import type {
  BookingFormValues,
  CreateBookingResponse,
  BookingConfirmation,
  BookingTracking,
} from '@/lib/types'

const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'

export async function createBooking(data: BookingFormValues): Promise<CreateBookingResponse> {
  if (USE_MOCK) {
    await new Promise(r => setTimeout(r, 800))
    return {
      id: 'mock-id',
      booking_ref: `TAX-${new Date().getFullYear()}0001`,
      total_amount: 45,
      payment_type: data.payment_type,
      stripe_client_secret: null,
    }
  }
  return api.post<CreateBookingResponse>('/bookings', data)
}

export async function getBookingConfirmation(ref: string): Promise<BookingConfirmation> {
  if (USE_MOCK) {
    return {
      booking_ref: ref,
      customer_name: 'John',
      customer_surname: 'Doe',
      customer_email: 'john@example.com',
      route_name: 'Larnaca Airport → Nicosia',
      pickup_location: 'Larnaca International Airport',
      dropoff_location: 'Nicosia City Centre',
      is_round_trip: false,
      date: '2026-05-15',
      time: '10:00',
      passenger_count: 2,
      is_vip: false,
      payment_type: 'cash',
      total_amount: 45,
    }
  }
  return api.get<BookingConfirmation>(`/bookings/track/${ref}`)
}

export async function getBookingTracking(ref: string): Promise<BookingTracking> {
  if (USE_MOCK) {
    return {
      booking_ref: ref,
      status: 'assigned',
      customer_name: 'John',
      customer_surname: 'Doe',
      route_name: 'Larnaca Airport → Nicosia',
      pickup_location: 'Larnaca International Airport',
      dropoff_location: 'Nicosia City Centre',
      is_round_trip: false,
      date: '2026-05-15',
      time: '10:00',
      passenger_count: 2,
      luggage_count: 1,
      is_vip: false,
      payment_type: 'cash',
      payment_status: 'pending',
      total_amount: 45,
      extras: [],
      driver: {
        name: 'Andreas Georgiou',
        phone: '+357 99 123456',
        vehicle_info: 'Mercedes E-Class · Silver · CY-1234',
        google_maps_link: null,
      },
    }
  }
  return api.get<BookingTracking>(`/bookings/track/${ref}`)
}
```

- [ ] **Step 7: Create .env.local**

```bash
printf "NEXT_PUBLIC_USE_MOCK=true\nNEXT_PUBLIC_API_URL=http://localhost:3001/api/v1\n" > .env.local
```

- [ ] **Step 8: Add .env.local to .gitignore**

In `.gitignore` (create if missing), ensure this line exists:
```
.env.local
```

- [ ] **Step 9: Commit**

```bash
git add lib/api.ts lib/api/ lib/mock/ .gitignore
git commit -m "feat: add API service layer with Cyprus mock data"
```

---

## Task 8: Shared UI — primitives

**Files:**
- Create: `components/ui/spinner.tsx`
- Create: `components/ui/badge.tsx`
- Create: `components/ui/button.tsx`
- Create: `components/ui/card.tsx`

- [ ] **Step 1: Write spinner.tsx**

```tsx
// components/ui/spinner.tsx
import { cn } from '@/lib/cn'

export function Spinner({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent',
        className
      )}
      role="status"
      aria-label="Loading"
    />
  )
}
```

- [ ] **Step 2: Write badge.tsx**

```tsx
// components/ui/badge.tsx
import { cn } from '@/lib/cn'

const variants = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  default: 'bg-zinc-100 text-zinc-800',
} as const

type BadgeVariant = keyof typeof variants

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 3: Write button.tsx**

```tsx
// components/ui/button.tsx
import { cn } from '@/lib/cn'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const variants = {
  primary: 'bg-zinc-900 text-white hover:bg-zinc-700 disabled:bg-zinc-400',
  secondary: 'border border-zinc-300 text-zinc-900 hover:bg-zinc-50 disabled:opacity-50',
  ghost: 'text-zinc-600 hover:bg-zinc-100 disabled:opacity-50',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
}

const sizes = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading,
  disabled,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      )}
      {children}
    </button>
  )
}
```

- [ ] **Step 4: Write card.tsx**

```tsx
// components/ui/card.tsx
import { cn } from '@/lib/cn'

export function Card({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={cn('rounded-xl border border-zinc-200 bg-white p-6 shadow-sm', className)}>
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Commit**

```bash
git add components/
git commit -m "feat: add Spinner, Badge, Button, Card UI primitives"
```

---

## Task 9: Shared UI — form controls

**Files:**
- Create: `components/ui/input.tsx`
- Create: `components/ui/select.tsx`
- Create: `components/ui/textarea.tsx`

- [ ] **Step 1: Write input.tsx**

```tsx
// components/ui/input.tsx
import { cn } from '@/lib/cn'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const inputId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={inputId} className="text-sm font-medium text-zinc-700">
          {label}
          {!required && <span className="ml-1 text-zinc-400">(optional)</span>}
        </label>
        <input
          id={inputId}
          ref={ref}
          required={required}
          className={cn(
            'h-10 rounded-lg border border-zinc-300 px-3 text-sm text-zinc-900 placeholder:text-zinc-400',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)
Input.displayName = 'Input'
```

- [ ] **Step 2: Write select.tsx**

```tsx
// components/ui/select.tsx
import { cn } from '@/lib/cn'
import { ChevronDown } from 'lucide-react'
import { forwardRef } from 'react'

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  error?: string
  placeholder?: string
  options: { value: string; label: string }[]
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, placeholder, options, className, id, ...props }, ref) => {
    const selectId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={selectId} className="text-sm font-medium text-zinc-700">
          {label}
        </label>
        <div className="relative">
          <select
            id={selectId}
            ref={ref}
            className={cn(
              'h-10 w-full appearance-none rounded-lg border border-zinc-300 px-3 pr-8 text-sm text-zinc-900',
              'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1',
              'disabled:bg-zinc-50 disabled:text-zinc-400',
              error && 'border-red-500 focus:ring-red-500',
              className
            )}
            {...props}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map(opt => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-2.5 size-4 text-zinc-500" />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)
Select.displayName = 'Select'
```

- [ ] **Step 3: Write textarea.tsx**

```tsx
// components/ui/textarea.tsx
import { cn } from '@/lib/cn'
import { forwardRef } from 'react'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, id, required, ...props }, ref) => {
    const textareaId = id ?? label.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1">
        <label htmlFor={textareaId} className="text-sm font-medium text-zinc-700">
          {label}
          {!required && <span className="ml-1 text-zinc-400">(optional)</span>}
        </label>
        <textarea
          id={textareaId}
          ref={ref}
          required={required}
          rows={3}
          className={cn(
            'rounded-lg border border-zinc-300 px-3 py-2 text-sm text-zinc-900 placeholder:text-zinc-400 resize-none',
            'focus:outline-none focus:ring-2 focus:ring-zinc-900 focus:ring-offset-1',
            error && 'border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />
        {error && <p className="text-xs text-red-600">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/input.tsx components/ui/select.tsx components/ui/textarea.tsx
git commit -m "feat: add Input, Select, Textarea form components"
```

---

## Task 10: Shared UI — interactive controls

**Files:**
- Create: `components/ui/toggle.tsx`
- Create: `components/ui/pill-toggle.tsx`
- Create: `components/ui/counter-input.tsx`

- [ ] **Step 1: Write toggle.tsx**

```tsx
// components/ui/toggle.tsx
import { cn } from '@/lib/cn'

interface ToggleProps {
  label: string
  description?: string
  checked: boolean
  onChange: (checked: boolean) => void
}

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-zinc-900">{label}</p>
        {description && <p className="text-xs text-zinc-500">{description}</p>}
      </div>
      <div
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors',
          checked ? 'bg-zinc-900' : 'bg-zinc-300'
        )}
      >
        <span
          className={cn(
            'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
            checked ? 'translate-x-6' : 'translate-x-1'
          )}
        />
      </div>
    </label>
  )
}
```

- [ ] **Step 2: Write pill-toggle.tsx**

```tsx
// components/ui/pill-toggle.tsx
import { cn } from '@/lib/cn'

interface PillToggleProps {
  label: string
  selected: boolean
  onToggle: () => void
}

export function PillToggle({ label, selected, onToggle }: PillToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      className={cn(
        'rounded-full border px-4 py-2 text-sm font-medium transition-colors',
        selected
          ? 'border-zinc-900 bg-zinc-900 text-white'
          : 'border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500'
      )}
    >
      {label}
    </button>
  )
}
```

- [ ] **Step 3: Write counter-input.tsx**

```tsx
// components/ui/counter-input.tsx
import { Minus, Plus } from 'lucide-react'

interface CounterInputProps {
  label: string
  value: number
  min?: number
  max?: number
  onChange: (value: number) => void
}

export function CounterInput({ label, value, min = 0, max = 99, onChange }: CounterInputProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm font-medium text-zinc-700">{label}</span>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="size-4" />
        </button>
        <span className="w-6 text-center text-sm font-semibold text-zinc-900">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="flex size-8 items-center justify-center rounded-lg border border-zinc-300 text-zinc-700 hover:bg-zinc-50 disabled:opacity-40"
          aria-label={`Increase ${label}`}
        >
          <Plus className="size-4" />
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add components/ui/toggle.tsx components/ui/pill-toggle.tsx components/ui/counter-input.tsx
git commit -m "feat: add Toggle, PillToggle, CounterInput interactive components"
```

---

## Task 11: Root layout + customer layout

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`
- Delete: `app/page.tsx`
- Create: `app/(customer)/layout.tsx`

- [ ] **Step 1: Update app/layout.tsx**

```tsx
// app/layout.tsx
import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })

export const metadata: Metadata = {
  title: 'Taxsi — Cyprus Airport Transfers',
  description: 'Book your Cyprus airport transfer in minutes. Fixed prices, no surprises.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 font-sans">{children}</body>
    </html>
  )
}
```

- [ ] **Step 2: Update app/globals.css**

```css
/* app/globals.css */
@import "tailwindcss";

@theme inline {
  --font-sans: var(--font-geist);
}
```

- [ ] **Step 3: Delete old page.tsx**

```bash
git rm app/page.tsx
```

- [ ] **Step 4: Write app/(customer)/layout.tsx**

```tsx
// app/(customer)/layout.tsx
import Link from 'next/link'

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-b border-zinc-200 bg-white">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link href="/" className="text-xl font-bold tracking-tight text-zinc-900">
            Taxsi
          </Link>
          <nav className="flex items-center gap-4 text-sm text-zinc-600">
            <a href="tel:+35799000000" className="hover:text-zinc-900">
              +357 99 000 000
            </a>
          </nav>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-zinc-200 bg-white py-6 text-center text-sm text-zinc-500">
        © {new Date().getFullYear()} Taxsi · Cyprus Airport Transfers
      </footer>
    </div>
  )
}
```

- [ ] **Step 5: Verify build still compiles**

```bash
npm run build 2>&1 | tail -10
```
Expected: Build succeeds (404 for `/` is fine until Task 12 adds page.tsx).

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css app/(customer)/layout.tsx
git commit -m "feat: update root layout and add customer portal shell"
```

---

## Task 12: Booking form page

**Files:**
- Create: `app/(customer)/_components/route-selector.tsx`
- Create: `app/(customer)/_components/price-summary.tsx`
- Create: `app/(customer)/_components/booking-form.tsx`
- Create: `app/(customer)/page.tsx`

- [ ] **Step 1: Write route-selector.tsx**

```tsx
// app/(customer)/_components/route-selector.tsx
'use client'
import { useState, useEffect } from 'react'
import { Select } from '@/components/ui/select'
import type { Route } from '@/lib/types'

interface RouteSelectorProps {
  routes: Route[]
  value: string
  onChange: (routeId: string) => void
  error?: string
}

export function RouteSelector({ routes, value, onChange, error }: RouteSelectorProps) {
  const [selectedPickup, setSelectedPickup] = useState('')

  const pickups = [...new Set(routes.map(r => r.pickup_location))].sort()
  const dropoffOptions = routes
    .filter(r => r.pickup_location === selectedPickup)
    .map(r => ({ value: r.id, label: r.dropoff_location }))

  useEffect(() => {
    if (value) {
      const route = routes.find(r => r.id === value)
      if (route) setSelectedPickup(route.pickup_location)
    }
  }, [value, routes])

  function handlePickupChange(pickup: string) {
    setSelectedPickup(pickup)
    onChange('')
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Select
        label="Pickup location"
        required
        placeholder="Select pickup"
        value={selectedPickup}
        onChange={e => handlePickupChange(e.target.value)}
        options={pickups.map(p => ({ value: p, label: p }))}
      />
      <Select
        label="Dropoff location"
        required
        placeholder={selectedPickup ? 'Select destination' : 'Select pickup first'}
        value={value}
        onChange={e => onChange(e.target.value)}
        options={dropoffOptions}
        disabled={!selectedPickup}
        error={error}
      />
    </div>
  )
}
```

- [ ] **Step 2: Write price-summary.tsx**

```tsx
// app/(customer)/_components/price-summary.tsx
import { Button } from '@/components/ui/button'
import { calculatePrice } from '@/lib/price'
import type { Extra, Route } from '@/lib/types'

interface PriceSummaryProps {
  route: Route | null
  isRoundTrip: boolean
  isVip: boolean
  extras: { extra_id: string; quantity: number }[]
  allExtras: Extra[]
  submitting: boolean
}

export function PriceSummary({
  route,
  isRoundTrip,
  isVip,
  extras,
  allExtras,
  submitting,
}: PriceSummaryProps) {
  const extrasWithPrices = extras
    .map(e => {
      const extra = allExtras.find(ex => ex.id === e.extra_id)
      return extra ? { ...extra, quantity: e.quantity } : null
    })
    .filter((e): e is Extra & { quantity: number } => e !== null)

  const { baseAmount, extrasAmount, total } = calculatePrice({
    basePrice: route?.base_price ?? 0,
    roundTripPrice: route?.round_trip_price ?? 0,
    isRoundTrip,
    extras: extrasWithPrices.map(e => ({ price: e.price, quantity: e.quantity })),
  })

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-zinc-900">Price Summary</h3>

      {!route ? (
        <p className="text-sm text-zinc-400">Select a route to see pricing</p>
      ) : (
        <>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600">
                {route.name}
                {isRoundTrip ? ' (Round Trip)' : ' (One Way)'}
              </span>
              <span className="font-medium text-zinc-900">€{baseAmount.toFixed(2)}</span>
            </div>

            {isVip && (
              <div className="flex justify-between text-zinc-600">
                <span>VIP Service</span>
                <span>Included</span>
              </div>
            )}

            {extrasWithPrices.map(e => (
              <div key={e.id} className="flex justify-between text-zinc-600">
                <span>
                  {e.name} × {e.quantity}
                </span>
                <span>€{(e.price * e.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t border-zinc-200 pt-2 flex justify-between font-semibold text-zinc-900">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" size="lg" loading={submitting}>
            Book Now
          </Button>

          <p className="mt-3 text-center text-xs text-zinc-400">
            Confirmation sent by email &amp; SMS
          </p>
        </>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Write booking-form.tsx**

```tsx
// app/(customer)/_components/booking-form.tsx
'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { PillToggle } from '@/components/ui/pill-toggle'
import { CounterInput } from '@/components/ui/counter-input'
import { RouteSelector } from './route-selector'
import { PriceSummary } from './price-summary'
import { createBooking } from '@/lib/api/bookings'
import type { Extra, Route } from '@/lib/types'

const schema = z.object({
  route_id: z.string().min(1, 'Select a destination'),
  is_round_trip: z.boolean(),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
  passenger_count: z.number().min(1).max(8),
  luggage_count: z.number().min(0).max(10),
  is_vip: z.boolean(),
  customer_name: z.string().min(1, 'First name required'),
  customer_surname: z.string().min(1, 'Last name required'),
  customer_email: z.string().email('Valid email required'),
  customer_phone: z.string().min(7, 'Valid phone required'),
  customer_id_passport: z.string().optional(),
  extras: z.array(z.object({ extra_id: z.string(), quantity: z.number().min(1) })),
  payment_type: z.enum(['cash', 'online']),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface BookingFormProps {
  routes: Route[]
  extras: Extra[]
}

export function BookingForm({ routes, extras }: BookingFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_round_trip: false,
      is_vip: false,
      passenger_count: 1,
      luggage_count: 1,
      extras: [],
      payment_type: 'cash',
    },
  })

  const watchedValues = watch()
  const selectedRoute = routes.find(r => r.id === watchedValues.route_id) ?? null

  function toggleExtra(extraId: string) {
    const current = watchedValues.extras
    const exists = current.some(e => e.extra_id === extraId)
    setValue(
      'extras',
      exists ? current.filter(e => e.extra_id !== extraId) : [...current, { extra_id: extraId, quantity: 1 }]
    )
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await createBooking({
        ...values,
        customer_id_passport: values.customer_id_passport ?? '',
        notes: values.notes ?? '',
      })
      router.push(`/confirm/${result.booking_ref}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Book Your Transfer</h1>
          <p className="mt-2 text-zinc-500">Cyprus airport transfers — fixed prices, no surprises</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">

            {/* Route & Date */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Route &amp; Date</h2>
              <div className="space-y-4">
                <Controller
                  name="route_id"
                  control={control}
                  render={({ field }) => (
                    <RouteSelector
                      routes={routes}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.route_id?.message}
                    />
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    {...register('date')}
                    error={errors.date?.message}
                  />
                  <Input
                    label="Time"
                    type="time"
                    required
                    {...register('time')}
                    error={errors.time?.message}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="passenger_count"
                    control={control}
                    render={({ field }) => (
                      <CounterInput
                        label="Passengers"
                        value={field.value}
                        min={1}
                        max={8}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    name="luggage_count"
                    control={control}
                    render={({ field }) => (
                      <CounterInput
                        label="Luggage pieces"
                        value={field.value}
                        min={0}
                        max={10}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Trip Options */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Trip Options</h2>
              <div className="space-y-4">
                <Controller
                  name="is_round_trip"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="Round Trip"
                      description="Include a return journey at a discounted rate"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="is_vip"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="VIP Service"
                      description="Premium vehicle, complimentary water, priority service"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </section>

            {/* Extras */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Extras</h2>
              <div className="flex flex-wrap gap-2">
                {extras.map(extra => (
                  <PillToggle
                    key={extra.id}
                    label={`${extra.name} — €${extra.price}`}
                    selected={watchedValues.extras.some(e => e.extra_id === extra.id)}
                    onToggle={() => toggleExtra(extra.id)}
                  />
                ))}
              </div>
            </section>

            {/* Personal Info */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Your Details</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First name"
                    required
                    autoComplete="given-name"
                    {...register('customer_name')}
                    error={errors.customer_name?.message}
                  />
                  <Input
                    label="Last name"
                    required
                    autoComplete="family-name"
                    {...register('customer_surname')}
                    error={errors.customer_surname?.message}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    {...register('customer_email')}
                    error={errors.customer_email?.message}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+357 99 000000"
                    {...register('customer_phone')}
                    error={errors.customer_phone?.message}
                  />
                </div>
                <Input
                  label="ID / Passport number"
                  {...register('customer_id_passport')}
                />
                <Textarea
                  label="Notes"
                  placeholder="Flight number, special requests..."
                  {...register('notes')}
                />
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Payment</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['cash', 'online'] as const).map(type => (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                      watchedValues.payment_type === type
                        ? 'border-zinc-900 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      className="sr-only"
                      {...register('payment_type')}
                    />
                    <div>
                      <p className="font-medium capitalize text-zinc-900">{type}</p>
                      <p className="text-xs text-zinc-500">
                        {type === 'cash' ? 'Pay the driver on arrival' : 'Secure online payment via Stripe'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}
          </div>

          {/* Sticky price sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PriceSummary
              route={selectedRoute}
              isRoundTrip={watchedValues.is_round_trip}
              isVip={watchedValues.is_vip}
              extras={watchedValues.extras}
              allExtras={extras}
              submitting={submitting}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
```

- [ ] **Step 4: Write app/(customer)/page.tsx**

```tsx
// app/(customer)/page.tsx
import { getRoutes } from '@/lib/api/routes'
import { getExtras } from '@/lib/api/extras'
import { BookingForm } from './_components/booking-form'

export default async function BookingPage() {
  const [routes, extras] = await Promise.all([getRoutes(), getExtras()])
  return <BookingForm routes={routes} extras={extras} />
}
```

- [ ] **Step 5: Start dev server and verify**

```bash
npm run dev
```

Open http://localhost:3000 and check:
- Header shows "Taxsi" logo and phone number
- Two-column layout: form sections on left, price summary on right
- Pickup dropdown shows airport options; selecting one enables dropoff dropdown
- Date/time pickers work
- Passenger/luggage counters increment and decrement
- Round trip and VIP toggles work
- Extras pills toggle on/off
- Price summary updates live as selections change
- Submit with empty form shows validation errors
- Submit with valid data shows loading state and redirects to `/confirm/TAX-20260001`

- [ ] **Step 6: Commit**

```bash
git add app/(customer)/
git commit -m "feat: add customer booking form with live price summary"
```

---

## Task 13: Booking confirmation page

**Files:**
- Create: `app/(customer)/confirm/[ref]/page.tsx`

- [ ] **Step 1: Write confirm page**

```tsx
// app/(customer)/confirm/[ref]/page.tsx
import Link from 'next/link'
import { CheckCircle, Calendar, MapPin, Users, CreditCard } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getBookingConfirmation } from '@/lib/api/bookings'

interface Props {
  params: Promise<{ ref: string }>
}

export default async function ConfirmPage({ params }: Props) {
  const { ref } = await params
  const booking = await getBookingConfirmation(ref)

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="size-8 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-zinc-900">Booking Confirmed!</h1>
        <p className="mt-2 text-zinc-500">
          Confirmation sent to <span className="font-medium text-zinc-700">{booking.customer_email}</span>
        </p>
      </div>

      <Card className="mb-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Booking Reference</p>
            <p className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">{booking.booking_ref}</p>
          </div>
          <Badge variant="pending">Pending</Badge>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">Route</p>
              <p className="font-medium text-zinc-900">{booking.pickup_location}</p>
              <p className="text-zinc-400">→</p>
              <p className="font-medium text-zinc-900">{booking.dropoff_location}</p>
              {booking.is_round_trip && <p className="text-xs text-zinc-500">Round Trip</p>}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">Date &amp; Time</p>
              <p className="font-medium text-zinc-900">
                {new Date(booking.date).toLocaleDateString('en-CY', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}{' '}
                at {booking.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Users className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">Passengers</p>
              <p className="font-medium text-zinc-900">{booking.passenger_count}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <CreditCard className="size-4 shrink-0 text-zinc-400" />
            <div>
              <p className="text-xs text-zinc-400 uppercase tracking-wide">Payment</p>
              <p className="font-medium capitalize text-zinc-900">
                {booking.payment_type} — €{booking.total_amount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link
          href={`/track/${booking.booking_ref}`}
          className="flex h-11 flex-1 items-center justify-center rounded-lg bg-zinc-900 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Track your booking
        </Link>
        <Link
          href="/"
          className="flex h-11 flex-1 items-center justify-center rounded-lg border border-zinc-300 text-sm font-medium text-zinc-700 hover:bg-zinc-50 transition-colors"
        >
          Book another transfer
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Verify in browser**

Open http://localhost:3000/confirm/TAX-20260001

Expected: Green checkmark, booking reference, route/date/payment details, two action buttons.

- [ ] **Step 3: Commit**

```bash
git add app/(customer)/confirm/
git commit -m "feat: add booking confirmation page"
```

---

## Task 14: Booking tracker page

**Files:**
- Create: `app/(customer)/track/[ref]/_components/status-tracker.tsx`
- Create: `app/(customer)/track/[ref]/page.tsx`

- [ ] **Step 1: Write status-tracker.tsx**

```tsx
// app/(customer)/track/[ref]/_components/status-tracker.tsx
import { Car, ExternalLink, MapPin, Phone } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import type { BookingStatus, BookingTracking } from '@/lib/types'

const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: 'Awaiting Assignment',
  assigned: 'Driver Assigned',
  in_progress: 'On the Way',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

const STATUS_STEPS: BookingStatus[] = ['pending', 'assigned', 'in_progress', 'completed']

export function StatusTracker({ booking }: { booking: BookingTracking }) {
  const currentIndex = STATUS_STEPS.indexOf(booking.status)

  return (
    <div className="space-y-6">
      <div>
        <Badge variant={booking.status} className="px-3 py-1 text-sm">
          {STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      {booking.status !== 'cancelled' && (
        <div className="flex items-center">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold ${
                    i <= currentIndex ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="hidden text-xs text-zinc-500 sm:block whitespace-nowrap">
                  {STATUS_LABELS[step].split(' ')[0]}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${i < currentIndex ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {booking.driver ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-zinc-900">Your Driver</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100">
                <Car className="size-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">{booking.driver.name}</p>
                <p className="text-sm text-zinc-500">{booking.driver.vehicle_info}</p>
              </div>
            </div>
            <a
              href={`tel:${booking.driver.phone}`}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <Phone className="size-4" />
              {booking.driver.phone}
            </a>
            {booking.driver.google_maps_link && (
              <a
                href={booking.driver.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <MapPin className="size-4" />
                Track Live Location
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      ) : booking.status === 'pending' ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Your booking is confirmed. We're assigning a driver and will notify you by SMS.
        </div>
      ) : null}
    </div>
  )
}
```

- [ ] **Step 2: Write track page**

```tsx
// app/(customer)/track/[ref]/page.tsx
import { notFound } from 'next/navigation'
import { Calendar, Luggage, MapPin, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getBookingTracking } from '@/lib/api/bookings'
import { StatusTracker } from './_components/status-tracker'

interface Props {
  params: Promise<{ ref: string }>
}

export default async function TrackPage({ params }: Props) {
  const { ref } = await params

  let booking
  try {
    booking = await getBookingTracking(ref)
  } catch {
    notFound()
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
      <div className="mb-8">
        <p className="text-sm text-zinc-400 uppercase tracking-wide">Booking Reference</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900">{booking.booking_ref}</h1>
        <p className="text-zinc-500">
          {booking.customer_name} {booking.customer_surname}
        </p>
      </div>

      <div className="space-y-6">
        <StatusTracker booking={booking} />

        <Card>
          <h3 className="mb-4 font-semibold text-zinc-900">Trip Details</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-4 shrink-0 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Route</p>
                <p className="font-medium text-zinc-900">{booking.pickup_location}</p>
                <p className="my-0.5 text-zinc-400">→</p>
                <p className="font-medium text-zinc-900">{booking.dropoff_location}</p>
                {booking.is_round_trip && (
                  <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600">
                    Round Trip
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Calendar className="size-4 shrink-0 text-zinc-400" />
              <div>
                <p className="text-xs text-zinc-400 uppercase tracking-wide">Date &amp; Time</p>
                <p className="font-medium text-zinc-900">
                  {new Date(booking.date).toLocaleDateString('en-CY', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                  })}{' '}
                  at {booking.time}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Users className="size-4 shrink-0 text-zinc-400" />
              <span className="text-zinc-600">
                {booking.passenger_count} passenger{booking.passenger_count !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <Luggage className="size-4 shrink-0 text-zinc-400" />
              <span className="text-zinc-600">
                {booking.luggage_count} luggage piece{booking.luggage_count !== 1 ? 's' : ''}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Verify in browser**

Open http://localhost:3000/track/TAX-20260001

Expected: Status steps (step 2 "Assigned" highlighted), driver card with name/vehicle/phone, trip details card. GPS link button absent (mock has null).

- [ ] **Step 4: Commit**

```bash
git add app/(customer)/track/
git commit -m "feat: add booking status tracker page"
```

---

## Task 15: Final checks

- [ ] **Step 1: Run all tests**

```bash
npm test
```
Expected: PASS — price calculation tests (4 tests).

- [ ] **Step 2: TypeScript check**

```bash
npx tsc --noEmit
```
Expected: No errors.

- [ ] **Step 3: Lint**

```bash
npm run lint
```
Expected: No errors.

- [ ] **Step 4: Production build**

```bash
npm run build
```
Expected: Build succeeds. Check output for any warnings.

- [ ] **Step 5: Smoke test all 3 customer pages**

```bash
npm run dev
```

- `/` — booking form loads, dropdowns work, price updates live
- Fill in all fields, submit → redirected to `/confirm/TAX-20260001`
- `/confirm/TAX-20260001` — confirmation page renders
- `/track/TAX-20260001` — tracker renders with "Assigned" status and driver card

- [ ] **Step 6: Final commit**

```bash
git add -A
git commit -m "chore: customer portal complete — all pages, tests, build passing"
```

---

## Self-Review

### Spec coverage
- [x] All booking form fields: pickup/dropoff (cascading), date, time, passengers, luggage, VIP, round trip, extras (5 pills), payment type, ID/passport (optional), notes (optional)
- [x] Live price summary sidebar — updates on every form change
- [x] Price correctly uses `round_trip_price` when round trip selected
- [x] Confirmation page with booking ref, route, date, payment details, email notice
- [x] Tracking page with status steps, driver info (name, phone, vehicle), GPS link when available
- [x] Mock layer with 6 Cyprus routes and 5 extras — works without backend
- [x] API layer ready to swap to real endpoints (set `NEXT_PUBLIC_USE_MOCK=false`)

### Not in this plan (later plans)
- Stripe Elements integration (requires backend PaymentIntent endpoint)
- Admin panel (Plan: `2026-04-30-frontend-admin-panel.md`)
- Driver panel (Plan: `2026-04-30-frontend-driver-panel.md`)
- NestJS backend (Plan: `2026-04-30-backend-api.md`)
