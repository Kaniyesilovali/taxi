'use client'
import { useState, useEffect } from 'react'
import { Select } from '@/components/ui/select'
import { ArrowLeftRight } from 'lucide-react'
import type { Route } from '@/lib/types'

interface RouteSelectorProps {
  routes: Route[]
  value: string
  onChange: (routeId: string) => void
  error?: string
}

export function RouteSelector({ routes, value, onChange, error }: RouteSelectorProps) {
  const [selectedPickup, setSelectedPickup] = useState('')

  const pickups = [...new Set(routes.map(r => r.pickup_location))].sort()
  const dropoffOptions = routes
    .filter(r => r.pickup_location === selectedPickup)
    .map(r => ({ value: r.id, label: r.dropoff_location }))

  useEffect(() => {
    if (value) {
      const route = routes.find(r => r.id === value)
      if (route) setSelectedPickup(route.pickup_location)
    }
  }, [value, routes])

  function handlePickupChange(pickup: string) {
    setSelectedPickup(pickup)
    onChange('')
  }

  return (
    <div className="grid items-end gap-3 sm:grid-cols-[1fr_auto_1fr]">
      <Select
        label="Pickup"
        required
        placeholder="Select pickup"
        value={selectedPickup}
        onChange={e => handlePickupChange(e.target.value)}
        options={pickups.map(p => ({ value: p, label: p }))}
      />
      <div className="hidden sm:flex items-center justify-center pb-2.5">
        <div className="flex size-9 items-center justify-center rounded-full border border-warm bg-sand text-clay">
          <ArrowLeftRight className="size-4" />
        </div>
      </div>
      <Select
        label="Dropoff"
        required
        placeholder={selectedPickup ? 'Select destination' : 'Select pickup first'}
        value={value}
        onChange={e => onChange(e.target.value)}
        options={dropoffOptions}
        disabled={!selectedPickup}
        error={error}
      />
    </div>
  )
}
