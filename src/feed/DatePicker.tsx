import { useMemo, useState } from 'react'
import { useFeed } from './FeedContext'

const WEEKDAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function startWeekday(year: number, month: number) {
  // Monday-first: JS Sunday=0 → convert
  const d = new Date(year, month, 1).getDay()
  return d === 0 ? 6 : d - 1
}

function MonthGrid({
  year,
  month,
  start,
  end,
  onPick,
}: {
  year: number
  month: number
  start: number | null
  end: number | null
  onPick: (day: number, year: number, month: number) => void
}) {
  const total = daysInMonth(year, month)
  const offset = startWeekday(year, month)
  const label = new Date(year, month, 1).toLocaleString('en', {
    month: 'long',
    year: 'numeric',
  })
  const cells = useMemo(() => {
    const arr: (number | null)[] = Array.from({ length: offset }, () => null)
    for (let d = 1; d <= total; d++) arr.push(d)
    return arr
  }, [offset, total])

  function key(d: number) {
    return year * 10000 + month * 100 + d
  }

  const startKey = start
  const endKey = end

  return (
    <section className="mb-8">
      <h2 className="mb-3 text-[14px] font-semibold text-muted">{label}</h2>
      <div className="mb-2 grid grid-cols-7 text-center text-[12px] text-muted">
        {WEEKDAYS.map((w, i) => (
          <span key={`${w}-${i}`}>{w}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-y-1">
        {cells.map((d, i) => {
          if (d == null) return <span key={`e-${i}`} />
          const k = key(d)
          const isStart = startKey === k
          const isEnd = endKey === k
          const inRange =
            startKey != null && endKey != null && k > startKey && k < endKey
          return (
            <button
              key={k}
              type="button"
              onClick={() => onPick(d, year, month)}
              className={[
                'relative h-10 text-[14px]',
                inRange ? 'bg-brand/15' : '',
                isStart || isEnd ? 'text-white' : 'text-ink',
              ].join(' ')}
            >
              {(isStart || isEnd) && (
                <span className="absolute inset-1 rounded-full bg-brand" />
              )}
              {inRange && (
                <span className="absolute inset-y-1 inset-x-0 bg-brand/15" />
              )}
              <span className="relative z-10">{d}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

export function DatePicker() {
  const { dateOpen, setDateOpen, setFilters } = useFeed()
  const [start, setStart] = useState<number | null>(null)
  const [end, setEnd] = useState<number | null>(null)

  if (!dateOpen) return null

  function onPick(day: number, year: number, month: number) {
    const k = year * 10000 + month * 100 + day
    if (start == null || (start != null && end != null)) {
      setStart(k)
      setEnd(null)
      return
    }
    if (k < start) {
      setEnd(start)
      setStart(k)
    } else {
      setEnd(k)
    }
  }

  function labelFor(k: number) {
    const y = Math.floor(k / 10000)
    const m = Math.floor((k % 10000) / 100)
    const d = k % 100
    return new Date(y, m, d).toLocaleString('en', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="fixed inset-0 z-[70] bg-white flex flex-col md:items-center md:bg-black/40 md:justify-center md:px-6">
      <div className="flex h-full w-full max-w-lg flex-col bg-white md:h-[min(85dvh,720px)] md:rounded-3xl md:shadow-2xl overflow-hidden">
        <header className="flex items-center justify-between border-b border-gray-100 px-4 py-3 shrink-0">
          <button
            type="button"
            className="text-[15px] text-ink"
            onClick={() => setDateOpen(false)}
          >
            Cancel
          </button>
          <h1 className="text-[17px] font-bold">Date</h1>
          <button
            type="button"
            className="text-[15px] font-semibold text-brand"
            onClick={() => {
              if (start != null) {
                const label =
                  end != null
                    ? `${labelFor(start)} - ${labelFor(end)}`
                    : labelFor(start)
                setFilters((f) => ({ ...f, dateLabel: label }))
              }
              setDateOpen(false)
            }}
          >
            Done
          </button>
        </header>
        <div className="flex-1 overflow-y-auto px-4 py-5">
          <MonthGrid year={2021} month={11} start={start} end={end} onPick={onPick} />
          <MonthGrid year={2022} month={0} start={start} end={end} onPick={onPick} />
        </div>
      </div>
    </div>
  )
}
