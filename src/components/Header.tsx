import { SlidersHorizontal, Search } from 'lucide-react'
import { categories } from '../data'
import { useFeed } from '../feed/FeedContext'
import { BrandTitle } from './Brand'

export function Header() {
  const {
    activeCategory,
    setActiveCategory,
    setFilterOpen,
    setSearchOpen,
    filters,
  } = useFeed()

  const filterCount =
    filters.types.length +
    filters.categories.length +
    filters.additional.length +
    (filters.dateLabel ? 1 : 0) +
    (filters.timeLabel ? 1 : 0)

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-gray-100">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3 md:py-4">
          <BrandTitle />
          <div className="flex items-center gap-3 md:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-full bg-pill px-4 py-2.5 min-w-[220px] lg:min-w-[280px] text-left hover:bg-[#e8ecf8]"
            >
              <Search size={18} className="text-muted shrink-0" strokeWidth={2} />
              <span className="text-[14px] text-muted">Search plans, people, places…</span>
            </button>
            <button
              type="button"
              aria-label="Filters"
              onClick={() => setFilterOpen(true)}
              className="relative text-ink p-1.5 rounded-lg hover:bg-feed-gap"
            >
              <SlidersHorizontal size={22} strokeWidth={2} />
              {filterCount > 0 ? (
                <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
                  {filterCount}
                </span>
              ) : null}
            </button>
            <button
              type="button"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
              className="sm:hidden text-ink p-1.5 rounded-lg hover:bg-feed-gap"
            >
              <Search size={22} strokeWidth={2} />
            </button>
          </div>
        </div>

        <div className="flex gap-2 pb-3 overflow-x-auto no-scrollbar">
          {categories.map((cat) => {
            const active = cat === activeCategory
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat === activeCategory ? '' : cat)}
                className={[
                  'shrink-0 rounded-full px-4 py-2 text-[13px] font-medium whitespace-nowrap transition-colors bg-pill text-ink',
                  active ? 'ring-1 ring-brand/25 bg-brand text-white' : '',
                ].join(' ')}
              >
                {cat}
              </button>
            )
          })}
        </div>
      </div>
    </header>
  )
}
