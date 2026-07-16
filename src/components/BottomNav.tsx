import {
  Home,
  CalendarDays,
  Plus,
  Bell,
  SquareUserRound,
} from 'lucide-react'
import { useState } from 'react'

const tabs = [
  { id: 'home', label: 'Home', Icon: Home },
  { id: 'calendar', label: 'Calendar', Icon: CalendarDays },
  { id: 'create', label: 'Create', Icon: Plus },
  { id: 'alerts', label: 'Notifications', Icon: Bell },
  { id: 'profile', label: 'Profile', Icon: SquareUserRound },
] as const

type NavProps = {
  active: string
  onChange: (id: string) => void
  /** Sticky top offset — home header is taller (~108px); brand-bar shells use ~57px */
  stickyTopClass?: string
  heightClass?: string
}

export function SideNav({
  active,
  onChange,
  stickyTopClass = 'top-[57px]',
  heightClass = 'h-[calc(100dvh-57px)]',
}: NavProps) {
  return (
    <aside
      className={[
        'hidden md:flex sticky shrink-0 flex-col border-r border-gray-100 bg-white py-4 px-2 lg:px-3',
        'w-[72px] lg:w-56',
        stickyTopClass,
        heightClass,
      ].join(' ')}
    >
      <div className="flex flex-col gap-1">
        {tabs.map(({ id, label, Icon }) => {
          if (id === 'create') {
            return (
              <button
                key={id}
                type="button"
                onClick={() => onChange(id)}
                className="flex items-center justify-center lg:justify-start gap-3 rounded-xl bg-ink text-white px-0 lg:px-4 py-3 mt-1 mb-1 hover:bg-black transition-colors"
              >
                <Plus size={22} strokeWidth={2.5} />
                <span className="hidden lg:inline text-[14px] font-semibold">
                  Create plan
                </span>
              </button>
            )
          }

          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={[
                'flex items-center justify-center lg:justify-start gap-3 rounded-xl px-0 lg:px-4 py-3 transition-colors',
                isActive
                  ? 'bg-pill text-brand'
                  : 'text-muted hover:bg-feed-gap hover:text-ink',
              ].join(' ')}
            >
              <Icon size={22} strokeWidth={isActive ? 2.25 : 1.75} />
              <span
                className={[
                  'hidden lg:inline text-[14px]',
                  isActive ? 'font-semibold' : 'font-medium',
                ].join(' ')}
              >
                {label}
              </span>
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export function BottomNav({ active, onChange }: NavProps) {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white border-t border-gray-100">
      <div className="flex items-center justify-around px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {tabs.map(({ id, label, Icon }) => {
          if (id === 'create') {
            return (
              <button
                key={id}
                type="button"
                aria-label={label}
                onClick={() => onChange(id)}
                className="flex h-12 w-12 items-center justify-center rounded-full bg-ink text-white shadow-md -mt-1"
              >
                <Plus size={26} strokeWidth={2.5} />
              </button>
            )
          }

          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              aria-label={label}
              onClick={() => onChange(id)}
              className={[
                'flex h-11 w-11 items-center justify-center',
                isActive ? 'text-brand' : 'text-muted',
              ].join(' ')}
            >
              <Icon size={24} strokeWidth={isActive ? 2.25 : 1.75} />
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export function useAppNav() {
  const [active, setActive] = useState('home')
  return { active, setActive }
}
