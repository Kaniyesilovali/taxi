import type { Route } from '@/lib/types'
import type { Locale, Dictionary } from '@/app/[lang]/dictionaries'

interface RoutePickerProps {
  lang: Locale
  routes: Route[]
  t: Dictionary['homepage']['hero']['picker']
}

export function RoutePicker({ lang, routes, t }: RoutePickerProps) {
  const pickups = Array.from(new Set(routes.map((r) => r.pickup_location)))
  const dropoffs = Array.from(new Set(routes.map((r) => r.dropoff_location)))

  return (
    <form
      action={`/${lang}/book`}
      method="get"
      className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-[1.2fr_1.2fr_1fr_0.8fr_auto] lg:items-end lg:gap-x-6"
    >
      <Field label={t.from} htmlFor="picker-from">
        <select
          id="picker-from"
          name="from"
          defaultValue=""
          className="w-full appearance-none bg-transparent pb-2 pt-1 text-base font-light text-white outline-none sm:text-sm"
        >
          <option value="" className="bg-night text-white/70">
            {t.selectFrom}
          </option>
          {pickups.map((p) => (
            <option key={p} value={p} className="bg-night text-white">
              {p}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t.to} htmlFor="picker-to">
        <select
          id="picker-to"
          name="to"
          defaultValue=""
          className="w-full appearance-none bg-transparent pb-2 pt-1 text-base font-light text-white outline-none sm:text-sm"
        >
          <option value="" className="bg-night text-white/70">
            {t.selectTo}
          </option>
          {dropoffs.map((d) => (
            <option key={d} value={d} className="bg-night text-white">
              {d}
            </option>
          ))}
        </select>
      </Field>

      <Field label={t.date} htmlFor="picker-date">
        <input
          id="picker-date"
          name="date"
          type="date"
          className="w-full appearance-none bg-transparent pb-2 pt-1 text-base font-light text-white outline-none [color-scheme:dark] sm:text-sm"
        />
      </Field>

      <Field label={t.passengers} htmlFor="picker-pax">
        <select
          id="picker-pax"
          name="pax"
          defaultValue="2"
          className="w-full appearance-none bg-transparent pb-2 pt-1 text-base font-light text-white outline-none sm:text-sm"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n} className="bg-night text-white">
              {n} {n === 1 ? t.passengerSingle : t.passengerPlural}
            </option>
          ))}
        </select>
      </Field>

      <button
        type="submit"
        className="group relative col-span-1 inline-flex h-12 items-center justify-center self-end overflow-hidden border border-gold px-8 text-xs font-medium uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold hover:text-night sm:col-span-2 lg:col-span-1"
      >
        <span className="relative z-10">{t.submit}</span>
      </button>
    </form>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="group relative flex flex-col gap-1 border-b border-white/15 pb-1 transition-colors focus-within:border-gold"
    >
      <span className="eyebrow text-white/45 transition-colors group-focus-within:text-gold">
        {label}
      </span>
      {children}
    </label>
  )
}
