import { calculatePrice } from '@/lib/price'

describe('calculatePrice', () => {
  test('returns base_price for one-way with no extras', () => {
    const result = calculatePrice({ basePrice: 45, roundTripPrice: 80, isRoundTrip: false, extras: [] })
    expect(result).toEqual({ baseAmount: 45, extrasAmount: 0, total: 45 })
  })

  test('uses round_trip_price when isRoundTrip is true', () => {
    const result = calculatePrice({ basePrice: 45, roundTripPrice: 80, isRoundTrip: true, extras: [] })
    expect(result).toEqual({ baseAmount: 80, extrasAmount: 0, total: 80 })
  })

  test('sums extras with quantities', () => {
    const result = calculatePrice({
      basePrice: 45,
      roundTripPrice: 80,
      isRoundTrip: false,
      extras: [
        { price: 10, quantity: 2 },
        { price: 35, quantity: 1 },
      ],
    })
    expect(result).toEqual({ baseAmount: 45, extrasAmount: 55, total: 100 })
  })

  test('returns zero total when no route selected (basePrice 0)', () => {
    const result = calculatePrice({ basePrice: 0, roundTripPrice: 0, isRoundTrip: false, extras: [] })
    expect(result).toEqual({ baseAmount: 0, extrasAmount: 0, total: 0 })
  })
})
