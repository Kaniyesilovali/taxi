# Taxsi Platform — Design Specification

**Date:** 2026-04-28  
**Stack:** Next.js 16 + NestJS + PostgreSQL  
**Region:** Cyprus

---

## 1. Overview

Taxsi is a fixed route-based taxi booking platform for Cyprus. Customers book transfers via a public website; an admin manually assigns a driver; the driver completes the ride. Pricing is per predefined route — no distance calculation.

**Core flow:** Customer books → Admin assigns driver + vehicle → Driver completes ride.

---

## 2. Architecture

### Approach
Single Next.js app (route groups) + NestJS REST API + PostgreSQL. One repo, two top-level folders: `frontend/` and `backend/`.

The NestJS API is structured to be consumed by a future mobile app without changes.

### Repo layout

```
taxsi/
├── frontend/                        # Next.js 16 app
│   └── app/
│       ├── (customer)/              # Public, no auth
│       │   ├── page.tsx             # Booking form
│       │   ├── confirm/[ref]/page.tsx
│       │   └── track/[ref]/page.tsx
│       ├── (admin)/                 # JWT protected, AdminGuard
│       │   ├── admin/login/page.tsx
│       │   ├── admin/dashboard/page.tsx
│       │   ├── admin/bookings/page.tsx
│       │   ├── admin/bookings/[id]/page.tsx
│       │   ├── admin/routes/page.tsx
│       │   ├── admin/extras/page.tsx
│       │   ├── admin/drivers/page.tsx
│       │   └── admin/revenue/page.tsx
│       └── (driver)/                # JWT protected, DriverGuard
│           ├── driver/login/page.tsx
│           └── driver/bookings/page.tsx
└── backend/                         # NestJS
    └── src/
        ├── auth/
        ├── bookings/
        ├── routes/
        ├── extras/
        ├── drivers/
        ├── payments/
        ├── notifications/
        └── statistics/
```

### Booking status lifecycle

```
PENDING → ASSIGNED → IN_PROGRESS → COMPLETED
                   ↘ CANCELLED (admin only)
```

---

## 3. Database Schema

### `admins`
| Column | Type |
|---|---|
| id | UUID PK |
| name | VARCHAR |
| email | VARCHAR UNIQUE |
| password_hash | VARCHAR |
| created_at | TIMESTAMP |

### `drivers`
| Column | Type |
|---|---|
| id | UUID PK |
| name | VARCHAR |
| surname | VARCHAR |
| email | VARCHAR UNIQUE |
| phone | VARCHAR |
| password_hash | VARCHAR |
| status | ENUM(active, inactive) |
| created_at | TIMESTAMP |

### `routes`
| Column | Type |
|---|---|
| id | UUID PK |
| name | VARCHAR |
| pickup_location | VARCHAR |
| dropoff_location | VARCHAR |
| base_price | DECIMAL(10,2) |
| round_trip_price | DECIMAL(10,2) |
| is_active | BOOLEAN |
| created_at | TIMESTAMP |

### `extras`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| name | VARCHAR | Child Seat, Flower, Fruit Plate, Dessert Plate, Champagne |
| price | DECIMAL(10,2) | |
| is_active | BOOLEAN | |

### `bookings`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| booking_ref | VARCHAR UNIQUE | Format: TAX-YYYYNNNN |
| customer_name | VARCHAR | |
| customer_surname | VARCHAR | |
| customer_email | VARCHAR | |
| customer_phone | VARCHAR | |
| customer_id_passport | VARCHAR nullable | |
| route_id | UUID FK → routes | |
| is_round_trip | BOOLEAN | |
| date | DATE | |
| time | TIME | |
| passenger_count | INT | |
| luggage_count | INT | |
| is_vip | BOOLEAN | |
| notes | TEXT nullable | |
| payment_type | ENUM(cash, online) | |
| payment_status | ENUM(pending, paid, failed, refunded) | |
| stripe_payment_intent_id | VARCHAR nullable | |
| base_amount | DECIMAL(10,2) | Route price snapshot |
| extras_amount | DECIMAL(10,2) | |
| total_amount | DECIMAL(10,2) | |
| commission_rate | DECIMAL(5,2) | 5.00 or 15.00 — stored at booking time |
| commission_amount | DECIMAL(10,2) | |
| driver_amount | DECIMAL(10,2) | total - commission |
| status | ENUM(pending, assigned, in_progress, completed, cancelled) | |
| driver_id | UUID FK → drivers nullable | |
| vehicle_info | VARCHAR nullable | Admin sets when assigning |
| google_maps_link | VARCHAR nullable | Driver adds |
| assigned_at | TIMESTAMP nullable | |
| completed_at | TIMESTAMP nullable | |
| created_at | TIMESTAMP | |
| updated_at | TIMESTAMP | |

