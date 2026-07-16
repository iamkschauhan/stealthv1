import { ChevronDown, ChevronUp, Navigation, X } from 'lucide-react'
import { useState } from 'react'
import { useFeed } from './FeedContext'

const PLAN_TYPES = ['Friendship', 'Dating', 'Something casual']
const ACTIVITY_CATS = [
  'Creative',
  'Events & Outings',
  'Food & Drinks',
  'Games',
  'Lifestyle & Enrichment',
  'Sports & Outdoors',
  'Travel & Seasonal',
]
const ADDITIONAL = ['Last-minute', 'Couples plan']
const FRIENDSHIP_ROWS = [
  'Age',
  'Relationship status',
  'Children',
  'Education level',
  'Exercise',
  'Ethnicity',
  'Religion',
  'Politics',
  'Drinking',
  'Smoking',
  'Marijuana',
  'Drugs',
]

function Chip({
  label,
  selected,
  tone,
  onClick,
}: {
  label: string
  selected: boolean
  tone?: 'yellow' | 'brand'
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        'rounded-full px-3.5 py-2 text-[13px] font-medium',
        selected
          ? tone === 'yellow'
            ? 'bg-[#fdf6d2] text-[#c99214]'
            : 'bg-brand text-white'
          : 'bg-pill text-ink',
      ].join(' ')}
    >
      {label}
    </button>
  )
}

export function FilterSheet() {
  const {
    filterOpen,
    setFilterOpen,
    filters,
    setFilters,
    clearFilters,
    setDateOpen,
  } = useFeed()
  const [openRows, setOpenRows] = useState<string[]>(['Age'])

  if (!filterOpen) return null

  const dirty =
    filters.types.length > 0 ||
    filters.categories.length > 0 ||
    filters.additional.length > 0 ||
    !!filters.dateLabel ||
    !!filters.timeLabel

  function toggle(list: string[], item: string) {
    return list.includes(item) ? list.filter((x) => x !== item) : [...list, item]
  }

  return (
    <div className="fixed inset-0 z-[65] flex items-end md:items-center justify-center md:px-6">
      <button
        type="button"
        className="absolute inset-0 bg-black/40"
        onClick={() => setFilterOpen(false)}
      />
      <div className="relative z-10 flex h-[100dvh] md:h-[min(90dvh,820px)] w-full max-w-lg flex-col bg-white md:rounded-3xl shadow-2xl overflow-hidden">
        <header className="flex items-center gap-2 border-b border-gray-100 px-3 py-3 shrink-0">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setFilterOpen(false)}
            className="rounded-lg p-2 hover:bg-feed-gap"
          >
            <X size={22} />
          </button>
          <h1 className="flex-1 text-center text-[17px] font-bold pr-10">Filter</h1>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-5 pb-8">
          <h2 className="text-[20px] font-extrabold mb-4">Plans</h2>

          <p className="text-[13px] font-bold mb-2">Type</p>
          <div className="mb-5 flex flex-wrap gap-2">
            {PLAN_TYPES.map((t) => (
              <Chip
                key={t}
                label={t}
                tone="yellow"
                selected={filters.types.includes(t)}
                onClick={() =>
                  setFilters((f) => ({ ...f, types: toggle(f.types, t) }))
                }
              />
            ))}
          </div>

          <div className="mb-1 flex items-center justify-between">
            <p className="text-[13px] font-bold">Location</p>
            <span className="flex items-center gap-1 text-[12px] text-muted">
              <Navigation size={12} className="text-brand" />
              Current location {filters.zip}
            </span>
          </div>
          <div className="mb-5">
            <input
              type="range"
              min={1}
              max={50}
              value={filters.maxDistance}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxDistance: Number(e.target.value) }))
              }
              className="w-full accent-brand"
            />
            <div className="flex justify-between text-[12px] text-muted">
              <span>Maximum distance</span>
              <span>{filters.maxDistance}mi</span>
            </div>
          </div>

          <p className="text-[13px] font-bold mb-2">Date</p>
          <button
            type="button"
            onClick={() => setDateOpen(true)}
            className="mb-4 flex w-full items-center justify-between rounded-xl bg-onboard-input px-4 py-3.5 text-[14px]"
          >
            <span className={filters.dateLabel ? 'text-ink' : 'text-muted'}>
              {filters.dateLabel || 'Select date range'}
            </span>
            <ChevronDown size={16} className="text-muted" />
          </button>

          <p className="text-[13px] font-bold mb-2">Start time</p>
          <button
            type="button"
            onClick={() =>
              setFilters((f) => ({
                ...f,
                timeLabel: f.timeLabel ? '' : '11:30 AM to 2:15 PM',
              }))
            }
            className="mb-6 flex w-full items-center justify-between rounded-xl bg-onboard-input px-4 py-3.5 text-[14px]"
          >
            <span className={filters.timeLabel ? 'text-ink' : 'text-muted'}>
              {filters.timeLabel || 'Select time range'}
            </span>
            <ChevronDown size={16} className="text-muted" />
          </button>

          <h2 className="text-[18px] font-extrabold mb-3">Activity category</h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {ACTIVITY_CATS.map((c) => (
              <Chip
                key={c}
                label={c}
                selected={filters.categories.includes(c)}
                onClick={() =>
                  setFilters((f) => ({ ...f, categories: toggle(f.categories, c) }))
                }
              />
            ))}
          </div>

          <h2 className="text-[18px] font-extrabold mb-3">Additional</h2>
          <div className="mb-6 flex flex-wrap gap-2">
            {ADDITIONAL.map((a) => (
              <Chip
                key={a}
                label={a}
                selected={filters.additional.includes(a)}
                onClick={() =>
                  setFilters((f) => ({ ...f, additional: toggle(f.additional, a) }))
                }
              />
            ))}
          </div>

          {filters.types.includes('Friendship') ? (
            <>
              <h2 className="text-[18px] font-extrabold mb-2">Friendship</h2>
              <ul className="border-t border-gray-100">
                {FRIENDSHIP_ROWS.map((row) => {
                  const open = openRows.includes(row)
                  return (
                    <li key={row} className="border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() =>
                          setOpenRows((rows) =>
                            open ? rows.filter((r) => r !== row) : [...rows, row],
                          )
                        }
                        className="flex w-full items-center justify-between py-3.5 text-left"
                      >
                        <span className="text-[15px] font-medium">{row}</span>
                        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                      {open ? (
                        <p className="pb-3 text-[13px] text-muted">Any</p>
                      ) : null}
                    </li>
                  )
                })}
              </ul>
            </>
          ) : null}
        </div>

        <div className="shrink-0 border-t border-gray-100 px-5 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={() => setFilterOpen(false)}
            className={[
              'w-full rounded-full py-4 text-[15px] font-semibold',
              dirty ? 'bg-brand text-white' : 'bg-onboard-disabled text-[#c7c7cc]',
            ].join(' ')}
          >
            Apply
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="mt-2 w-full py-2 text-[15px] font-semibold text-brand"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  )
}
