import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Calendar, MapPin, Users, CreditCard } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getBookingConfirmation } from '@/lib/api/bookings'

interface Props {
  params: Promise<{ ref: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ref } = await params
  return {
    title: `Booking Confirmed — ${ref}`,
    description: `Your Taxsi airport transfer booking ${ref} is confirmed.`,
    robots: { index: false, follow: false },
  }
}

export default async function ConfirmPage({ params }: Props) {
  const { ref } = await params
  const booking = await getBookingConfirmation(ref)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-night py-16 text-center">
        <div className="mx-auto max-w-2xl px-4 sm:px-6">
          <div
            className="mx-auto mb-8 flex size-20 items-center justify-center rounded-full border border-gold/20 bg-gold/10"
            style={{ animation: 'fade-in 0.6s ease both' }}
          >
            <CheckCircle className="size-10 text-gold" />
          </div>
          <h1
            className="font-display text-4xl font-light italic text-white sm:text-5xl"
            style={{ animation: 'slide-up 0.7s ease both 0.1s' }}
          >
            You&apos;re all set!
          </h1>
          <p
            className="mt-3 text-base text-white/50"
            style={{ animation: 'fade-in 0.7s ease both 0.3s' }}
          >
            Confirmation sent to{' '}
            <span className="text-white">{booking.customer_email}</span>
          </p>
        </div>
      </div>

      {/* Details */}
      <div className="bg-sand">
        <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
          <div className="rounded-2xl border border-warm bg-cream p-8 shadow-sm">
            {/* Reference */}
            <div className="mb-8 flex items-start justify-between gap-4 border-b border-warm pb-8">
              <div>
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-clay">
                  Booking Reference
                </p>
                <p className="font-display text-4xl font-light italic text-ink">
                  {booking.booking_ref}
                </p>
              </div>
              <Badge variant="pending">Pending</Badge>
            </div>

            {/* Details */}
            <div className="space-y-5 text-sm">
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
                      year: 'numeric',
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
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                    Passengers
                  </p>
                  <p className="font-medium text-ink">{booking.passenger_count}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sand">
                  <CreditCard className="size-4 text-clay" />
                </div>
                <div>
                  <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay">
                    Payment
                  </p>
                  <p className="font-medium capitalize text-ink">
                    {booking.payment_type} —{' '}
                    <span className="font-display text-xl italic text-gold">
                      €{booking.total_amount.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTAs */}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Link
              href={`/track/${booking.booking_ref}`}
              className="flex h-12 flex-1 items-center justify-center rounded-xl bg-gold text-sm font-semibold text-ink transition-colors hover:bg-gold-dark"
            >
              Track your booking
            </Link>
            <Link
              href="/"
              className="flex h-12 flex-1 items-center justify-center rounded-xl border border-warm bg-cream text-sm font-medium text-clay transition-colors hover:bg-sand"
            >
              Book another transfer
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
