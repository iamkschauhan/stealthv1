import { Link, useNavigate } from 'react-router-dom'
import { Header } from './components/Header'
import { BottomNav, SideNav, useAppNav } from './components/BottomNav'
import { FeedCard } from './components/FeedCard'
import { RightPanel } from './components/RightPanel'
import { FeedProvider, useFeed } from './feed/FeedContext'
import { FeedOverlays } from './feed/overlays'
import { FilterSheet } from './feed/FilterSheet'
import { SearchOverlay } from './feed/SearchOverlay'
import { DatePicker } from './feed/DatePicker'

function MadePlansBanner() {
  return (
    <div className="relative mx-auto mb-2 w-full max-w-xl lg:max-w-2xl px-4 md:px-0">
      <div className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-3.5 shadow-sm">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-[12px] font-bold text-white">
          SA
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold text-brand">MEXICAN FOOD</p>
          <p className="text-[12px] text-muted truncate">
            Sat, Dec 23 · 7:00 AM · Laurel Lanes Country Club
          </p>
        </div>
        <span className="absolute top-2.5 right-6 md:right-2.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
          2
        </span>
      </div>
    </div>
  )
}

function FeedBody() {
  const { setActive } = useAppNav()
  const navigate = useNavigate()
  const { filteredItems } = useFeed()

  function onNav(id: string) {
    setActive(id)
    if (id === 'profile') navigate('/profile')
    if (id === 'home') navigate('/home')
    if (id === 'alerts') navigate('/notifications')
    if (id === 'create') navigate('/create')
    if (id === 'calendar') navigate('/plans')
  }

  return (
    <div className="min-h-full bg-feed-gap">
      <Header />

      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-start gap-0 lg:gap-6">
          <SideNav
            active="home"
            onChange={onNav}
            stickyTopClass="top-[108px]"
            heightClass="h-[calc(100dvh-108px)]"
          />

          <main className="flex-1 min-w-0 pb-24 md:pb-8 pt-0 md:pt-5">
            <MadePlansBanner />
            <div className="mx-auto w-full max-w-xl lg:max-w-2xl flex flex-col gap-2 md:gap-4">
              {filteredItems.length === 0 ? (
                <div className="rounded-2xl bg-white md:border md:border-gray-100 px-6 py-16 text-center">
                  <p className="text-[15px] font-semibold text-ink">No plans match</p>
                  <p className="mt-1 text-[13px] text-muted">
                    Try clearing filters or picking another category.
                  </p>
                </div>
              ) : (
                filteredItems.map((item) => <FeedCard key={item.id} item={item} />)
              )}
            </div>
            <div className="mx-auto mt-4 max-w-xl lg:max-w-2xl px-4 md:px-0 flex flex-wrap gap-4">
              <Link
                to="/onboarding/splash"
                className="inline-flex text-[13px] font-medium text-brand hover:underline"
              >
                Replay onboarding →
              </Link>
              <Link
                to="/profile"
                className="inline-flex text-[13px] font-medium text-brand hover:underline"
              >
                Open profile →
              </Link>
              <Link
                to="/create/plan"
                className="inline-flex text-[13px] font-medium text-brand hover:underline"
              >
                Manage plan →
              </Link>
            </div>
          </main>

          <RightPanel />
        </div>
      </div>

      <BottomNav active="home" onChange={onNav} />
      <FeedOverlays />
      <FilterSheet />
      <SearchOverlay />
      <DatePicker />
    </div>
  )
}

export function HomeFeed() {
  return (
    <FeedProvider>
      <FeedBody />
    </FeedProvider>
  )
}
