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
