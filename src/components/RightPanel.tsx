import { Calendar, MapPin, Users } from 'lucide-react'
import { feed } from '../data'

export function RightPanel() {
  const upcoming = feed.filter((item) => item.type === 'activity').slice(0, 3)

  return (
    <aside className="hidden xl:block w-80 shrink-0 sticky top-[108px] h-[calc(100dvh-108px)] overflow-y-auto py-5 pl-2 pr-2">
      <div className="rounded-2xl bg-white border border-gray-100 p-4 mb-4">
        <h2 className="text-[15px] font-bold text-ink mb-3">Your next plans</h2>
        <div className="flex flex-col gap-3">
          {upcoming.map((item) => {
            if (item.type !== 'activity') return null
            return (
              <div
                key={item.id}
                className="flex gap-3 rounded-xl p-2 hover:bg-feed-gap transition-colors cursor-pointer"
              >
                <img
                  src={item.image}
                  alt=""
                  className="h-14 w-14 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-ink truncate">
                    {item.title ?? item.category}
                  </p>
                  <p className="flex items-center gap-1 text-[12px] text-muted mt-0.5">
                    <Calendar size={12} />
                    {item.date}
                  </p>
                  <p className="flex items-center gap-1 text-[12px] text-muted truncate">
                    <MapPin size={12} />
                    {item.location}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl bg-white border border-gray-100 p-4">
        <h2 className="text-[15px] font-bold text-ink mb-3">Trending near you</h2>
        <ul className="flex flex-col gap-2.5">
          {['Pick-up soccer', 'Weekend brunch', 'Live jazz night', 'Morning hike'].map(
            (label, i) => (
              <li
                key={label}
                className="flex items-center justify-between text-[13px] text-ink"
              >
                <span className="flex items-center gap-2">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-pill text-brand text-[11px] font-bold">
                    {i + 1}
                  </span>
                  {label}
                </span>
                <Users size={14} className="text-muted" />
              </li>
            ),
          )}
        </ul>
      </div>
    </aside>
  )
}
