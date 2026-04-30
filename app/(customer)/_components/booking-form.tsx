'use client'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Toggle } from '@/components/ui/toggle'
import { PillToggle } from '@/components/ui/pill-toggle'
import { CounterInput } from '@/components/ui/counter-input'
import { RouteSelector } from './route-selector'
import { PriceSummary } from './price-summary'
import { createBooking } from '@/lib/api/bookings'
import type { Extra, Route } from '@/lib/types'

const schema = z.object({
  route_id: z.string().min(1, 'Select a destination'),
  is_round_trip: z.boolean(),
  date: z.string().min(1, 'Select a date'),
  time: z.string().min(1, 'Select a time'),
  passenger_count: z.number().min(1).max(8),
  luggage_count: z.number().min(0).max(10),
  is_vip: z.boolean(),
  customer_name: z.string().min(1, 'First name required'),
  customer_surname: z.string().min(1, 'Last name required'),
  customer_email: z.string().email('Valid email required'),
  customer_phone: z.string().min(7, 'Valid phone required'),
  customer_id_passport: z.string().optional(),
  extras: z.array(z.object({ extra_id: z.string(), quantity: z.number().min(1) })),
  payment_type: z.enum(['cash', 'online']),
  notes: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

interface BookingFormProps {
  routes: Route[]
  extras: Extra[]
}

export function BookingForm({ routes, extras }: BookingFormProps) {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    watch,
    control,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      is_round_trip: false,
      is_vip: false,
      passenger_count: 1,
      luggage_count: 1,
      extras: [],
      payment_type: 'cash',
    },
  })

  const watchedValues = watch()
  const selectedRoute = routes.find(r => r.id === watchedValues.route_id) ?? null

  function toggleExtra(extraId: string) {
    const current = watchedValues.extras
    const exists = current.some(e => e.extra_id === extraId)
    setValue(
      'extras',
      exists ? current.filter(e => e.extra_id !== extraId) : [...current, { extra_id: extraId, quantity: 1 }]
    )
  }

  async function onSubmit(values: FormValues) {
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await createBooking({
        ...values,
        customer_id_passport: values.customer_id_passport ?? '',
        notes: values.notes ?? '',
      })
      router.push(`/confirm/${result.booking_ref}`)
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Booking failed. Please try again.')
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Book Your Transfer</h1>
          <p className="mt-2 text-zinc-500">Cyprus airport transfers — fixed prices, no surprises</p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
          <div className="space-y-6">

            {/* Route & Date */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Route &amp; Date</h2>
              <div className="space-y-4">
                <Controller
                  name="route_id"
                  control={control}
                  render={({ field }) => (
                    <RouteSelector
                      routes={routes}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.route_id?.message}
                    />
                  )}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Date"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    {...register('date')}
                    error={errors.date?.message}
                  />
                  <Input
                    label="Time"
                    type="time"
                    required
                    {...register('time')}
                    error={errors.time?.message}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Controller
                    name="passenger_count"
                    control={control}
                    render={({ field }) => (
                      <CounterInput
                        label="Passengers"
                        value={field.value}
                        min={1}
                        max={8}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    name="luggage_count"
                    control={control}
                    render={({ field }) => (
                      <CounterInput
                        label="Luggage pieces"
                        value={field.value}
                        min={0}
                        max={10}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </div>
            </section>

            {/* Trip Options */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Trip Options</h2>
              <div className="space-y-4">
                <Controller
                  name="is_round_trip"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="Round Trip"
                      description="Include a return journey at a discounted rate"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
                <Controller
                  name="is_vip"
                  control={control}
                  render={({ field }) => (
                    <Toggle
                      label="VIP Service"
                      description="Premium vehicle, complimentary water, priority service"
                      checked={field.value}
                      onChange={field.onChange}
                    />
                  )}
                />
              </div>
            </section>

            {/* Extras */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Extras</h2>
              <div className="flex flex-wrap gap-2">
                {extras.map(extra => (
                  <PillToggle
                    key={extra.id}
                    label={`${extra.name} — €${extra.price}`}
                    selected={watchedValues.extras.some(e => e.extra_id === extra.id)}
                    onToggle={() => toggleExtra(extra.id)}
                  />
                ))}
              </div>
            </section>

            {/* Personal Info */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Your Details</h2>
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="First name"
                    required
                    autoComplete="given-name"
                    {...register('customer_name')}
                    error={errors.customer_name?.message}
                  />
                  <Input
                    label="Last name"
                    required
                    autoComplete="family-name"
                    {...register('customer_surname')}
                    error={errors.customer_surname?.message}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Input
                    label="Email"
                    type="email"
                    required
                    autoComplete="email"
                    {...register('customer_email')}
                    error={errors.customer_email?.message}
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder="+357 99 000000"
                    {...register('customer_phone')}
                    error={errors.customer_phone?.message}
                  />
                </div>
                <Input
                  label="ID / Passport number"
                  {...register('customer_id_passport')}
                />
                <Textarea
                  label="Notes"
                  placeholder="Flight number, special requests..."
                  {...register('notes')}
                />
              </div>
            </section>

            {/* Payment */}
            <section className="rounded-xl border border-zinc-200 bg-white p-6">
              <h2 className="mb-4 font-semibold text-zinc-900">Payment</h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {(['cash', 'online'] as const).map(type => (
                  <label
                    key={type}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border-2 p-4 transition-colors ${
                      watchedValues.payment_type === type
                        ? 'border-zinc-900 bg-zinc-50'
                        : 'border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <input
                      type="radio"
                      value={type}
                      className="sr-only"
                      {...register('payment_type')}
                    />
                    <div>
                      <p className="font-medium capitalize text-zinc-900">{type}</p>
                      <p className="text-xs text-zinc-500">
                        {type === 'cash' ? 'Pay the driver on arrival' : 'Secure online payment via Stripe'}
                      </p>
                    </div>
                  </label>
                ))}
              </div>
            </section>

            {submitError && (
              <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {submitError}
              </div>
            )}
          </div>

          {/* Sticky price sidebar */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <PriceSummary
              route={selectedRoute}
              isRoundTrip={watchedValues.is_round_trip}
              isVip={watchedValues.is_vip}
              extras={watchedValues.extras}
              allExtras={extras}
              submitting={submitting}
            />
          </div>
        </div>
      </div>
    </form>
  )
}
