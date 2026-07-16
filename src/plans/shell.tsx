import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav, SideNav } from '../components/BottomNav'
import { BrandMark } from '../components/Brand'
import { ShareModal } from '../share/ShareModal'
import { planShareUrl, type ShareKind } from '../share/messages'

export function PlansShell({
  children,
  tip,
  tipTitle = 'My Plans',
}: {
  children: ReactNode
  tip?: string
  tipTitle?: string
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
          <span className="text-[13px] text-muted">My Plans</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-start gap-0 lg:gap-6">
          <SideNav active="calendar" onChange={goNav} />

          <main className="flex-1 min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-10 md:pt-5">
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

      <BottomNav active="calendar" onChange={goNav} />
    </div>
  )
}

export function Sheet({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center px-0 md:px-6">
      <button type="button" aria-label="Dismiss" className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md md:max-w-lg rounded-t-[28px] md:rounded-3xl bg-white shadow-2xl max-h-[85dvh] overflow-y-auto pb-[env(safe-area-inset-bottom)]">
        <div className="sticky top-0 bg-white pt-3 pb-2 border-b border-gray-50">
          <div className="mx-auto mb-2 h-1 w-10 rounded-full bg-gray-200 md:hidden" />
          <h2 className="text-center text-[17px] font-bold">{title}</h2>
        </div>
        {children}
      </div>
    </div>
  )
}

export function SharePlanModal({
  open,
  onClose,
  url,
  kind = 'found',
  planId,
  showAppInvite = false,
}: {
  open: boolean
  onClose: () => void
  url?: string
  kind?: ShareKind
  planId?: string
  showAppInvite?: boolean
}) {
  const resolved = url ?? (planId ? planShareUrl(planId) : planShareUrl('share'))
  return (
    <ShareModal
      open={open}
      onClose={onClose}
      kind={kind}
      url={resolved}
      showAppInvite={showAppInvite}
    />
  )
}

export function ConfirmDialog({
  open,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  onCancel,
  onConfirm,
  children,
}: {
  open: boolean
  title: string
  message?: string
  cancelLabel?: string
  confirmLabel: string
  onCancel: () => void
  onConfirm: () => void
  children?: ReactNode
}) {
  if (!open) return null
  const single = cancelLabel === confirmLabel
  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center px-6">
      <button type="button" className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="px-5 py-5 text-center">
          <h3 className="text-[17px] font-bold text-ink">{title}</h3>
          {message ? (
            <p className="mt-2 text-[14px] leading-snug text-[#6b6b70]">{message}</p>
          ) : null}
          {children}
        </div>
        {single ? (
          <button
            type="button"
            className="w-full border-t border-gray-200 py-3.5 text-[15px] font-semibold text-brand"
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        ) : (
          <div className="grid grid-cols-2 border-t border-gray-200">
            <button
              type="button"
              className="border-r border-gray-200 py-3.5 text-[15px] text-brand"
              onClick={onCancel}
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              className="py-3.5 text-[15px] font-semibold text-brand"
              onClick={onConfirm}
            >
              {confirmLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
