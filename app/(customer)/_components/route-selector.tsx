'use client'
import { useState } from 'react'
import type { Route } from '@/lib/types'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import { HairlineSelect } from './fields'

interface RouteSelectorProps {
  routes: Route[]
  value: string
  onChange: (routeId: string) => void
  error?: string
  t: Dictionary['book']['route']
}

export function RouteSelector({
  routes,
  value,
  onChange,
  error,
  t,
}: RouteSelectorProps) {
  const [pickup, setPickup] = useState(
    () => (value && routes.find((r) => r.id === value)?.pickup_location) || ''
  )

  const selectedPickup =
    pickup ||
    (value ? routes.find((r) => r.id === value)?.pickup_location ?? '' : '')

  const pickups = [...new Set(routes.map((r) => r.pickup_location))].sort()
  const dropoffs = routes
    .filter((r) => r.pickup_location === selectedPickup)
    .map((r) => ({ value: r.id, label: r.dropoff_location }))

  function handlePickupChange(p: string) {
    setPickup(p)
    onChange('')
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 sm:gap-8">
      <HairlineSelect
        label={t.pickup}
        required
        placeholder={t.selectPickup}
        value={selectedPickup}
        onChange={(e) => handlePickupChange(e.target.value)}
        options={pickups.map((p) => ({ value: p, label: p }))}
      />
      <HairlineSelect
        label={t.dropoff}
        required
        placeholder={selectedPickup ? t.selectDropoff : t.selectPickupFirst}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        options={dropoffs}
        disabled={!selectedPickup}
        error={error}
      />
    </div>
  )
}
