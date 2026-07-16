import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav, SideNav } from '../components/BottomNav'
import { BrandMark } from '../components/Brand'

export function NotifyShell({
  children,
  tip,
  tipTitle = 'Inbox',
  hideNav = false,
  className = '',
}: {
  children: ReactNode
  tip?: string
  tipTitle?: string
  hideNav?: boolean
  className?: string
}) {
  const navigate = useNavigate()

  function goNav(id: string) {
    if (id === 'home') navigate('/home')
    if (id === 'profile') navigate('/profile')
    if (id === 'alerts') navigate('/notifications')
    if (id === 'create') navigate('/create')
    if (id === 'calendar') navigate('/plans')
  }

  return (
    <div className="min-h-[100dvh] bg-feed-gap">
      <div className="hidden md:block sticky top-0 z-30 border-b border-gray-100 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 lg:px-8 py-3">
          <button
            type="button"
            onClick={() => navigate('/home')}
            className="text-left"
          >
            <BrandMark />
          </button>
          <span className="text-[13px] text-muted">Notifications & Messages</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-start gap-0 lg:gap-6">
          {!hideNav ? <SideNav active="alerts" onChange={goNav} /> : null}

          <main
            className={[
              'flex-1 min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-10 md:pt-5',
              className,
            ].join(' ')}
          >
            {children}
          </main>

          {tip ? (
            <aside className="hidden xl:block w-80 shrink-0 sticky top-[73px] py-5">
              <div className="rounded-2xl border border-gray-100 bg-white p-4">
                <h2 className="text-[15px] font-bold text-ink mb-2">{tipTitle}</h2>
                <p className="text-[13px] text-muted leading-relaxed">{tip}</p>
              </div>
            </aside>
          ) : null}
        </div>
      </div>

      {!hideNav ? <BottomNav active="alerts" onChange={goNav} /> : null}
    </div>
  )
}

export function ManageSheet({
  open,
  title = 'Manage',
  onClose,
  children,
}: {
  open: boolean
  title?: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-0 md:px-6">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl pb-[env(safe-area-inset-bottom)]">
        <div className="pt-3 pb-2 px-4">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
          <h2 className="text-center text-[17px] font-bold text-ink">{title}</h2>
        </div>
        <div className="px-2 pb-4">{children}</div>
      </div>
    </div>
  )
}
