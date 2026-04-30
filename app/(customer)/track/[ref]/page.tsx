import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Luggage, MapPin, Users } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { getBookingTracking } from '@/lib/api/bookings'
import { StatusTracker } from './_components/status-tracker'

interface Props {
  params: Promise<{ ref: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params
  return {
    title: `Track Booking — ${ref}`,
    description: `Track the live status of your Taxsi airport transfer booking ${ref}.`,
    robots: { index: false, follow: false },
  }
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
