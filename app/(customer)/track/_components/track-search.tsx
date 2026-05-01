'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function TrackSearch() {
  const router = useRouter()
  const [ref, setRef] = useState('')

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = ref.trim().toUpperCase()
    if (trimmed) router.push(`/track/${trimmed}`)
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-warm bg-cream p-6 shadow-sm">
      <Input
        label="Booking Reference"
        required
        placeholder="e.g. TXS-ABC123"
        value={ref}
        onChange={e => setRef(e.target.value)}
        autoComplete="off"
        autoFocus
      />
      <Button
        type="submit"
        size="lg"
        className="mt-4 w-full"
        disabled={!ref.trim()}
      >
        Track My Booking
      </Button>
    </form>
  )
}
