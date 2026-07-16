import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { BottomNav, SideNav } from '../components/BottomNav'
import { BrandMark } from '../components/Brand'

export function SettingsShell({
  title,
  children,
  footer,
  saveLabel,
  onSave,
  canSave = true,
  backTo = '/profile',
  tip,
}: {
  title: string
  children: ReactNode
  footer?: ReactNode
  saveLabel?: string
  onSave?: () => void
  canSave?: boolean
  backTo?: string
  tip?: string
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
          <span className="text-[13px] text-muted">Settings</span>
        </div>
      </div>

      <div className="mx-auto w-full max-w-7xl px-0 sm:px-6 lg:px-8">
        <div className="flex items-start gap-0 lg:gap-6">
          <SideNav active="profile" onChange={goNav} />

          <main className="flex-1 min-w-0 pb-[calc(5.5rem+env(safe-area-inset-bottom))] md:pb-10 md:pt-5">
            <div className="mx-auto flex w-full max-w-xl lg:max-w-2xl min-h-[100dvh] md:min-h-0 flex-col bg-white md:rounded-2xl md:border md:border-gray-100 md:shadow-sm overflow-hidden">
              <header className="sticky top-0 md:top-[57px] z-20 flex items-center gap-2 border-b border-gray-100 bg-white px-2 sm:px-3 py-3">
                <button
                  type="button"
                  aria-label="Back"
                  onClick={() => navigate(backTo)}
                  className="rounded-lg p-2 text-ink hover:bg-feed-gap shrink-0"
                >
                  <ChevronLeft size={24} strokeWidth={2} />
                </button>
                <h1 className="flex-1 text-center text-[16px] sm:text-[17px] font-bold text-ink truncate px-1">
                  {title}
                </h1>
                {saveLabel && onSave ? (
                  <button
                    type="button"
                    disabled={!canSave}
                    onClick={onSave}
                    className={[
                      'px-2 sm:px-3 py-1.5 text-[14px] sm:text-[15px] font-semibold shrink-0',
                      canSave ? 'text-brand' : 'text-[#c7c7cc]',
                    ].join(' ')}
                  >
                    {saveLabel}
                  </button>
                ) : (
                  <span className="w-10 shrink-0" />
                )}
              </header>

              <div className="flex-1 overflow-y-auto px-4 sm:px-5 md:px-6 py-4 pb-6">
                {children}
              </div>

              {footer ? (
                <div className="sticky bottom-0 md:static px-4 sm:px-5 md:px-6 pb-[max(1rem,env(safe-area-inset-bottom))] md:pb-5 pt-2 border-t border-gray-50 bg-white">
                  {footer}
                </div>
              ) : null}
            </div>
          </main>

          <aside className="hidden xl:block w-80 shrink-0 sticky top-[73px] py-5">
            <div className="rounded-2xl border border-gray-100 bg-white p-4">
              <h2 className="text-[15px] font-bold text-ink mb-2">Settings</h2>
              <p className="text-[13px] text-muted leading-relaxed">
                {tip ??
                  'Manage preferences, privacy, notifications, and account security. Changes save when you tap Save.'}
              </p>
            </div>
          </aside>
        </div>
      </div>

      <BottomNav active="profile" onChange={goNav} />
    </div>
  )
}

export function SettingsRow({
  label,
  onClick,
  right,
  subtitle,
  danger,
  accent,
}: {
  label: string
  onClick?: () => void
  right?: ReactNode
  subtitle?: string
  danger?: boolean
  accent?: boolean
}) {
  const Comp = onClick ? 'button' : 'div'
  return (
    <Comp
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      className={[
        'flex w-full items-center gap-3 border-b border-gray-100 py-3.5 sm:py-4 text-left',
        onClick ? 'hover:bg-feed-gap/60 -mx-1 px-1 rounded-lg' : '',
      ].join(' ')}
    >
      <div className="min-w-0 flex-1">
        <p
          className={[
            'text-[14px] sm:text-[15px] leading-snug',
            danger ? 'text-red-500 font-medium' : accent ? 'text-brand font-medium' : 'text-ink',
          ].join(' ')}
        >
          {label}
        </p>
        {subtitle ? (
          <p className="mt-1 text-[12px] leading-snug text-muted">{subtitle}</p>
        ) : null}
      </div>
      {right ?? (onClick ? <span className="text-muted text-lg shrink-0">›</span> : null)}
    </Comp>
  )
}

export function SettingsToggle({
  checked,
  onChange,
}: {
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={[
        'relative h-[31px] w-[51px] rounded-full transition-colors shrink-0',
        checked ? 'bg-[#34c759]' : 'bg-[#e5e5ea]',
      ].join(' ')}
    >
      <span
        className={[
          'absolute top-[2px] left-[2px] h-[27px] w-[27px] rounded-full bg-white shadow transition-transform',
          checked ? 'translate-x-[20px]' : '',
        ].join(' ')}
      />
    </button>
  )
}

export function Segmented({
  options,
  value,
  onChange,
}: {
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="mb-5 flex rounded-full bg-pill p-1 gap-0.5">
      {options.map((opt) => {
        const active = opt === value
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onChange(opt)}
            className={[
              'flex-1 min-w-0 rounded-full py-2.5 text-[12px] sm:text-[13px] font-semibold transition-colors',
              active ? 'bg-brand text-white shadow-sm' : 'text-ink/70',
            ].join(' ')}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

export function ConfirmModal({
  open,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel,
  confirmDanger,
  onCancel,
  onConfirm,
  children,
}: {
  open: boolean
  title: string
  message?: string
  cancelLabel?: string
  confirmLabel: string
  confirmDanger?: boolean
  onCancel: () => void
  onConfirm: () => void
  children?: ReactNode
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center px-4 sm:px-8 pb-[max(1rem,env(safe-area-inset-bottom))] sm:pb-0">
      <button
        type="button"
        aria-label="Dismiss"
        className="absolute inset-0 bg-black/40"
        onClick={onCancel}
      />
      <div className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="px-5 py-5 text-center">
          <h3 className="text-[17px] font-bold text-ink">{title}</h3>
          {message ? (
            <p className="mt-2 text-[14px] leading-snug text-[#6b6b70]">{message}</p>
          ) : null}
          {children}
        </div>
        {cancelLabel === confirmLabel ? (
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
              className={[
                'py-3.5 text-[15px] font-semibold',
                confirmDanger ? 'text-red-500' : 'text-brand',
              ].join(' ')}
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
