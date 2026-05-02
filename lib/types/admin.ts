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
