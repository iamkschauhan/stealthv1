import { useMemo, useState } from 'react'
import { Calendar, Clock, MapPin, MoreHorizontal, Search, X } from 'lucide-react'
import { useFeed } from './FeedContext'

const RECENT_DEFAULT = ['Golf', 'Mexican food', 'Concert']

const PEOPLE = [
  { name: 'Nick', avatar: '/images/avatar-nick.jpg', meta: 'Host · Golf' },
  { name: 'Sarah', avatar: '/images/avatar-sarah.jpg', meta: 'Host · Concert' },
  { name: 'Jassie', avatar: '/images/avatar-jassie.jpg', meta: 'Couples plan' },
  { name: 'Zack', avatar: '/images/avatar-zack.jpg', meta: 'Sports' },
]

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, items, setMenuId } = useFeed()
  const [tab, setTab] = useState<'Plans' | 'People'>('Plans')
  const [query, setQuery] = useState('')
  const [recent, setRecent] = useState(RECENT_DEFAULT)

  const planResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return items.filter(
      (i) =>
        i.type === 'activity' &&
        (i.category.toLowerCase().includes(q) ||
          i.location.toLowerCase().includes(q) ||
          i.user.name.toLowerCase().includes(q) ||
          (i.title?.toLowerCase().includes(q) ?? false)),
    )
  }, [items, query])

  const peopleResults = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return PEOPLE.filter((p) => p.name.toLowerCase().includes(q))
  }, [query])

  if (!searchOpen) return null

  return (
    <div className="fixed inset-0 z-[65] bg-white flex flex-col">
      <div className="mx-auto w-full max-w-2xl flex flex-col flex-1 min-h-0">
        <header className="flex items-center gap-2 px-3 py-3 border-b border-gray-50 shrink-0">
          <div className="flex flex-1 items-center gap-2 rounded-full bg-onboard-input px-3 py-2.5">
            <Search size={16} className="text-muted shrink-0" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && query.trim()) {
                  setRecent((r) => [query.trim(), ...r.filter((x) => x !== query.trim())].slice(0, 6))
                }
              }}
              placeholder="Search"
              className="w-full bg-transparent text-[15px] outline-none"
            />
            {query ? (
              <button type="button" onClick={() => setQuery('')} className="text-muted">
                <X size={16} />
              </button>
            ) : null}
          </div>
          <button
            type="button"
            onClick={() => {
              setSearchOpen(false)
              setQuery('')
            }}
            className="text-[15px] font-semibold text-brand shrink-0 px-1"
          >
            Cancel
          </button>
        </header>

        <div className="px-4 pt-3 shrink-0">
          <div className="flex rounded-full bg-pill p-1">
            {(['Plans', 'People'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={[
                  'flex-1 rounded-full py-2.5 text-[13px] font-semibold',
                  tab === t ? 'bg-brand text-white' : 'text-ink/70',
                ].join(' ')}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-4 pb-10">
          {!query.trim() ? (
            <>
              <p className="mb-2 text-[12px] text-muted">Recent searches</p>
              <ul>
                {recent.map((r) => (
                  <li key={r} className="flex items-center justify-between border-b border-gray-100 py-3.5">
                    <button
                      type="button"
                      onClick={() => setQuery(r)}
                      className="text-[15px] font-bold text-ink"
                    >
                      {r}
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove ${r}`}
                      onClick={() => setRecent((list) => list.filter((x) => x !== r))}
                      className="text-muted p-1"
                    >
                      <X size={14} />
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-16 text-center text-[14px] text-muted">
                {tab === 'Plans'
                  ? 'Search by activity or location to find plans.'
                  : 'Search by name to find people.'}
              </p>
            </>
          ) : tab === 'Plans' ? (
            planResults.length === 0 ? (
              <p className="py-16 text-center text-[14px] text-muted">No plans found.</p>
            ) : (
              <ul className="space-y-3">
                {planResults.map((p) =>
                  p.type === 'activity' ? (
                    <li
                      key={p.id}
                      className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm"
                    >
                      <div className="mb-2 flex items-start justify-between gap-2">
                        <span className="rounded-full bg-pill px-2.5 py-1 text-[11px] font-semibold text-brand">
                          Closes — in {p.id === '1' ? '21 hours' : '2 days'}
                        </span>
                        <button
                          type="button"
                          aria-label="More"
                          onClick={() => setMenuId(p.id)}
                          className="text-muted"
                        >
                          <MoreHorizontal size={18} />
                        </button>
                      </div>
                      <p className="text-[16px] font-bold text-ink">{p.category}</p>
                      <p className="mt-2 flex flex-wrap items-center gap-3 text-[13px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={14} /> {p.date}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock size={14} /> {p.time}
                        </span>
                      </p>
                      <p className="mt-1 flex items-center gap-1 text-[13px] text-muted">
                        <MapPin size={14} /> {p.location}
                      </p>
                      <div className="mt-3 flex items-center gap-2">
                        <img
                          src={p.user.avatar}
                          alt=""
                          className="h-9 w-9 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-[14px] font-bold">{p.user.name}</p>
                          <p className="text-[12px] text-muted">Host</p>
                        </div>
                      </div>
                    </li>
                  ) : null,
                )}
              </ul>
            )
          ) : peopleResults.length === 0 ? (
            <p className="py-16 text-center text-[14px] text-muted">No people found.</p>
          ) : (
            <ul>
              {peopleResults.map((p) => (
                <li key={p.name} className="flex items-center gap-3 border-b border-gray-100 py-3.5">
                  <img src={p.avatar} alt="" className="h-12 w-12 rounded-full object-cover" />
                  <div>
                    <p className="text-[15px] font-bold">{p.name}</p>
                    <p className="text-[12px] text-muted">{p.meta}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