### `booking_extras`
| Column | Type | Notes |
|---|---|---|
| id | UUID PK | |
| booking_id | UUID FK → bookings | |
| extra_id | UUID FK → extras | |
| quantity | INT | |
| unit_price | DECIMAL(10,2) | Price snapshot at booking time |

---

## 4. NestJS API

Base URL: `/api/v1`

### Auth module
| Method | Endpoint | Access |
|---|---|---|
| POST | /auth/admin/login | Public |
| POST | /auth/driver/login | Public |
| POST | /auth/admin/refresh | Public |
| POST | /auth/driver/refresh | Public |

JWT access tokens (15 min) + refresh tokens (7 days). Separate guards: `AdminGuard`, `DriverGuard`.

### Bookings module
| Method | Endpoint | Access |
|---|---|---|
| POST | /bookings | Public — customer creates |
| GET | /bookings/track/:ref | Public — customer tracking |
| GET | /bookings | Admin |
| GET | /bookings/:id | Admin / Driver |
| PATCH | /bookings/:id/assign | Admin — sets driver_id + vehicle_info |
| PATCH | /bookings/:id/status | Driver — in_progress / completed |
| PATCH | /bookings/:id/tracking | Driver — adds google_maps_link |
| PATCH | /bookings/:id/cancel | Admin |
| GET | /bookings/driver/mine | Driver — own assigned bookings |

### Routes module
| Method | Endpoint | Access |
|---|---|---|
| GET | /routes | Public |
| GET | /routes/:id | Public |
| POST | /routes | Admin |
| PATCH | /routes/:id | Admin |
| DELETE | /routes/:id | Admin |

### Extras module
| Method | Endpoint | Access |
|---|---|---|
| GET | /extras | Public |
| POST | /extras | Admin |
| PATCH | /extras/:id | Admin |
| DELETE | /extras/:id | Admin |

### Drivers module
| Method | Endpoint | Access |
|---|---|---|
| GET | /drivers | Admin |
| GET | /drivers/:id | Admin |
| POST | /drivers | Admin — creates driver account |
| PATCH | /drivers/:id | Admin |
| DELETE | /drivers/:id | Admin |

Drivers do not self-register. Admin creates all driver accounts.

### Payments module
| Method | Endpoint | Access |
|---|---|---|
| POST | /payments/intent | Public — create Stripe PaymentIntent |
| POST | /payments/webhook | Public — Stripe webhook (signature verified) |

Commission logic:
- `payment_type = online` → commission_rate = 15%
- `payment_type = cash` → commission_rate = 5%
- Both rates stored per-booking at creation time.

### Statistics module
| Method | Endpoint | Access |
|---|---|---|
| GET | /stats/revenue | Admin |
| GET | /stats/bookings | Admin |

Revenue endpoint supports `?from=&to=&payment_type=` filters.

### Notifications
No HTTP endpoints. Fires as side effects inside the bookings service:
- **Booking created** → customer email + SMS confirmation with booking ref
- **Driver assigned** → customer email + SMS with driver name, phone, vehicle
- **Status → IN_PROGRESS** → customer SMS "Your driver is on the way"
- **Status → COMPLETED** → customer email + SMS receipt

Email provider: SendGrid. SMS provider: Twilio.

---

## 5. Customer Portal

Three pages, no authentication required.

### Page 1 — Booking Form (`/`)
Fields:
- Pickup location (dropdown from active routes)
- Dropoff location (dropdown filtered by pickup)
- First name, surname
- Email, phone
- ID / Passport number (optional)
- Date, time
- Passenger count, luggage count
- VIP (yes/no toggle)
- Round trip (yes/no toggle) — uses `round_trip_price` from route
- Extras (pill toggles): Child Seat, Flower, Fruit Plate, Dessert Plate, Champagne
- Payment type: Cash / Online (Stripe)
- Notes (optional textarea)
- Live price summary before submit

