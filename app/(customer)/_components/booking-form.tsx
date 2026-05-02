'use client'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { createBooking } from '@/lib/api/bookings'
import type { Extra, Route } from '@/lib/types'
import type { Dictionary } from '@/app/[lang]/dictionaries'
import { RouteSelector } from './route-selector'
import { PriceSummary } from './price-summary'
import {
  CounterField,
  ExtraChip,
  HairlineInput,
  HairlineTextarea,
  PaymentRadio,
  SwitchField,
} from './fields'
import { cn } from '@/lib/cn'

interface BookingFormProps {
  routes: Route[]
  extras: Extra[]
  t: Dictionary['book']
  optionalLabel: string
}

type FormValues = {
  route_id: string
  is_round_trip: boolean
  date: string
  time: string
  passenger_count: number
  luggage_count: number
  is_vip: boolean
  customer_name: string
  customer_surname: string
  customer_email: string
  customer_phone: string
  customer_id_passport: string
  extras: { extra_id: string; quantity: number }[]
  payment_type: 'cash' | 'online'
  notes: string
}

function buildSchema(v: Dictionary['book']['validation']) {
  return z.object({
    route_id: z.string().min(1, v.routeRequired),
    is_round_trip: z.boolean(),
    date: z.string().min(1, v.dateRequired),
    time: z.string().min(1, v.timeRequired),
    passenger_count: z.number().min(1).max(8),
    luggage_count: z.number().min(0).max(10),
    is_vip: z.boolean(),
    customer_name: z.string().min(1, v.firstNameRequired),
    customer_surname: z.string().min(1, v.lastNameRequired),
    customer_email: z.string().email(v.emailRequired),
    customer_phone: z.string().min(7, v.phoneRequired),
    customer_id_passport: z.string(),
    extras: z.array(z.object({ extra_id: z.string(), quantity: z.number().min(1) })),
    payment_type: z.enum(['cash', 'online']),
    notes: z.string(),
  })
}

const STEP_FIELDS: Array<Array<keyof FormValues>> = [
  ['route_id', 'date', 'time', 'passenger_count', 'luggage_count', 'is_round_trip'],
  ['is_vip', 'extras', 'payment_type'],
  ['customer_name', 'customer_surname', 'customer_email', 'customer_phone'],
]

