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

  const { baseAmount, total } = calculatePrice({
    basePrice: route?.base_price ?? 0,
    roundTripPrice: route?.round_trip_price ?? 0,
    isRoundTrip,
    extras: extrasWithPrices.map(e => ({ price: e.price, quantity: e.quantity })),
  })

  return (
    <div className="rounded-2xl bg-night p-7 text-white shadow-xl">
      <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
        Price Summary
      </p>

      {!route ? (
        <div className="py-6">
          <p className="font-display text-6xl font-light italic text-white/15">€—</p>
          <p className="mt-4 text-sm text-white/30">Select a route to see pricing</p>
        </div>
      ) : (
        <>
          <div className="mb-5 space-y-2.5 text-sm">
            <div className="flex justify-between gap-4">
              <span className="text-white/50">
                {route.name}
                {isRoundTrip ? ' (Return)' : ' (One Way)'}
              </span>
              <span className="shrink-0 text-white">€{baseAmount.toFixed(2)}</span>
            </div>
            {isVip && (
              <div className="flex justify-between text-white/50">
                <span>VIP Service</span>
                <span className="text-white">Included</span>
              </div>
            )}
            {extrasWithPrices.map(e => (
              <div key={e.id} className="flex justify-between text-white/50">
                <span>
                  {e.name} × {e.quantity}
                </span>
                <span className="text-white">€{(e.price * e.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="mb-7 h-px bg-white/10" />

          <div className="mb-8">
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white/30">
              Total
            </p>
            <p className="font-display text-6xl font-light italic leading-none text-gold">
              €{total.toFixed(2)}
            </p>
          </div>

          <Button type="submit" className="w-full" size="lg" loading={submitting}>
            Book Now
          </Button>

          <p className="mt-4 text-center text-xs text-white/25">
            Confirmation sent by email &amp; SMS
          </p>
        </>
      )}
    </div>
  )
}
