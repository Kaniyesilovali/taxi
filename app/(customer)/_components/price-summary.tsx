import { calculatePrice } from '@/lib/price'
import type { Extra, Route } from '@/lib/types'
import type { Dictionary } from '@/app/[lang]/dictionaries'

interface PriceSummaryProps {
  route: Route | null
  isRoundTrip: boolean
  isVip: boolean
  extras: { extra_id: string; quantity: number }[]
  allExtras: Extra[]
  t: Dictionary['book']['summary']
}

export function PriceSummary({
  route,
  isRoundTrip,
  isVip,
  extras,
  allExtras,
  t,
}: PriceSummaryProps) {
  const extrasWithPrices = extras
    .map((e) => {
      const extra = allExtras.find((ex) => ex.id === e.extra_id)
      return extra ? { ...extra, quantity: e.quantity } : null
    })
    .filter((e): e is Extra & { quantity: number } => e !== null)

  const { baseAmount, total } = calculatePrice({
    basePrice: route?.base_price ?? 0,
    roundTripPrice: route?.round_trip_price ?? 0,
    isRoundTrip,
    extras: extrasWithPrices.map((e) => ({ price: e.price, quantity: e.quantity })),
  })

  return (
    <aside className="relative overflow-hidden bg-night text-white">
      <div className="grain absolute inset-0 opacity-[0.05]" aria-hidden />
      <div className="relative p-8 lg:p-9">
        <p className="eyebrow text-gold">{t.title}</p>
        <span className="mt-5 block h-px w-12 bg-gold" />

        {!route ? (
          <div className="mt-10">
            <p className="font-display text-6xl font-light italic leading-none text-white/15">
              €—
            </p>
            <p className="mt-6 max-w-xs text-sm text-white/40">{t.selectRoute}</p>
          </div>
        ) : (
          <>
            <div className="mt-8 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-white/10 pb-3">
                <span className="text-white/60">
                  {route.name}
                  <span className="block text-xs uppercase tracking-[0.2em] text-white/30">
                    {isRoundTrip ? t.return : t.oneWay}
                  </span>
                </span>
                <span className="shrink-0 font-display text-xl font-light text-white">
                  €{baseAmount.toFixed(2)}
                </span>
              </div>
              {isVip && (
                <div className="flex justify-between text-white/60">
                  <span>{t.vip}</span>
                  <span className="text-white">{t.included}</span>
                </div>
              )}
              {extrasWithPrices.map((e) => (
                <div key={e.id} className="flex justify-between text-white/60">
                  <span>
                    {e.name} × {e.quantity}
                  </span>
                  <span className="text-white">
                    €{(e.price * e.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <p className="eyebrow text-white/35">{t.totalLabel}</p>
              <p className="mt-2 font-display text-6xl font-light italic leading-none text-gold">
                €{total.toFixed(2)}
              </p>
            </div>

            <p className="mt-8 text-xs text-white/30">{t.confirmationNote}</p>
          </>
        )}
      </div>
    </aside>
  )
}
