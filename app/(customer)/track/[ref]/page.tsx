import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { Calendar, Luggage, MapPin, Users } from 'lucide-react'
import { getBookingTracking } from '@/lib/api/bookings'
import { StatusTracker } from './_components/status-tracker'

interface Props {
  params: Promise<{ ref: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params
  return {
    title: `Track Your Booking — ${ref}`,
    description: `Track the live status of your Taxsi Cyprus airport transfer. Booking reference: ${ref}.`,
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
    <div>
      {/* Hero */}
      <div className="bg-night py-14">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
            Booking Status
          </p>
          <h1 className="font-display text-4xl font-light italic text-white sm:text-5xl">
            Track Your Booking
          </h1>
          <p className="mt-2 text-base text-white/50">
            {booking.customer_name} {booking.customer_surname} &middot;{' '}
            <span className="font-medium text-white/70">{booking.booking_ref}</span>
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="bg-sand">
        <div className="mx-auto max-w-2xl space-y-5 px-4 py-10 sm:px-6">
          <StatusTracker booking={booking} />

          {/* Trip Details */}
          <div className="rounded-2xl border border-warm bg-cream p-6 shadow-sm">
            <h3 className="mb-5 font-display text-xl font-semibold text-ink">Trip Details</h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sand">
                  <MapPin className="size-4 text-clay" />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                    Route
                  </p>
                  <p className="font-medium text-ink">{booking.pickup_location}</p>
                  <p className="my-1 text-clay">→</p>
                  <p className="font-medium text-ink">{booking.dropoff_location}</p>
                  {booking.is_round_trip && (
                    <span className="mt-1.5 inline-block rounded-full bg-gold-pale px-2.5 py-0.5 text-xs font-medium text-clay">
                      Round Trip
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sand">
                  <Calendar className="size-4 text-clay" />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                    Date &amp; Time
                  </p>
                  <p className="font-medium text-ink">
                    {new Date(booking.date).toLocaleDateString('en-CY', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}{' '}
                    at {booking.time}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sand">
                  <Users className="size-4 text-clay" />
                </div>
                <span className="text-clay">
                  {booking.passenger_count} passenger{booking.passenger_count !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sand">
                  <Luggage className="size-4 text-clay" />
                </div>
                <span className="text-clay">
                  {booking.luggage_count} luggage piece{booking.luggage_count !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
