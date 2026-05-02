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
