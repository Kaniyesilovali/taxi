interface PriceParams {
  basePrice: number
  roundTripPrice: number
  isRoundTrip: boolean
  extras: { price: number; quantity: number }[]
}

interface PriceResult {
  baseAmount: number
  extrasAmount: number
  total: number
}

export function calculatePrice(params: PriceParams): PriceResult {
  const baseAmount = params.isRoundTrip ? params.roundTripPrice : params.basePrice
  const extrasAmount = params.extras.reduce((sum, e) => sum + e.price * e.quantity, 0)
  return { baseAmount, extrasAmount, total: baseAmount + extrasAmount }
}
