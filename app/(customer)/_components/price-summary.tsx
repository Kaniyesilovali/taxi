import { Button } from '@/components/ui/button'
import { calculatePrice } from '@/lib/price'
import type { Extra, Route } from '@/lib/types'

interface PriceSummaryProps {
  route: Route | null
  isRoundTrip: boolean
  isVip: boolean
  extras: { extra_id: string; quantity: number }[]
  allExtras: Extra[]
  submitting: boolean
}

export function PriceSummary({
  route,
  isRoundTrip,
  isVip,
  extras,
  allExtras,
  submitting,
}: PriceSummaryProps) {
  const extrasWithPrices = extras
    .map(e => {
      const extra = allExtras.find(ex => ex.id === e.extra_id)
      return extra ? { ...extra, quantity: e.quantity } : null
    })
    .filter((e): e is Extra & { quantity: number } => e !== null)

  const { baseAmount, extrasAmount, total } = calculatePrice({
    basePrice: route?.base_price ?? 0,
    roundTripPrice: route?.round_trip_price ?? 0,
    isRoundTrip,
    extras: extrasWithPrices.map(e => ({ price: e.price, quantity: e.quantity })),
  })

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h3 className="mb-4 font-semibold text-zinc-900">Price Summary</h3>

      {!route ? (
        <p className="text-sm text-zinc-400">Select a route to see pricing</p>
      ) : (
        <>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-600">
                {route.name}
                {isRoundTrip ? ' (Round Trip)' : ' (One Way)'}
              </span>
              <span className="font-medium text-zinc-900">€{baseAmount.toFixed(2)}</span>
            </div>

            {isVip && (
              <div className="flex justify-between text-zinc-600">
                <span>VIP Service</span>
                <span>Included</span>
              </div>
            )}

            {extrasWithPrices.map(e => (
              <div key={e.id} className="flex justify-between text-zinc-600">
                <span>
                  {e.name} × {e.quantity}
                </span>
                <span>€{(e.price * e.quantity).toFixed(2)}</span>
              </div>
            ))}

            <div className="border-t border-zinc-200 pt-2 flex justify-between font-semibold text-zinc-900">
              <span>Total</span>
              <span>€{total.toFixed(2)}</span>
            </div>
          </div>

          <Button type="submit" className="mt-6 w-full" size="lg" loading={submitting}>
            Book Now
          </Button>

          <p className="mt-3 text-center text-xs text-zinc-400">
            Confirmation sent by email &amp; SMS
          </p>
        </>
      )}
    </div>
  )
}