For online payment: Stripe Elements embedded on page, PaymentIntent created on "Book Now" click.

### Page 2 — Booking Confirmed (`/confirm/[ref]`)
- Large booking reference (TAX-YYYYNNNN)
- Trip summary
- Confirmation that email + SMS sent
- Link to tracking page

### Page 3 — Booking Tracker (`/track/[ref]`)
- Enter booking ref or arrive via direct link
- Shows current status badge
- If ASSIGNED or later: driver name, phone, vehicle info
- If driver has added google_maps_link: "Track Live Location →" button opens Maps

---

## 6. Admin Panel

Protected by AdminGuard. Sidebar layout with 6 sections.

### Dashboard (`/admin/dashboard`)
- Stat cards: Pending, Assigned, Completed (today/month), Revenue (month)
- Recent bookings table with inline "Assign" action for pending bookings

### Bookings (`/admin/bookings`)
- Full table with filters (status, date range, payment type, driver)
- Row actions: View, Assign, Cancel
- **Assign Driver modal**: booking summary + driver dropdown + vehicle info field

### Routes (`/admin/routes`)
- Table of all routes with prices
- Create/edit form: name, pickup, dropoff, base price, round trip price, active toggle
- Delete with confirmation

### Extras (`/admin/extras`)
- Table: name, price, active status
- Create/edit/delete

### Drivers (`/admin/drivers`)
- Table: name, email, phone, status, assigned booking count
- Create driver (generates credentials, emails driver login details)
- Edit, deactivate

### Revenue (`/admin/revenue`)
- Date range picker
- Totals: gross revenue, platform commission, driver payouts
- Breakdown by payment type (cash vs online)
- Breakdown by route
- Breakdown by driver

---

## 7. Driver Panel

Protected by DriverGuard. Drivers cannot self-register — admin creates accounts.

### Login (`/driver/login`)
- Email + password

### My Bookings (`/driver/bookings`)
- List of assigned bookings sorted by date/time
- Each card shows: booking ref, route, time, customer name + phone, passenger/luggage count, VIP flag, extras, vehicle, payment type + amount
- Actions per card:
  - **Add GPS Link** → modal to paste Google Maps live sharing URL
  - **Start Ride** → changes status to IN_PROGRESS
  - **Complete** (shown when IN_PROGRESS) → changes status to COMPLETED
- Completed bookings shown below with muted styling

---

## 8. Payment & Commission

| Payment type | Commission rate | Who pays |
|---|---|---|
| Online (Stripe) | 15% | Charged at booking via Stripe |
| Cash | 5% | Tracked in system; driver collects cash, fee reconciled manually |

Commission amounts stored per-booking at creation time. Changing the rate does not affect past bookings.

Stripe flow (online payments):
1. Customer submits booking form — `POST /bookings` creates the booking record immediately with `payment_status = pending` and returns `booking_ref`
2. Frontend calls `POST /payments/intent` with the booking id → receives Stripe `client_secret`
3. Stripe Elements confirms payment on frontend
4. Stripe webhook fires `payment_intent.succeeded` → backend updates `payment_status = paid`
5. Notifications fire (booking confirmed email + SMS)

Cash flow: booking created immediately with `payment_status = pending`. Status stays pending — cash is collected by the driver on arrival.

Cash commission (5%): recorded as `commission_amount` in the booking for reporting purposes. Not automatically collected — tracked for admin revenue reconciliation only.

---

## 9. Tech Stack Summary

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, TypeScript |
| Backend | NestJS, TypeORM, class-validator |
| Database | PostgreSQL |
| Auth | JWT (access + refresh), bcrypt |
| Payments | Stripe |
| Email | SendGrid |
| SMS | Twilio |
| ORM | TypeORM with migrations |

---

## 10. Out of Scope (MVP)

- Customer accounts / login (guest booking only)
- Real-time WebSocket updates (polling used instead)
- Mobile app (API is structured for it, not built yet)
- Driver earnings dashboard
- Multi-admin roles
- Promo codes / discounts
