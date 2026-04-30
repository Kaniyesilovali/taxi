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
    <div className="space-y-5">
      <div>
        <Badge variant={booking.status}>{STATUS_LABELS[booking.status]}</Badge>
      </div>

      {booking.status !== 'cancelled' && (
        <div className="rounded-2xl border border-warm bg-cream p-6 shadow-sm">
          <div className="flex items-center">
            {STATUS_STEPS.map((step, i) => (
              <div key={step} className="flex flex-1 items-center">
                <div className="flex flex-col items-center gap-2">
                  <div
                    className={`flex size-9 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                      i <= currentIndex
                        ? 'bg-gold text-ink shadow-sm'
                        : 'border-2 border-warm bg-cream text-clay'
                    }`}
                  >
                    {i + 1}
                  </div>
                  <span className="hidden whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-clay sm:block">
                    {STATUS_LABELS[step].split(' ')[0]}
                  </span>
                </div>
                {i < STATUS_STEPS.length - 1 && (
                  <div
                    className={`mx-2 mb-5 h-0.5 flex-1 transition-colors ${
                      i < currentIndex ? 'bg-gold' : 'bg-warm'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {booking.driver ? (
        <div className="rounded-2xl border border-warm bg-cream p-6 shadow-sm">
          <h3 className="mb-5 font-display text-xl font-semibold text-ink">Your Driver</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-2xl bg-night">
                <Car className="size-5 text-gold" />
              </div>
              <div>
                <p className="font-semibold text-ink">{booking.driver.name}</p>
                <p className="text-sm text-clay">{booking.driver.vehicle_info}</p>
              </div>
            </div>
            <a
              href={`tel:${booking.driver.phone}`}
              className="flex items-center gap-2 text-sm font-medium text-clay transition-colors hover:text-ink"
            >
              <Phone className="size-4 text-gold" />
              {booking.driver.phone}
            </a>
            {booking.driver.google_maps_link && (
              <a
                href={booking.driver.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-gold transition-colors hover:text-gold-dark"
              >
                <MapPin className="size-4" />
                Track Live Location
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      ) : booking.status === 'pending' ? (
        <div className="rounded-2xl border border-gold/20 bg-gold-pale p-5 text-sm text-clay">
          Your booking is confirmed. We&apos;re assigning a driver and will notify you by SMS.
        </div>
      ) : null}
    </div>
  )
}
