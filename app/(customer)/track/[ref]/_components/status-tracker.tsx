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
    <div className="space-y-6">
      <div>
        <Badge variant={booking.status} className="px-3 py-1 text-sm">
          {STATUS_LABELS[booking.status]}
        </Badge>
      </div>

      {booking.status !== 'cancelled' && (
        <div className="flex items-center">
          {STATUS_STEPS.map((step, i) => (
            <div key={step} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-1">
                <div
                  className={`flex size-8 items-center justify-center rounded-full text-xs font-semibold ${
                    i <= currentIndex ? 'bg-zinc-900 text-white' : 'bg-zinc-200 text-zinc-500'
                  }`}
                >
                  {i + 1}
                </div>
                <span className="hidden text-xs text-zinc-500 sm:block whitespace-nowrap">
                  {STATUS_LABELS[step].split(' ')[0]}
                </span>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div
                  className={`h-0.5 flex-1 mx-2 ${i < currentIndex ? 'bg-zinc-900' : 'bg-zinc-200'}`}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {booking.driver ? (
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-zinc-900">Your Driver</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100">
                <Car className="size-5 text-zinc-600" />
              </div>
              <div>
                <p className="font-medium text-zinc-900">{booking.driver.name}</p>
                <p className="text-sm text-zinc-500">{booking.driver.vehicle_info}</p>
              </div>
            </div>
            <a
              href={`tel:${booking.driver.phone}`}
              className="flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
            >
              <Phone className="size-4" />
              {booking.driver.phone}
            </a>
            {booking.driver.google_maps_link && (
              <a
                href={booking.driver.google_maps_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                <MapPin className="size-4" />
                Track Live Location
                <ExternalLink className="size-3" />
              </a>
            )}
          </div>
        </div>
      ) : booking.status === 'pending' ? (
        <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800">
          Your booking is confirmed. We&apos;re assigning a driver and will notify you by SMS.
        </div>
      ) : null}
    </div>
  )
}
