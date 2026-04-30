import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Calendar, MapPin, Users, CreditCard } from 'lucide-react'
import { Card } from '@/components/ui/card'
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
