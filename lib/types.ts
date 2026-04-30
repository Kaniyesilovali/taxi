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