export function BookingForm({ routes, extras, t, optionalLabel }: BookingFormProps) {
  const router = useRouter()
  const params = useSearchParams()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const initialFrom = params.get('from') ?? ''
  const initialTo = params.get('to') ?? ''
  const initialDate = params.get('date') ?? ''
  const initialPax = Number(params.get('pax') ?? '1') || 1
  const prefilledRouteId =
    initialFrom && initialTo
      ? routes.find(
          (r) => r.pickup_location === initialFrom && r.dropoff_location === initialTo
        )?.id ?? ''
      : ''

  const schema = buildSchema(t.validation)

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      route_id: prefilledRouteId,
      is_round_trip: false,
      date: initialDate,
      time: '',
      passenger_count: Math.max(1, Math.min(8, initialPax)),
      luggage_count: 1,
      is_vip: false,
      customer_name: '',
      customer_surname: '',
      customer_email: '',
      customer_phone: '',
      customer_id_passport: '',
      extras: [],
      payment_type: 'cash',
      notes: '',
    },
  })

  const watched = watch()
  const selectedRoute = routes.find((r) => r.id === watched.route_id) ?? null

  function toggleExtra(extraId: string) {
    const current = watched.extras
    const exists = current.some((e) => e.extra_id === extraId)
    setValue(
      'extras',
      exists
        ? current.filter((e) => e.extra_id !== extraId)
        : [...current, { extra_id: extraId, quantity: 1 }]
    )
  }

  async function next() {
    const ok = await trigger(STEP_FIELDS[step] as never)
    if (ok) setStep((s) => Math.min(2, s + 1))
  }

  function prev() {
    setStep((s) => Math.max(0, s - 1))
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
      setSubmitError(err instanceof Error ? err.message : t.validation.submitFailed)
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="bg-cream text-ink">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:py-24">
        <StepIndicator step={step} labels={t.steps.labels} ofWord={t.steps.of} />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_minmax(320px,380px)] lg:gap-16">
          <div className="min-h-[420px]">
            {step === 0 && (
              <StepWrap heading={t.route.heading}>
                <RouteSelector
                  routes={routes}
                  value={watched.route_id}
                  onChange={(id) => setValue('route_id', id, { shouldValidate: true })}
                  error={errors.route_id?.message}
                  t={t.route}
                />
                <div className="mt-10 grid gap-6 sm:grid-cols-2 sm:gap-8">
                  <HairlineInput
                    label={t.route.date}
                    type="date"
                    required
                    min={today}
                    {...register('date')}
                    error={errors.date?.message}
                  />
                  <HairlineInput
                    label={t.route.time}
                    type="time"
                    required
                    {...register('time')}
                    error={errors.time?.message}
                  />
                </div>
                <div className="mt-10 grid gap-8 sm:grid-cols-2">
                  <Controller
                    control={control}
                    name="passenger_count"
                    render={({ field }) => (
                      <CounterField
                        label={t.route.passengers}
                        value={field.value}
                        min={1}
                        max={8}
                        onChange={field.onChange}
                      />
                    )}
                  />
                  <Controller
                    control={control}
                    name="luggage_count"
                    render={({ field }) => (
                      <CounterField
                        label={t.route.luggage}
                        value={field.value}
                        min={0}
                        max={10}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
                <div className="mt-12 border-t border-clay/15 pt-2">
                  <Controller
                    control={control}
                    name="is_round_trip"
                    render={({ field }) => (
                      <SwitchField
                        label={t.route.roundTripLabel}
                        description={t.route.roundTripDesc}
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>
              </StepWrap>
            )}

            {step === 1 && (
              <StepWrap heading={t.vehicle.heading}>
                <div className="border-t border-clay/15">
                  <Controller
                    control={control}
                    name="is_vip"
                    render={({ field }) => (
                      <SwitchField
                        label={t.vehicle.vipLabel}
                        description={t.vehicle.vipDesc}
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    )}
                  />
                </div>

                <section className="mt-12">
                  <p className="eyebrow text-gold">{t.vehicle.extrasHeading}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    {extras.length === 0 ? (
                      <p className="text-sm text-clay/70">{t.vehicle.extrasNone}</p>
                    ) : (
                      extras.map((extra) => (
                        <ExtraChip
                          key={extra.id}
                          label={`${extra.name} · €${extra.price}`}
                          selected={watched.extras.some(
                            (e) => e.extra_id === extra.id
                          )}
                          onToggle={() => toggleExtra(extra.id)}
                        />
                      ))
                    )}
                  </div>
                </section>

                <section className="mt-14">
                  <p className="eyebrow text-gold">{t.vehicle.paymentHeading}</p>
                  <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Controller
                      control={control}
                      name="payment_type"
                      render={({ field }) => (
                        <>
                          <PaymentRadio
                            name="payment_type"
                            value="cash"
                            current={field.value}
                            onChange={field.onChange}
                            title={t.vehicle.paymentCash}
                            desc={t.vehicle.paymentCashDesc}
                          />
                          <PaymentRadio
                            name="payment_type"
                            value="online"
                            current={field.value}
                            onChange={field.onChange}
                            title={t.vehicle.paymentOnline}
                            desc={t.vehicle.paymentOnlineDesc}
                          />
                        </>
                      )}
                    />
                  </div>
                </section>
              </StepWrap>
            )}

            {step === 2 && (
              <StepWrap heading={t.details.heading}>
                <div className="grid gap-8 sm:grid-cols-2">
                  <HairlineInput
                    label={t.details.firstName}
                    required
                    autoComplete="given-name"
                    {...register('customer_name')}
                    error={errors.customer_name?.message}
                  />
                  <HairlineInput
                    label={t.details.lastName}
                    required
                    autoComplete="family-name"
                    {...register('customer_surname')}
                    error={errors.customer_surname?.message}
                  />
                  <HairlineInput
                    label={t.details.email}
                    type="email"
                    required
                    autoComplete="email"
                    {...register('customer_email')}
                    error={errors.customer_email?.message}
                  />
                  <HairlineInput
                    label={t.details.phone}
                    type="tel"
                    required
                    autoComplete="tel"
                    placeholder={t.details.phonePlaceholder}
                    {...register('customer_phone')}
                    error={errors.customer_phone?.message}
                  />
                </div>
                <div className="mt-10">
                  <HairlineInput
                    label={t.details.idPassport}
                    optional={optionalLabel}
                    {...register('customer_id_passport')}
                  />
                </div>
                <div className="mt-10">
                  <HairlineTextarea
                    label={t.details.notes}
                    optional={optionalLabel}
                    placeholder={t.details.notesPlaceholder}
                    {...register('notes')}
                  />
                </div>

                {submitError && (
                  <div className="mt-10 border border-red-200 bg-red-50/60 p-4 text-sm text-red-700">
                    {submitError}
                  </div>
                )}
              </StepWrap>
            )}

            <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-clay/15 pt-8">
              <button
                type="button"
                onClick={prev}
                disabled={step === 0}
                className={cn(
                  'inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] transition-colors',
                  step === 0
                    ? 'invisible'
                    : 'text-clay/70 hover:text-ink'
                )}
              >
                <ArrowLeft className="size-4" />
                {t.steps.back}
              </button>

              {step < 2 ? (
                <button
                  type="button"
                  onClick={next}
                  className="group inline-flex h-12 items-center gap-3 border border-night px-8 text-xs font-medium uppercase tracking-[0.28em] text-night transition-colors hover:bg-night hover:text-cream"
                >
                  {t.steps.continue}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="group inline-flex h-12 items-center gap-3 bg-night px-10 text-xs font-medium uppercase tracking-[0.28em] text-gold transition-colors hover:bg-gold hover:text-night disabled:opacity-60"
                >
                  {submitting && (
                    <span className="size-3 animate-spin rounded-full border border-current border-t-transparent" />
                  )}
                  {submitting ? t.steps.confirming : t.steps.confirm}
                </button>
              )}
            </div>
          </div>

          <div className="lg:sticky lg:top-24 lg:self-start">
            <PriceSummary
              route={selectedRoute}
              isRoundTrip={watched.is_round_trip}
              isVip={watched.is_vip}
              extras={watched.extras}
              allExtras={extras}
              t={t.summary}
            />
          </div>
        </div>
      </div>
    </form>
  )
}

function StepWrap({
  heading,
  children,
}: {
  heading: string
  children: React.ReactNode
}) {
  return (
    <section
      className="opacity-0"
      style={{ animation: 'reveal 600ms cubic-bezier(0.16,1,0.3,1) forwards' }}
    >
      <h2 className="font-display text-3xl font-light leading-tight text-ink sm:text-4xl">
        <span className="italic">{heading}</span>
      </h2>
      <span className="mt-6 mb-12 block h-px w-12 bg-gold" />
      {children}
    </section>
  )
}

function StepIndicator({
  step,
  labels,
  ofWord,
}: {
  step: number
  labels: { no: string; title: string }[]
  ofWord: string
}) {
  return (
    <ol className="grid grid-cols-3 gap-px overflow-hidden bg-clay/15">
      {labels.map((l, i) => {
        const isActive = i === step
        const isDone = i < step
        return (
          <li
            key={l.no}
            className={cn(
              'flex flex-col gap-1.5 bg-cream px-3 py-4 transition-colors sm:gap-2 sm:px-5 sm:py-5',
              isActive && 'bg-night text-cream'
            )}
          >
            <span
              className={cn(
                'kicker text-sm sm:text-base',
                isActive ? 'text-gold' : isDone ? 'text-gold/60' : 'text-clay/40'
              )}
            >
              {l.no}
              <span className="ml-1 hidden text-xs tracking-[0.3em] opacity-60 sm:inline">
                {ofWord} {labels.length}
              </span>
            </span>
            <span
              className={cn(
                'font-display text-sm font-light italic sm:text-lg',
                isActive ? 'text-cream' : isDone ? 'text-ink' : 'text-clay/60'
              )}
            >
              {l.title}
            </span>
          </li>
        )
      })}
    </ol>
  )
}
