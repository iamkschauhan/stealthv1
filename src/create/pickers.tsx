import { useMemo, useState } from 'react'
import { Search, X } from 'lucide-react'
import {
  ACTIVITY_CATEGORIES,
  LOCATION_SUGGESTIONS,
  SPOT_OPTIONS,
  TIME_OPTIONS,
} from './data'

export function BottomPicker({
  open,
  title,
  options,
  value,
  onSelect,
  onClose,
}: {
  open: boolean
  title?: string
  options: string[]
  value: string
  onSelect: (v: string) => void
  onClose: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end md:items-center md:justify-center px-0 md:px-6">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <span className="text-[14px] font-semibold text-ink">{title ?? 'Select'}</span>
          <button type="button" onClick={onClose} className="text-[15px] font-semibold text-brand">
            Done
          </button>
        </div>
        <ul className="max-h-[50dvh] overflow-y-auto py-2">
          {options.map((opt) => (
            <li key={opt}>
              <button
                type="button"
                onClick={() => {
                  onSelect(opt)
                  onClose()
                }}
                className={[
                  'w-full px-4 py-3.5 text-center text-[17px]',
                  value === opt ? 'bg-pill font-semibold text-ink' : 'text-ink/70',
                ].join(' ')}
              >
                {opt}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function TimePickerSheet({
  open,
  value,
  onSelect,
  onClose,
}: {
  open: boolean
  value: string
  onSelect: (v: string) => void
  onClose: () => void
}) {
  const parsed = useMemo(() => {
    const m = value.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i)
    if (!m) return { h: 7, min: 0, ampm: 'AM' as const }
    return { h: Number(m[1]), min: Number(m[2]), ampm: m[3].toUpperCase() as 'AM' | 'PM' }
  }, [value])

  const [h, setH] = useState(parsed.h)
  const [min, setMin] = useState(parsed.min)
  const [ampm, setAmpm] = useState<'AM' | 'PM'>(parsed.ampm)

  if (!open) return null

  const hours = Array.from({ length: 12 }, (_, i) => i + 1)
  const mins = [0, 15, 30, 45]

  return (
    <div className="fixed inset-0 z-[70] flex flex-col justify-end md:items-center md:justify-center">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md bg-white rounded-t-2xl md:rounded-2xl shadow-2xl">
        <div className="flex justify-end px-4 py-3 border-b border-gray-100">
          <button
            type="button"
            className="text-[15px] font-semibold text-brand"
            onClick={() => {
              onSelect(`${h}:${String(min).padStart(2, '0')} ${ampm}`)
              onClose()
            }}
          >
            Done
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2 px-6 py-6 text-center">
          <div className="max-h-48 overflow-y-auto">
            {hours.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setH(n)}
                className={[
                  'w-full py-2 text-[18px] rounded-lg',
                  h === n ? 'bg-pill font-bold' : 'text-muted',
                ].join(' ')}
              >
                {n}
              </button>
            ))}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {mins.map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setMin(n)}
                className={[
                  'w-full py-2 text-[18px] rounded-lg',
                  min === n ? 'bg-pill font-bold' : 'text-muted',
                ].join(' ')}
              >
                {String(n).padStart(2, '0')}
              </button>
            ))}
          </div>
          <div className="max-h-48 overflow-y-auto">
            {(['AM', 'PM'] as const).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAmpm(p)}
                className={[
                  'w-full py-2 text-[18px] rounded-lg',
                  ampm === p ? 'bg-pill font-bold' : 'text-muted',
                ].join(' ')}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <p className="pb-4 text-center text-[13px] text-muted">
          Or pick: {TIME_OPTIONS.slice(0, 4).join(' · ')}
        </p>
      </div>
    </div>
  )
}

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function startWeekday(year: number, month: number) {
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

export function DatePickerSheet({
  open,
  onSelect,
  onClose,
}: {
  open: boolean
  onSelect: (label: string) => void
  onClose: () => void
}) {
  const [selected, setSelected] = useState<number | null>(null)
  const year = 2021
  const month = 11
  const total = daysInMonth(year, month)
  const offset = startWeekday(year, month)
  const cells: (number | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: total }, (_, i) => i + 1),
  ]

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] flex flex-col bg-white md:bg-black/40 md:items-center md:justify-center md:px-6">
      <div className="flex h-full w-full max-w-lg flex-col bg-white md:h-auto md:max-h-[85dvh] md:rounded-3xl md:shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3 shrink-0">
          <button type="button" className="text-[15px] text-ink" onClick={onClose}>
            Cancel
          </button>
          <h1 className="text-[17px] font-bold">Date</h1>
          <button
            type="button"
            className="text-[15px] font-semibold text-brand"
            onClick={() => {
              if (selected != null) {
                const label = new Date(year, month, selected).toLocaleString('en', {
                  month: 'short',
                  day: 'numeric',
                })
                onSelect(label)
              }
              onClose()
            }}
          >
            Done
          </button>
        </header>
        <div className="px-4 py-5 overflow-y-auto">
          <h2 className="mb-3 text-[14px] font-semibold text-muted">December 2021</h2>
          <div className="mb-2 grid grid-cols-7 text-center text-[12px] text-muted">
            {WEEKDAYS.map((w, i) => (
              <span key={`${w}-${i}`}>{w}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-1">
            {cells.map((d, i) =>
              d == null ? (
                <span key={`e-${i}`} />
              ) : (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelected(d)}
                  className={[
                    'relative h-10 text-[14px]',
                    selected === d ? 'text-white' : 'text-ink',
                  ].join(' ')}
                >
                  {selected === d ? (
                    <span className="absolute inset-1 rounded-full bg-brand" />
                  ) : null}
                  <span className="relative z-10">{d}</span>
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export function ActivityPicker({
  open,
  onSelect,
  onClose,
  onSuggest,
}: {
  open: boolean
  onSelect: (activity: string) => void
  onClose: () => void
  onSuggest: () => void
}) {
  const [query, setQuery] = useState('')
  const [openCats, setOpenCats] = useState<string[]>(['sports', 'events'])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return ACTIVITY_CATEGORIES
    return ACTIVITY_CATEGORIES.map((c) => ({
      ...c,
      items: c.items.filter((i) => i.toLowerCase().includes(q)),
    })).filter((c) => c.items.length > 0)
  }, [query])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      <div className="mx-auto w-full max-w-2xl flex flex-col flex-1 min-h-0">
        <header className="flex items-center gap-2 px-3 py-3 border-b border-gray-50 shrink-0">
          <button type="button" aria-label="Back" onClick={onClose} className="p-2 text-ink">
            ‹
          </button>
          <div className="flex flex-1 items-center gap-2 rounded-full bg-onboard-input px-3 py-2.5">
            <Search size={16} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for an activity"
              className="w-full bg-transparent text-[15px] outline-none"
            />
            {query ? (
              <button type="button" onClick={() => setQuery('')}>
                <X size={16} className="text-muted" />
              </button>
            ) : null}
          </div>
        </header>
        <div className="px-4 py-2 flex justify-end shrink-0">
          <button type="button" onClick={onSuggest} className="text-[13px] font-medium text-brand">
            Can&apos;t find what you&apos;re looking for?
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-4 pb-8">
          <h2 className="mb-2 text-[17px] font-bold">Activities</h2>
          {filtered.map((cat) => {
            const open = openCats.includes(cat.id)
            return (
              <div key={cat.id} className="border-b border-gray-100">
                <button
                  type="button"
                  onClick={() =>
                    setOpenCats((ids) =>
                      open ? ids.filter((x) => x !== cat.id) : [...ids, cat.id],
                    )
                  }
                  className="flex w-full items-center justify-between py-3.5 text-left"
                >
                  <span className="text-[15px] font-medium text-ink">{cat.label}</span>
                  <span className="text-brand">{open ? '▴' : '▾'}</span>
                </button>
                {open ? (
                  <ul className="pb-2 pl-2">
                    {cat.items.map((item) => (
                      <li key={item}>
                        <button
                          type="button"
                          onClick={() => {
                            onSelect(item)
                            onClose()
                            setQuery('')
                          }}
                          className="w-full rounded-lg px-3 py-2.5 text-left text-[14px] text-ink hover:bg-feed-gap"
                        >
                          {item}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function LocationPicker({
  open,
  onSelect,
  onClose,
}: {
  open: boolean
  onSelect: (loc: string) => void
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const results = LOCATION_SUGGESTIONS.filter((l) =>
    l.toLowerCase().includes(query.trim().toLowerCase()),
  )

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col">
      <div className="mx-auto w-full max-w-2xl flex flex-col flex-1 min-h-0">
        <header className="flex items-center gap-2 px-3 py-3 border-b border-gray-50 shrink-0">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-onboard-input px-3 py-2.5">
            <Search size={16} className="text-muted" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Choose a location"
              className="w-full bg-transparent text-[15px] outline-none"
            />
          </div>
          <button type="button" onClick={onClose} className="text-[15px] font-semibold text-brand px-1">
            Cancel
          </button>
        </header>
        <div className="relative flex-1 bg-[#dfe8f0]">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              backgroundImage:
                'linear-gradient(#c5d4e0 1px, transparent 1px), linear-gradient(90deg, #c5d4e0 1px, transparent 1px)',
              backgroundSize: '40px 40px',
            }}
          />
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-4 w-4 rounded-full bg-brand ring-4 ring-brand/30" />
          <div className="absolute inset-x-0 top-0 max-h-[50%] overflow-y-auto bg-white/95 shadow-sm">
            {results.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => {
                  onSelect(loc)
                  onClose()
                  setQuery('')
                }}
                className="flex w-full items-center gap-3 border-b border-gray-100 px-4 py-3.5 text-left hover:bg-feed-gap"
              >
                <span className="text-brand">📍</span>
                <span className="text-[15px] text-ink">{loc}</span>
              </button>
            ))}
            {results.length === 0 ? (
              <p className="px-4 py-8 text-center text-[14px] text-muted">No locations found</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

export { SPOT_OPTIONS }
